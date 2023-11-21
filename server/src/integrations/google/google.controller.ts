import { Controller, Query, Get, UseGuards, Request} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';
import { UtilsService } from 'src/utils/utils.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation } from '@nestjs/swagger';


@Controller('services/gmail')
export class GoogleController {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
        private readonly googleService: GoogleService,
        private readonly utilsService: UtilsService) {}

    @Get('auth')
    @ApiOperation({summary: 'Authentificate to Gmail using verification code'})
    googleAuth(@Request() req, @Query('code') code: string) {
        return this.googleService.auth(code, req);
    }
}