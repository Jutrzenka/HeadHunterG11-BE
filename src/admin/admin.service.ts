import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/schema/user.schema';
import { v4 as uuid } from 'uuid';
import { UserRole } from '../Utils/types/user/AuthUser.type';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createUser({
    email,
    role,
  }: {
    email: string;
    role: UserRole;
  }): Promise<User> {
    const newUser = await this.userModel.create({
      idUser: uuid(),
      role,
      email,
      login: email.toUpperCase().split('@')[0].concat('-', uuid()),
      registerCode: uuid(),
    });
    return newUser.save();
  }

  async getAllStudents(): Promise<JsonCommunicationType> {
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  async getAllHeadhunters(): Promise<JsonCommunicationType> {
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  async deleteUser(): Promise<JsonCommunicationType> {
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  async editEmail(): Promise<JsonCommunicationType> {
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  async newRegisterCode(): Promise<JsonCommunicationType> {
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }
}
