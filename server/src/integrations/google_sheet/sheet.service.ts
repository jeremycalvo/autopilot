import { Injectable, Param } from '@nestjs/common';
import { Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IntegrationService } from '../integration.service';
import axios from 'axios';
import { Recipe } from 'src/schemas/recipe.schema';
import { google, Auth, sheets_v4 } from 'googleapis';
import { access } from 'fs/promises';
import { UtilsService } from 'src/utils/utils.service';


@Injectable()
export class SheetsService {
    oauthClient: Auth.OAuth2Client;
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
                @Inject(forwardRef(() => IntegrationService))
                private readonly integrationService: IntegrationService,
                private readonly jwtService: JwtService,
                private readonly utils: UtilsService
                )
                {
                    this.oauthClient = new google.auth.OAuth2(
                        process.env.GOOGLE_CLIENT_ID,
                        process.env.GOOGLE_CLIENT_SECRET,
                        "https://area.linker-app.fr/redirector?service=sheets"
                    );
                }

    async auth(code: string, req: any): Promise<any>{
        try {
            const token = await this.oauthClient.getToken(code) 
            const service = {
                name:"Sheets",
                accessToken: token.tokens.access_token,
                refreshToken: token.tokens.refresh_token,
                isConnected: true,
            }
            this.oauthClient.setCredentials({
                access_token: token.tokens.access_token,
                refresh_token: token.tokens.refresh_token
            })
            this.integrationService.setService(service, req.headers.authorization.split(' ')[1])
            return token;
        } catch (error) {
            return error
        }
    }

    async writeOnLastCell(sheetId: string, range: string, value: any[][]) {2

        try {
            const sheets = google.sheets({ version: 'v4', auth: this.oauthClient });

            const res = await sheets.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range
            });
            const target = res.data.values ? res.data.values.length + 1 : 1

            this.updateSheet(sheetId, range[0] + target, value)
        } catch (error) {
            return error
        }
    }

    async updateSheet(sheetId: string, range: string, values: any[][]) {
        const request = {
          spreadsheetId: sheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values,
          },
        };

        try {
            const sheets = google.sheets({ version: 'v4', auth: this.oauthClient });

            const response = await sheets.spreadsheets.values.update(request);

            return response.data;
        } catch (error) {
            return error
        }
    }

    async reactionWriteToLastRow(recipe: Recipe, result: any) {
        const params = recipe.reaction.params
        const sheetId = this.utils.replaceParams(params[0], result)
        const range = this.utils.replaceParams(params[1], result)
        const value = this.utils.replaceParams(params[2], result)
        let valueArray = []
        valueArray.push(value.split(','))
        this.writeOnLastCell(sheetId, range, valueArray)
    }

    async reactionWriteToCell(recipe: Recipe, result: any) {
        const params = recipe.reaction.params
        const sheetId = this.utils.replaceParams(params[0], result)
        const range = this.utils.replaceParams(params[1], result)
        const value = this.utils.replaceParams(params[2], result)
        let valueArray = []
        valueArray.push(value.split(','))
        this.updateSheet(sheetId, range, valueArray)
    }

    async handleReaction(recipe: Recipe, result: any) {
        if (recipe.reaction.function == "WRITE_TO_LAST_ROW") {
            this.reactionWriteToLastRow(recipe, result)
        }
        else if (recipe.reaction.function == "WRITE_TO_CELL") {
            this.reactionWriteToCell(recipe, result)
        }
    }
}
