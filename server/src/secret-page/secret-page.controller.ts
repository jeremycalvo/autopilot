import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('secret-page')
@ApiBearerAuth()
export class SecretPageController {
    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiOperation({summary: 'Dev use only, used to check if JWT token has been set'})
    async getSecretPage() {
        return "This is a secret page";
    }
}
