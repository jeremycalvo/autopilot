import { Controller, Query, Get, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DiscordService } from './discord.service';
import { ApiBearerAuth ,ApiBody, ApiOperation, ApiProperty, ApiQuery } from '@nestjs/swagger';

@Controller('services/discord')
export class DiscordController {
    constructor(private readonly discordService: DiscordService) {}


    // Add parameters to swagger documentation, code is required and is a string
    @Get('auth')
    @ApiOperation({summary: 'Authentificate to discord using verification code'})
    @ApiBearerAuth()
    @ApiQuery({ name: 'code', required: true, type: String, description: 'Discord verification code' })
    discordAuth(@Request() req, @Query('code') code: string) {
        return this.discordService.auth(code, req);
    }
}
