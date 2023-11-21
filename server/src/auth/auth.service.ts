import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import axios from 'axios';

@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
                private readonly jwtService: JwtService) {}

    async hashPassword(password: string): Promise<string>{
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    async findUser(username: string): Promise<User>{
        return await this.userModel.findOne({ username });
    }

    async findEmail(email: string): Promise<User>{
        return await this.userModel.findOne({ email });
    }

    async register(email: string, username: string, password: string, services: [{}]) {
        const user = new this.userModel({email, username, password: await this.hashPassword(password), services});
        this.userModel.create(user);

        const payload = { username: user.username};
        const token = await this.jwtService.sign(payload);
        return {token};
    }

    async login(username: string, password: string): Promise<any>{
        const user = await this.findUser(username);
        if(user && await bcrypt.compare(password, user.password)){
            const payload = { username: user.username};
            const token = await this.jwtService.sign(payload);
            return {user, token};
        }
        return null;
    }

    async discordLogin(req: any, code: string) {
        const data = {
            'client_id':  process.env.DISCORD_CLIENT_ID,
            'client_secret': process.env.DISCORD_CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': "http://localhost:8081"
        }
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        try {
            const res = await axios.post('https://discord.com/api/oauth2/token', data, {headers});
            if (res.data.access_token) {
                const discordUser = await axios.get('https://discord.com/api/users/@me', {headers: {Authorization: `Bearer ${res.data.access_token}`}})
                // Find user with same email in db
                let user = await this.findEmail(discordUser.data.email);
                if (!user) {
                    const user = new this.userModel({email: discordUser.data.email, username: discordUser.data.username, password: await this.hashPassword(discordUser.data.id), services: []});
                    this.userModel.create(user);
                    const payload = { username: discordUser.data.username};
                    const token = await this.jwtService.sign(payload);
                    return {user, token};
                }
                const payload = { username: user.username};
                const token = await this.jwtService.sign(payload);
                return {user, token};
            }
        } catch (error) {
            return error
        }
    }
}