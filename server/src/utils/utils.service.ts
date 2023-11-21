import { Injectable } from '@nestjs/common';
import { Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { IntegrationService } from '../integrations/integration.service';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UtilsService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
                @Inject(forwardRef(() => IntegrationService))
                private readonly integrationService: IntegrationService,
                private readonly jwtService: JwtService) {}

    replaceParams(str: string, params: any): string {
        // For each key in params, replace "$KEY" in str with the value
        for (const key in params) {
            str = str.replace(`$${key}`, params[key]);
        }
        return str;
    }

    getUser(req : any) {
        const token = req.headers.authorization.split(' ')[1]
        return this.userModel.findOne({username: this.jwtService.decode(token)["username"]});
    }

    includesString(mainString: string, subString: string): boolean {
        return mainString.indexOf(subString) !== -1;
    }
}
