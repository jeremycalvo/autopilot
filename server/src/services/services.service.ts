import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ServicesService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
                private readonly jwtService: JwtService) {}

    async getConnectedServices(req: any) {
        const token = req.headers.authorization.split(' ')[1]
        var User = await this.userModel.findOne({username: this.jwtService.decode(token)["username"]});
        var services = []
        for (let i = 0; i < User.services.length; i++) {
            if (User.services[i].isConnected) {
                services.push(User.services[i].name.toLowerCase())
            }
        }
        return services
    }
}
