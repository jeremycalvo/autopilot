import { Controller, Req, Post, Get , Body, ValidationPipe, HttpStatus, HttpException, Query} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IntegrationService } from '../integrations/integration.service';
import { User } from 'src/schemas/user.schema';
import { validate } from 'class-validator';
import { RegisterDto, LoginDto, ServiceDto } from 'src/dto/register.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly integrationService : IntegrationService) {}

    @Post('register')
    @ApiOperation({summary: 'Register a new user'})
    async register(@Body(new ValidationPipe({ transform: true})) body: RegisterDto) {
        const errors = await validate(body);
        if (errors.length > 0) {
            console.log("errors: ", errors);
            return errors;
        }

        if (await this.authService.findUser(body['username']) != null)
            throw new HttpException("username already exists", HttpStatus.BAD_REQUEST)
        if (await this.authService.findEmail(body['email']) != null)
            throw new HttpException("email already exists", HttpStatus.BAD_REQUEST)
        let services: [{}] = [{name: "", accessToken: "", refreshToken: "", isConnected: false}]
        return this.authService.register(body.email, body.username, body.password, services);
    }

    @Post('login')
    @ApiOperation({summary: 'Login a user'})
    async login(@Body() body: LoginDto) {
        if (!body.username)
            throw new HttpException("username is required", HttpStatus.BAD_REQUEST)
        if (!body.password)
            throw new HttpException("password is required", HttpStatus.BAD_REQUEST)
        const user = await this.authService.login(body.username, body.password);
        if (user == null)
            throw new HttpException("username or password is incorrect", HttpStatus.BAD_REQUEST)
        return user;
    }

    @Post('discord-login')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'gFDa2z'},
          },
          required: ['code'],
        },
      })
    @ApiOperation({summary: 'Login a user using discord OAuth'})
    async discordLogin(@Req() req, @Body() body: any) {
        if (!body.code)
            throw new HttpException("code is required", HttpStatus.BAD_REQUEST)
        return this.authService.discordLogin(req, body.code);
    }
}