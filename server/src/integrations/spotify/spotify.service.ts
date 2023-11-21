import { Injectable, Param } from '@nestjs/common';
import { Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IntegrationService } from '../integration.service';
import axios from 'axios';
import { Recipe } from 'src/schemas/recipe.schema';

@Injectable()
export class SpotifyService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
                @InjectModel('Recipe') private readonly recipeModel: Model<Recipe>,
                @Inject(forwardRef(() => IntegrationService))
                private readonly integrationService: IntegrationService,
                private readonly jwtService: JwtService) {}

    async auth(code: string, req: any): Promise<any>{
        const data = {
            'client_id':  process.env.SPOTIFY_CLIENT_ID,
            'client_secret': process.env.SPOTIFY_CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': "http://localhost:8081/services"
        }
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        try {
            const res = await axios.post('https://accounts.spotify.com/api/token', data, {headers});
            const service = {
                name:"Spotify",
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

    async getNewAccessToken(refresh_token : string, req : any) {
        const data = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id':  process.env.SPOTIFY_CLIENT_ID,
            'client_secret': process.env.SPOTIFY_CLIENT_SECRET
        }
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        const res = await axios.post('https://accounts.spotify.com/api/token', data, {headers})
        const service = {
            name:"Spotify",
            accessToken: res.data.access_token,
            refreshToken: refresh_token,
            isConnected: true,
        }
        this.integrationService.setService(service, req.headers.authorization.split(' ')[1])
        return (res.data)
    }

    async getCurrentlyPlayingTrack(user: User) {
        let accessToken: any
        if (user.services.find(service => service.name === "Spotify" && service.isConnected)) {
            accessToken = user.services.find(service => service.name === "Spotify" && service.isConnected).accessToken;
        } else {
            return "Not connected to Spotify"
        }
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
            'Market': 'FR'
        }
        try {
            const res = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {headers})
            const object = {
                'music': res.data.item.name,
                'artist': res.data.item.artists[0].name,
                'id': res.data.item.id
            }
            return (object)
        } catch (error) {
            return "No music playing"
        }
    }

    async getDeviceId(user: User) {
        let accessToken: any
        if (user.services.find(service => service.name === "Spotify" && service.isConnected)) {
            accessToken = user.services.find(service => service.name === "Spotify" && service.isConnected).accessToken;
        } else {
            return "Not connected to Spotify"
        }
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        }
        const res = await axios.get("https://api.spotify.com/v1/me/player/devices", {headers})
        return (res.data.devices[0].id)
    }

    async handleTriggers(recipe: Recipe) {
        if (recipe.action.trigger == "MUSIC_CHANGE") {
            this.triggerMusicChange(recipe)
        }
        else if (recipe.action.trigger == "NEW_MUSIC_PLAYLIST") {
            this.reactionNewMusicPlaylist(recipe)
        }
    }

    async triggerMusicChange(recipe: Recipe) {
        // Find user in database with recipe.userId
        const user = await this.userModel.findById(recipe.userId)
        const musicData = await this.getCurrentlyPlayingTrack(user)
        if (musicData == "Not connected to Spotify" || musicData == "No music playing")
            return

        if (musicData.id != recipe.action.id) {
            recipe.action.id = musicData.id
            await this.recipeModel.updateOne({_id: recipe._id}, {$set: {action: recipe.action}})
            // Execute actions
            this.integrationService.executeReaction(recipe, musicData)
        }
    }

    async reactionSkipMusic(recipe: Recipe, data: any) {
        const user = await this.userModel.findById(recipe.userId)
        const deviceId = await this.getDeviceId(user)

        if (deviceId == "Not connected to Spotify")
            return

        const accessToken = user.services.find(service => service.name === "Spotify" && service.isConnected).accessToken;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        }
        try {
            const res = await axios.post("https://api.spotify.com/v1/me/player/next?device_id=" + deviceId, {}, {headers})
        } catch (error) {
            return
        }
    }

    async triggerNewMusicPlaylist(recipe: Recipe) {
        try {
            const user = await this.userModel.findById(recipe.userId)
            const music = await this.getLastMusicInPlaylist(user, recipe.action.params[0])
            if (recipe.action.id != music.track.id) {
                recipe.action.id = music.track.id
                await this.recipeModel.updateOne({_id: recipe._id}, {$set: {action: recipe.action}})
                this.integrationService.executeReaction(recipe, {music: music.track.name, artists: music.track.artists[0], id: music.track.id})
            }
        } catch (error) {
            return error
        }
    }

    async getLastMusicInPlaylist(user: User, playlist_id: string) {
        const accessToken = user.services.find(service => service.name === "Spotify" && service.isConnected).accessToken;
        const headers = {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
        }
        try {
            const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {headers})
            return response.data.items[response.data.items.length - 1]
        } catch (error) {
            return (error)
        }
    }

    async reactionNewMusicPlaylist(recipe: Recipe) {
        const user = await this.userModel.findById(recipe.userId)
        const music = await this.getLastMusicInPlaylist(user, recipe.action.params[0])
        if (music.track.id != recipe.action.id) {
            recipe.action.id = music.track.id
            await this.recipeModel.updateOne({_id: recipe._id}, {$set: {action: recipe.action}})
            this.integrationService.executeReaction(recipe, {music: music.track.name, artist: music.track.artists[0], id: music.track.id})
        }
    }

    async handleReaction(recipe: Recipe, data: any) {
        if (recipe.reaction.function == "SKIP_MUSIC") {
            this.reactionSkipMusic(recipe, data)
        }
    }
}
