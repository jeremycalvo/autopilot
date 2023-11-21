import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({required: true})
  username: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true})
  email: string;

  @Prop({require: true})
  services: [{
    name: string,
    accessToken: string,
    refreshToken : string,
    isConnected: boolean,
  }]
}

export const UserSchema = SchemaFactory.createForClass(User);