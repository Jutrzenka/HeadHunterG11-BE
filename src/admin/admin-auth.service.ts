import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schema/admin.schema';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { generateErrorResponse } from '../Utils/function/generateJsonResponse/generateJsonResponse';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
  ) {}

  async login(): Promise<JsonCommunicationType> {
    return generateErrorResponse('B000');
  }

  async logout(): Promise<JsonCommunicationType> {
    return generateErrorResponse('B000');
  }
}
