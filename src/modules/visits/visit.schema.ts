import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Donor } from '../donors/donor.schema';
import { Hospital } from '../hospitals/hospitals.schema';

export type VisitDocument = Visit & Document;

@Schema()
export class Visit {
    @Prop({ type: Types.ObjectId, ref: Donor.name })
    donor: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Hospital.name })
    bloodBank: Types.ObjectId;

    @Prop()
    visitDate: Date;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
