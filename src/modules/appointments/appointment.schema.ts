import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Hospital } from '../hospitals/hospitals.schema';

export type AppointmentDocument = Appointment & Document;

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
export class Appointment {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  status:
    | 'Awaiting Confirmation'
    | 'Confirmed'
    | 'Donated'
    | 'Cancelled';

  @Prop()
  date: Date;

  @Prop({ ref: Hospital.name })
  hospital: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
