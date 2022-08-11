import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema()
export class Admin extends Document {
  @Prop({ required: true, unique: true })
  idAdmin: string;
  @Prop({ required: true, unique: true })
  login: string;
  @Prop({ required: false, default: null })
  password: string | null;
  @Prop({ required: false, default: null })
  accessToken: string | null;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
