import { Injectable } from '@nestjs/common';
import { Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IntegrationService } from '../integration.service';
import { Client, GatewayIntentBits, Message, TextChannel } from 'discord.js';
import { Recipe } from 'src/schemas/recipe.schema';
import axios from 'axios';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class DiscordService {
    private readonly client: Client;
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
                @InjectModel('Recipe') private readonly recipeModel: Model<Recipe>,
                @Inject(forwardRef(() => IntegrationService))
                private readonly integrationService: IntegrationService,
                private readonly jwtService: JwtService,
                private readonly utils: UtilsService) {
                    this.client = new Client({intents: []});
                    this.client.login(process.env.DISCORD_BOT_TOKEN);
                }

    async auth(code: string, req: any): Promise<any>{
        const data = {
            'client_id':  process.env.DISCORD_CLIENT_ID,
            'client_secret': process.env.DISCORD_CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': "http://localhost:8081/services"
        }
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        try {
            const res = await axios.post('https://discord.com/api/oauth2/token', data, {headers});
            const service = {
                name:"Discord",
                accessToken: res.data.access_token,
                refreshToken: res.data.refresh_token,
                isConnected: true,
            }
            this.integrationService.setService(service, req.headers.authorization.split(' ')[1])
            return res.data;
        } catch (error) {
            return error
        }
    }

    async me(req: any): Promise<any> {
        const token = req.headers.authorization.split(' ')[1]
        const user = await this.userModel.findOne({username: this.jwtService.decode(token)["username"]})

        let accessToken: any
        if (user.services.find(service => service.name === "Discord" && service.isConnected)) {
            accessToken = user.services.find(service => service.name === "Discord" && service.isConnected).accessToken;
        } else {
            return "Not connected to Discord"
        }
        const headers = {
            'Authorization': 'Bearer ' + accessToken
        }
        const res = await axios.get('https://discord.com/api/users/@me', {headers})
        return res.data
    }

    async sendMessage(message: string, channelId: string): Promise<Message> {
        const channel = await this.client.channels.fetch(channelId)
        if (channel instanceof TextChannel) {
            return channel.send(message)
        } else {
            return null
        }
    }

    async getLastMessage(channelId: string): Promise<any> {
        try {
            const channel = await this.client.channels.fetch(channelId)
            if (channel instanceof TextChannel) {
                const messages = await channel.messages.fetch({limit: 1})
                const message = messages.first()
                const result = {
                    content: message.content,
                    author: message.author.username,
                    id: message.id
                }
                return result
            } else {
                return null
            }
        } catch (error) {
            return null
        }
    }

    async handleReaction(recipe: Recipe, result: any) {
        if (recipe.reaction.function == "SEND_MESSAGE") {
            this.reactionSendMessage(recipe, result)
        }
    }

    async reactionSendMessage(recipe: Recipe, result: any) {
        const params = recipe.reaction.params
        const message = this.utils.replaceParams(params[1], result)
        this.sendMessage(message, params[0])
    }

    async triggerNewMessage(recipe: Recipe) {
        const params = recipe.action.params
        const message = await this.getLastMessage(params[0])
        if (!message) return
        if (message.id != recipe.action.id && message.content == params[1]) {
            recipe.action.id = message.id
            // Update recipe in db
            await this.recipeModel.updateOne({_id: recipe._id}, recipe)
            this.integrationService.executeReaction(recipe, message)
        }
    }

    async triggerNewMessageContaining(recipe: Recipe) {
        const params = recipe.action.params
        const message = await this.getLastMessage(params[0])
        if (!message) return
        if (message.id != recipe.action.id && this.utils.includesString(message.content, params[1])) {
            recipe.action.id = message.id
            await this.recipeModel.updateOne({_id: recipe._id}, recipe)
            this.integrationService.executeReaction(recipe, message)
        }
    }

    async triggerNewMessageFrom(recipe: Recipe) {
        const params = recipe.action.params
        const message = await this.getLastMessage(params[0])
        if (!message) return
        if (message.id != recipe.action.id && message.author === recipe.action.params[1]) {
            recipe.action.id = message.id
            await this.recipeModel.updateOne({_id: recipe._id}, recipe)
            this.integrationService.executeReaction(recipe, message)
        }
    }

    async handleTriggers(recipe: Recipe) {
        if (recipe.action.trigger == "NEW_MESSAGE")
            this.triggerNewMessage(recipe)
        else if (recipe.action.trigger == "NEW_MESSAGE_CONTAINING")
            this.triggerNewMessageContaining(recipe)
        else if (recipe.action.trigger == "NEW_MESSAGE_FROM")
            this.triggerNewMessageFrom(recipe)
    }
}
