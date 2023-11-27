import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
//import { UsersModule } from './users/users.module';

import { User, UserSchema } from './schemas/user.schema';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { IntegrationController } from './integrations/integration.controller';
import { IntegrationService } from './integrations/integration.service';
import { SecretPageController } from './secret-page/secret-page.controller';
import { DiscordController } from './integrations/discord/discord.controller';
import { DiscordService } from './integrations/discord/discord.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleController } from './integrations/google/google.controller';
import { GoogleService } from './integrations/google/google.service';
import { JwtStrategy } from './passport/jwt.strategy'
import { ConfigModule } from '@nestjs/config';
import { SpotifyService } from './integrations/spotify/spotify.service';
import { SpotifyController } from './integrations/spotify/spotify.controller';
import { UtilsService } from './utils/utils.service';
import { GithubController } from './integrations/github/github.controller';
import { GithubService } from './integrations/github/github.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ImagesController } from './image/images.controller';
import { ServicesController } from './services/services.controller';
import { ServicesService } from './services/services.service';
import { SheetsController } from './integrations/google_sheet/sheet.controller';
import { SheetsService } from './integrations/google_sheet/sheet.service';
import { GoogleApis, sheets_v4 } from 'googleapis';
import { AboutController } from './about/about.controller';
import { RedirectController } from './redirect/redirect.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://area-db:27017/AREA', { useNewUrlParser: true }), //UsersModule,
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}, {name: Recipe.name, schema: RecipeSchema}]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '60m' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
    }),
],
  controllers: [AppController, AuthController, SecretPageController, DiscordController, SpotifyController, IntegrationController, ImagesController, ServicesController, GithubController, GoogleController, SheetsController, AboutController, RedirectController],
  providers: [AppService, AuthService, JwtStrategy, DiscordService, SpotifyService, IntegrationService, UtilsService, ServicesService, GithubService, GoogleService, SheetsService],
})

export class AppModule {}
