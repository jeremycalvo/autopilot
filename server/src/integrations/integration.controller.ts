import { Controller, Query, Get, UseGuards, Request, Put, Body, Delete} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IntegrationService } from './integration.service';
import { RecipeDto } from 'src/dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('recipe')
export class IntegrationController {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
                private readonly integrationService: IntegrationService,
                private readonly jwtService: JwtService) {}

    @Put('add')
    @ApiBody({type: RecipeDto, description: 'Recipe to add'})
    @ApiOperation({summary: 'Add a new recipe composed of a trigger, and a reaction'})
    async createRecipe(@Request() req, @Body() body: RecipeDto) {
        // Find user in DB
        const token = req.headers.authorization.split(' ')[1]
        const userId = await this.userModel.findOne({username: this.jwtService.decode(token)["username"]});

        var recipe = {
            userId: userId._id,
            name : body.name,
            action: body.action,
            reaction: body.reaction,
        }
        return this.integrationService.createRecipeInDB(recipe, req);
    }

    @Get('list')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'List all user\'s recipes'})
    async listRecipes(@Request() req) {
        return this.integrationService.listRecipes(req);
    }

    @Delete('remove')
    @ApiOperation({summary: 'Remove a recipe from the database'})
    async removeRecipe(@Request() req, @Query('id') id: string) {
        return this.integrationService.removeRecipe(req, id);
    }

    @Get()
    @ApiOperation({summary: 'Get all services, triggers and reactions'})
    async getRecipes() {
        return this.integrationService.getRecipes();
    }
}
