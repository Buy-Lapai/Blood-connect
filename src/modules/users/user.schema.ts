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
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  middleName?: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  })
  bloodGroup: string;

  @Prop()
  nin: string;

  @Prop()
  id: string;

  @Prop({ enum: ['Male', 'Female'] })
  gender: string;

  @Prop()
  totalQuantityDonated: number;

  @Prop()
  address: string;

  @Prop()
  phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
