    import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
    @Prop({required: true})
    userId: string;
    _id: string;

    @Prop({required: true})
    name: string;
    @Prop({required: true, type: Object})
    action: {
        service: string;
        trigger: string;
        params: Array<string>;
        id: string;
    };

    @Prop({required: true, type: Object})
    reaction: {
        service: string;
        function: string;
        // params is an array of objects
        params: Array<string>
    };
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);