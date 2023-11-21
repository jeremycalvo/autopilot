import { Injectable } from '@nestjs/common';
import { Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { Recipe } from 'src/schemas/recipe.schema';
import { JwtService } from '@nestjs/jwt';
import { SpotifyService } from './spotify/spotify.service';
import { DiscordService } from './discord/discord.service';
import { INTEGRATIONS } from '../constants/integrations';
import * as cron from 'cron';
import { GoogleService } from './google/google.service';
import { GithubService } from './github/github.service';
import { SheetsService } from './google_sheet/sheet.service';

@Injectable()
export class IntegrationService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
                private readonly jwtService: JwtService,
                @Inject(forwardRef(() => SpotifyService))
                private readonly spotifyService: SpotifyService,
                @Inject(forwardRef(() => DiscordService))
                private readonly discordService: DiscordService,
                @Inject(forwardRef(() => GoogleService))
                private readonly gmailService : GoogleService,
                @Inject(forwardRef(() => GithubService))
                private readonly githubService : GithubService,
                @Inject(forwardRef(() => SheetsService))
                private readonly sheetsService : SheetsService,
                @InjectModel('Recipe') private readonly recipeModel: Model<Recipe>)
                {
                    this.startCronJob()
                }

    startCronJob() {
        const job = new cron.CronJob('*/3 * * * * *', async () => {
            this.processRecipes();
        });
        job.start();
    }

    async createRecipeInDB(recipe: any, req : any) {
        const token = req.headers.authorization.split(' ')[1]
        // var User = await this.userModel.findOne({username: this.jwtService.decode(token)["username"]});
        // var recipeId = await this.recipeModel.findOne({userId: User.id});

        // if (recipeId && recipe.userId == recipeId.userId) {
        //     await this.recipeModel.findOneAndReplace({userId: User.id}, {userId: recipe.userId, action: recipe.action, reaction: recipe.reaction}, {new: true});
        // }
        // else
        await this.recipeModel.create(recipe)
    }

    async setService(service: any, token: string) {
        var User = await this.userModel.findOne({username: this.jwtService.decode(token)["username"]});
        var checker = false
        for (let i = 0; i < User.services.length; i++) {
            if (!checker && User.services[i].name == service.name) {
                checker = true
                var exUser = User.services;
                exUser[i].accessToken = service.accessToken
                exUser[i].refreshToken = service.refreshToken
                exUser[i].isConnected = service.isConnected
                await this.userModel.findOneAndUpdate({username: this.jwtService.decode(token)["username"]}, { $set: { services: exUser} }, { new: true });
                break
            }
        }
        if (!checker) {
            var exUser = User.services
            exUser.push(service);
            await this.userModel.findOneAndUpdate({username: this.jwtService.decode(token)["username"]}, { $set: { services: exUser} }, { new: true });
        }
    }

    async setServiceUser(service: any, username: string) {
        var User = await this.userModel.findOne({username: username});
        var checker = false
        for (let i = 0; i < User.services.length; i++) {
            if (!checker && User.services[i].name == service.name) {
                checker = true
                var exUser = User.services;
                exUser[i].accessToken = service.accessToken
                exUser[i].refreshToken = service.refreshToken
                exUser[i].isConnected = service.isConnected
                await this.userModel.findOneAndUpdate({username: username}, { $set: { services: exUser} }, { new: true });
                break
            }
        }
        if (!checker) {
            var exUser = User.services
            exUser.push(service);
            await this.userModel.findOneAndUpdate({username: username}, { $set: { services: exUser} }, { new: true });
        }
    }

    async processRecipes() {
        // Get all recipes in DB
        var recipes = await this.recipeModel.find();
        // For each recipe
        for (let i = 0; i < recipes.length; i++) {
            // If action.service is Spotify
            if (recipes[i].action.service == "spotify") {
                this.spotifyService.handleTriggers(recipes[i]);
            }
            if (recipes[i].action.service == "discord") {
                this.discordService.handleTriggers(recipes[i]);
            }
            if (recipes[i].action.service == "gmail") {
                this.gmailService.handleTriggers(recipes[i]);
            }
            if (recipes[i].action.service == "github") {
                this.githubService.handleTriggers(recipes[i]);
            }
        }
    }

    async executeReaction(recipe: Recipe, result: any)
    {
        if (recipe.reaction.service == "spotify") {
            this.spotifyService.handleReaction(recipe, result);
        }
        else if (recipe.reaction.service == "discord") {
            this.discordService.handleReaction(recipe, result);
        }
        else if (recipe.reaction.service == "gmail") {
            this.gmailService.handleReaction(recipe, result);
        }
        else if (recipe.reaction.service == "sheets") {
            this.sheetsService.handleReaction(recipe, result);
        }
        else if (recipe.reaction.service == "github") {
            this.githubService.handleReaction(recipe, result);
        }
    }

    async getRecipes() {
        return INTEGRATIONS
    }

    async listRecipes(req: any) {
        const token = req.headers.authorization.split(' ')[1]
        var User = await this.userModel.findOne({username: this.jwtService.decode(token)["username"]});
        var recipes = await this.recipeModel.find({userId: User.id});
        return recipes
    }

    async removeRecipe(req: any, id: string) {
        const token = req.headers.authorization.split(' ')[1]
        var User = await this.userModel.findOne({username: this.jwtService.decode(token)["username"]});

        await this.recipeModel.findOneAndDelete({userId: User.id, _id: id});
    }
}
