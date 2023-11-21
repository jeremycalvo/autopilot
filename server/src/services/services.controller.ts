import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('services')
export class ServicesController {
    constructor(private readonly service: ServicesService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Get all user\'s connected services'})
    getConnectedServices(@Request() req) {
        return this.service.getConnectedServices(req);
    }
}
