import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DonorDocument = Donor & Document;

@Schema()
export class Donor {
    @Prop()
    name: string;

    @Prop()
    bloodType: string;

    @Prop()
    lastDonationDate: Date;
}

export const DonorSchema = SchemaFactory.createForClass(Donor);
