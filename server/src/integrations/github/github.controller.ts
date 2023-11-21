import { Controller, Query, Get, UseGuards, Request} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { GithubService } from './github.service';

@Controller('services/github')
export class GithubController {
    constructor(private readonly githubService: GithubService) {}

    @Get('auth')
    @ApiOperation({summary: 'Authentificate to GitHub using verification code'})
    githubAuth(@Request() req, @Query('code') code: string) {
        return this.githubService.auth(code, req);
    }
}