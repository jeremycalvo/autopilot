import { Controller, Query, Get, UseGuards, Request} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SheetsService } from './sheet.service';
import { UtilsService } from 'src/utils/utils.service';
import {ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('services/sheets/')
export class SheetsController {
    constructor(private readonly sheetsService: SheetsService,
        private readonly utilsService: UtilsService) {}

    @Get('auth')
    @ApiOperation({summary: 'Authentificate to Google Sheets using verification code'})
    @ApiBearerAuth()
    googleAuth(@Request() req, @Query('code') code: string) {
        return this.sheetsService.auth(code, req);
    }

}