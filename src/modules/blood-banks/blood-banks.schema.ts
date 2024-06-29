import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Hospital } from '../hospitals/hospitals.schema';

export type BloodBankDocument = BloodBank & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class BloodBank {
  @Prop({
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  })
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

  @Prop()
  totalDonated: number;

  @Prop()
  totalAvailable: number;

  @Prop({ ref: Hospital.name })
  hospital: string;
}

export const BloodBankSchema = SchemaFactory.createForClass(BloodBank);
