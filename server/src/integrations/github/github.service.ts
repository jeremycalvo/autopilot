import { Injectable, Param } from '@nestjs/common';
import { Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IntegrationService } from '../integration.service';
import axios from 'axios';
import { Recipe } from 'src/schemas/recipe.schema';
import { response } from 'express';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class GithubService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
                @InjectModel('Recipe') private readonly recipeModel: Model<Recipe>,
                @Inject(forwardRef(() => IntegrationService))
                private readonly integrationService: IntegrationService,
                private readonly utils: UtilsService,
                private readonly jwtService: JwtService) {}

    async auth(code: any, req: any): Promise<any>{
        const data = {
            'client_id':  process.env.GITHUB_CLIENT_ID,
            'client_secret': process.env.GITHUB_CLIENT_SECRET,
            //'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': "http://128.199.149.52:8080/redirector?service=github"
        }
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        try {
            const res = await axios.post('https://github.com/login/oauth/access_token', data, {headers});
            const service = {
                name:"Github",
                accessToken: res.data.split('=')[1].split('&')[0],
                refreshToken: res.data.refresh_token,
                isConnected: true,
            }
            if (service.accessToken == "bad_verification_code")
                return "Error"
            this.integrationService.setService(service, req.headers.authorization.split(' ')[1])
            return res.data;
        } catch (error) {
            return error
        }
    }

    async handleTriggers(recipe: Recipe) {
        if (recipe.action.trigger == "NEW_COMMIT")
            this.triggerCommitList(recipe)
    }

    async triggerCommitList(recipe: Recipe) {
        try {
            const user = await this.userModel.findById(recipe.userId)
            const commit = await this.getNewCommit(recipe.action.params[0], recipe.action.params[1], user)

            if (recipe.action.id != commit.sha) {
                recipe.action.id = commit.sha
                await this.recipeModel.updateOne({_id: recipe._id}, {$set: {action: recipe.action}})
                this.integrationService.executeReaction(recipe, {sha : commit.sha, author: commit.commit.committer.name, commit_message : commit.commit.message, url : commit.url})
            }
        } catch (error) {
            return error
        }
    }

    async getNewCommit(owner : string, repo: string, user: User) {
        let accessToken : any
        if (user.services.find(service => service.name === "Github" && service.isConnected)) {
            accessToken = user.services.find(service => service.name === "Github" && service.isConnected).accessToken;
        }
        const headers = {
            Authorization: 'Bearer ' + accessToken
        };
        try {
            const response = await axios.get("https://api.github.com/repos/" + owner + "/" + repo + "/commits", {headers})
            return (response.data[0])
        } catch (error) {
            return (error)
        }
    }

    async createIssue(organization: string, repo: string, title: string, body: string, labels: string[], assignees: string[], user: User) {
        let accessToken : any
        if (user.services.find(service => service.name === "Github" && service.isConnected)) {
            accessToken = user.services.find(service => service.name === "Github" && service.isConnected).accessToken;
        }
        const headers = {
            Authorization: 'Bearer ' + accessToken
        };
        const data = {
          title,
          body,
          labels,
          assignees
        };
       try {
           const response  = await axios.post(`https://api.github.com/repos/${organization}/${repo}/issues`, data, {headers});
           return response
        }
        catch (error) {
            return (error)
        }
    }

    async reactionCreateIssue(recipe: Recipe, result: any) {
        const params = recipe.reaction.params
        const organization = this.utils.replaceParams(params[0], result)
        const repo = this.utils.replaceParams(params[1], result)
        const title = this.utils.replaceParams(params[2], result)
        const body = this.utils.replaceParams(params[3], result)
        const labels = this.utils.replaceParams(params[4], result).split(',')
        const assignees = this.utils.replaceParams(params[5], result).split(',')

        const user = await this.userModel.findById(recipe.userId)

        this.createIssue(organization, repo, title, body, labels, assignees, user)
    }

    async handleReaction(recipe: Recipe, result: any) {
        if (recipe.reaction.function == "CREATE_ISSUE") {
            this.reactionCreateIssue(recipe, result)
        }
    }
}
