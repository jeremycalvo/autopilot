import { IsString, IsEmail, MinLength, IsNotEmpty , IsDefined, IsAlphanumeric} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @IsAlphanumeric()
    @ApiProperty()
    username: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @ApiProperty()
    password: string;
}

export class LoginDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @IsAlphanumeric()
    @ApiProperty()
    username: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @ApiProperty()
    password: string;
}

export class ServiceDto {
    @IsDefined()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsDefined()
    @IsNotEmpty()
    @ApiProperty()
    accessToken: string;

    @IsDefined()
    @IsNotEmpty()
    @ApiProperty()
    refreshToken : string;

    @IsDefined()
    @IsNotEmpty()
    @ApiProperty()
    isConnected: boolean;

    @IsDefined()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}

export class RecipeDto {
    @IsDefined()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsDefined()
    @IsNotEmpty()
    @ApiProperty()
    action: {
        service: string;
        trigger: string;
        params: [string];
    };

    @IsDefined()
    @IsNotEmpty()
    @ApiProperty()
    reaction: {
        service: string;
        function: string;
        params: [string];
    };
}