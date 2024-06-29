import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
export class Hospital extends Document {
  @Prop({ unique: true })
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  state: string;

  @Prop()
  lga: string;

  @Prop()
  street: string;

  @Prop()
  address: string;

  @Prop()
  accessToken: string;
}

export const HospitalSchema = SchemaFactory.createForClass(Hospital);

export type HospitalDocument = Hospital & Document;
