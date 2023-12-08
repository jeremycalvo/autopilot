import { Injectable, Param } from '@nestjs/common';
import { Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IntegrationService } from '../integration.service';
import axios from 'axios';
import { Recipe } from 'src/schemas/recipe.schema';
import { google, Auth } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { access } from 'fs/promises';
import { UtilsService } from 'src/utils/utils.service';


@Injectable()
export class GoogleService {
    oauthClient: Auth.OAuth2Client;
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
                @InjectModel('Recipe') private readonly recipeModel: Model<Recipe>,
                @Inject(forwardRef(() => IntegrationService))
                private readonly integrationService: IntegrationService,
                private readonly jwtService: JwtService,
                private readonly utils: UtilsService)
                {
                    this.oauthClient = new google.auth.OAuth2(
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_CLIENT_SECRET,
                    "https://area.linker-app.fr/redirector?service=gmail"
                    );
                }

    async auth(code: string, req: any): Promise<any>{
        try {
            const token = await this.oauthClient.getToken(code)
            const service = {
                name:"Gmail",
                accessToken: token.tokens.access_token,
                refreshToken: token.tokens.refresh_token,
                isConnected: true,
            }
            this.integrationService.setService(service, req.headers.authorization.split(' ')[1])
            return token;
        } catch (error) {
            console.log(error);
            return error
        }
    }

    async sendMessage(mailadress: string, subject: string, content: string, user: User) {
        this.oauthClient.setCredentials({
            access_token: user.services.find(service => service.name === "Gmail").accessToken,
        });

        // Get user email
        const oauth2 = google.oauth2({
            auth: this.oauthClient,
            version: 'v2',
        });
        const userInfo = await oauth2.userinfo.get();
        const email = userInfo.data.email;

        const gmail = await google.gmail({ version: 'v1', auth: this.oauthClient });
        const message = [
            'Content-Type: text/plain; charset="UTF-8"\n',
            'MIME-Version: 1.0\n',
            'Content-Transfer-Encoding: 7bit\n',
            'to: ' + mailadress + '\n',
            'from: ' + email +'\n',
            'subject: ' + subject + '\n\n',
            content + '\n',
          ].join('');

        const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

        gmail.users.messages.send({
            userId: 'me',
            requestBody: {
              raw: encodedMessage,
            },
        });
    }

    async getLastMail(user: User) {
        try {
            this.oauthClient.setCredentials({
                access_token: user.services.find(service => service.name === "Gmail").accessToken,
            });

            const gmail = await google.gmail({ version: 'v1', auth: this.oauthClient });
            const res = await gmail.users.messages.list({
                userId: 'me',
                maxResults: 1,
            });
            const lastMail = await gmail.users.messages.get({
                userId: 'me',
                id: res.data.messages[0].id,
            });
            const result = {
                id: lastMail.data.id,
                content: lastMail.data.snippet,
                address: lastMail.data.payload.headers.find(header => header.name === "From").value,
                subject: lastMail.data.payload.headers.find(header => header.name === "Subject").value,
            }
            return result
        } catch (error) {
            return null
        }
    }

    async reactionSendMail(recipe: Recipe, result: any) {
        const params = recipe.reaction.params
        const mailadress = this.utils.replaceParams(params[0], result)
        const subject = this.utils.replaceParams(params[1], result)
        const content = this.utils.replaceParams(params[2], result)
        const user = await this.userModel.findById(recipe.userId)
        this.sendMessage(mailadress, subject, content, user)
    }

    async triggerNewMail(recipe: Recipe) {
        const user = await this.userModel.findById(recipe.userId)
        const lastMail = await this.getLastMail(user)
        if (lastMail == null) return
        if (lastMail.id != recipe.action.id) {
            recipe.action.id = lastMail.id
            await this.recipeModel.updateOne({_id: recipe._id}, recipe)
            this.integrationService.executeReaction(recipe, lastMail)
        }
    }

    async triggerNewMailFrom(recipe: Recipe) {
        const user = await this.userModel.findById(recipe.userId)
        const params = recipe.action.params
        const mailadress = this.utils.replaceParams(params[0], null)
        const lastMail = await this.getLastMail(user)
        if (lastMail == null) return
        if (lastMail.id != recipe.action.id) {
            recipe.action.id = lastMail.id
            await this.recipeModel.updateOne({_id: recipe._id}, recipe)
            if (lastMail.address.includes(mailadress)) {
                this.integrationService.executeReaction(recipe, lastMail)
            }
        }
    }

    async triggerNewMailWithSubject(recipe: Recipe) {
        const user = await this.userModel.findById(recipe.userId)
        const params = recipe.action.params
        const subject = this.utils.replaceParams(params[0], null)
        const lastMail = await this.getLastMail(user)
        if (lastMail == null) return
        if (lastMail.id != recipe.action.id) {
            recipe.action.id = lastMail.id
            await this.recipeModel.updateOne({_id: recipe._id}, recipe)
            if (lastMail.subject == subject) {
                this.integrationService.executeReaction(recipe, lastMail)
            }
        }
    }

    async handleTriggers(recipe: Recipe) {
        if (recipe.action.trigger == "NEW_MAIL") {
            this.triggerNewMail(recipe)
        }
        else if (recipe.action.trigger == "NEW_MAIL_FROM") {
            this.triggerNewMailFrom(recipe)
        }
        else if (recipe.action.trigger == "NEW_MAIL_WITH_SUBJECT") {
            this.triggerNewMailWithSubject(recipe)
        }
    }

    async handleReaction(recipe: Recipe, result: any) {
        if (recipe.reaction.function == "SEND_MAIL") {
            this.reactionSendMail(recipe, result)
        }
    }
}
