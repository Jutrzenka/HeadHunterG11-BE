import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/schema/user.schema';
import { v4 as uuid } from 'uuid';
import { UserRole } from '../Utils/types/user/AuthUser.type';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { searchUsersInMongo } from '../Utils/function/searchUsersInMongo';

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
      email: email.toLowerCase().trim(),
      login: email.toLowerCase().split('@')[0].concat('-', uuid()),
      activeAccount: false,
      registerCode: uuid(),
    });
    return newUser.save();
  }

  async getAllStudents({
    limit,
    page,
    filter,
  }: {
    limit: number;
    page: number;
    filter: string;
  }): Promise<JsonCommunicationType> {
    try {
      return await searchUsersInMongo(
        { role: UserRole.Student, limit, page, filter },
        this.userModel,
      );
    } catch (err) {
      return {
        success: false,
        typeData: 'status',
        data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
      };
    }
  }

  async getAllHeadhunters({
    limit,
    page,
    filter,
  }: {
    limit: number;
    page: number;
    filter: string;
  }): Promise<JsonCommunicationType> {
    try {
      return await searchUsersInMongo(
        { role: UserRole.HeadHunter, limit, page, filter },
        this.userModel,
      );
    } catch (err) {
      return {
        success: false,
        typeData: 'status',
        data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
      };
    }
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
