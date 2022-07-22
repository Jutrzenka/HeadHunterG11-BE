import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  id: string;
  @Prop()
  idUser: string;
  @Prop()
  role: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  accessToken: string;
  @Prop()
  registerCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
