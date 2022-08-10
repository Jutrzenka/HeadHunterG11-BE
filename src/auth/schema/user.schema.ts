import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  idUser: string;
  @Prop({ required: true })
  role: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, unique: true })
  login: string;
  @Prop({ required: false, default: null })
  password: string | null;
  @Prop({ required: false, default: null })
  accessToken: string | null;
  @Prop({ required: true })
  activeAccount: boolean;
  @Prop({ required: false })
  registerCode: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
