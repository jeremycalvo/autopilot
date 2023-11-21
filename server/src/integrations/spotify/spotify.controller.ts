import { Controller, Query, Get, UseGuards, Request} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SpotifyService } from './spotify.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('services/spotify')
export class SpotifyController {
    constructor(private readonly spotifyService: SpotifyService) {}

    @Get('auth')
    @ApiOperation({summary: 'Authentificate to discord using verification code'})
    spotifyAuth(@Request() req, @Query('code') code: string) {
        return this.spotifyService.auth(code, req);
    }
}
