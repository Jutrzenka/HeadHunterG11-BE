import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
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
import { MailService } from '../mail/mail.service';
import { createTransport } from 'nodemailer';
import configuration from '../Utils/config/configuration';
import { registerEmailTemplate } from '../mail/templates/register-email.template';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @Inject(MailService)
    private mailService: MailService,
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
    await this.mailService.sendMail(
      email.toLowerCase().trim(),
      'Link aktywacyjny do platformy HeadHunter MegaK',
      registerEmailTemplate(newUser.login, newUser.registerCode),
    );
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
