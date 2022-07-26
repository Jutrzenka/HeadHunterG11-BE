import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  idUser: string;
  @Prop({ required: true })
  role: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  accessToken: string;
  @Prop({ required: true })
  registerCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
