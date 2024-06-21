import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop()
    first_name: string;

    @Prop()
    middle_name?: string;

    @Prop()
    last_name: string;

    @Prop()
    username?: string;

    @Prop()
    email: string;

    @Prop()
    password: string;


    @Prop({ default: false })
    isDonor: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
