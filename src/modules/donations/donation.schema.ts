import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';
import { Hospital } from '../hospitals/hospitals.schema';

export type DonationDocument = Donation & Document;

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
export class Donation {
  @Prop({ ref: User.name })
  user: string;

  @Prop()
  quantity: number;

  @Prop({ ref: Hospital.name })
  hospital: string;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);
