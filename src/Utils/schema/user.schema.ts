import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  idUser: string;
  @Prop({ required: false })
  role: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, unique: true })
  login: string;
  @Prop({ required: false })
  password: string;
  @Prop({ required: false })
  accessToken: string;
  @Prop({ required: false })
  registerCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
