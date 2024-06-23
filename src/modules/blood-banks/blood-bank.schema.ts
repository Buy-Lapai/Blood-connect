import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BloodBankDocument = BloodBank & Document;

@Schema()
export class BloodBank {
    @Prop()
    name: string;

    @Prop()
    location: string;

    @Prop()
    contactNumber: string;
}

export const BloodBankSchema = SchemaFactory.createForClass(BloodBank);
