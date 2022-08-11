import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/schema/user.schema';
import { v4 as uuid } from 'uuid';
import { UserRole } from '../Utils/types/user/AuthUser.type';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { searchUsersInMongo } from '../Utils/function/searchUsersInMongo';
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '../Utils/function/generateJsonResponse/generateJsonResponse';

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
    // @TODO wysyłanie e-maila rejestracyjnego
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
      return generateErrorResponse('A000');
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
      return generateErrorResponse('A000');
    }
  }

  async deleteUser(idUser: string): Promise<JsonCommunicationType> {
    try {
      const status = await this.userModel.deleteOne({ idUser }).exec();
      if (status.deletedCount !== 1) {
        return generateErrorResponse('D000');
      } else {
        return generateSuccessResponse();
      }
    } catch (err) {
      return generateErrorResponse('A000');
    }
  }

  async editEmail(
    idUser: string,
    newEmail: string,
  ): Promise<JsonCommunicationType> {
    try {
      const user = await this.userModel
        .findOneAndUpdate(
          { idUser },
          {
            email: newEmail,
            registerCode: uuid(),
            password: null,
            activeAccount: false,
          },
          { new: true },
        )
        .exec();
      if (user === null) {
        return generateErrorResponse('D000');
      } else {
        // TODO Wysyłać nowy e-mail rejestracyjny
        return generateSuccessResponse();
      }
    } catch (err) {
      if (err.code === 11000) {
        return generateErrorResponse('C001');
      }
      return generateErrorResponse('A000');
    }
  }

  async newPassword(idUser: string): Promise<JsonCommunicationType> {
    try {
      const user = await this.userModel
        .findOneAndUpdate(
          { idUser },
          {
            registerCode: uuid(),
            password: null,
            activeAccount: false,
          },
          { new: true },
        )
        .exec();
      if (user === null) {
        return generateErrorResponse('D000');
      } else {
        // TODO Wysyłać nowy e-mail rejestracyjny
        return generateSuccessResponse();
      }
    } catch (err) {
      if (err.code === 11000) {
        return generateErrorResponse('C001');
      }
      return generateErrorResponse('A000');
    }
  }
}
