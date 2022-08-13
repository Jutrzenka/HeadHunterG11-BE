import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/schema/user.schema';
import { v4 as uuid } from 'uuid';
import { UserRole } from '../Utils/types/user/AuthUser.type';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { searchUsersInMongo } from '../Utils/function/searchUsersInMongo';
import {
  generateElementResponse,
  generateErrorResponse,
  generateSuccessResponse,
} from '../Utils/function/generateJsonResponse/generateJsonResponse';
import { MailService } from '../mail/mail.service';
import {
  editEmailTemplate,
  newPasswordEmailTemplate,
  registerEmailTemplate,
} from 'src/mail/templates/export';
import { unlink, readFile } from 'fs/promises';
import { ReceivedFiles } from '../Utils/types/data/MulterDiskUploadedFiles';
import { validateEmail } from '../Utils/function/validateEmail';

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

  async createUserJson(files: ReceivedFiles) {
    try {
      const errorsDatabase = [];
      const errorsMailer = [];
      const allUsers = [];
      const filePath = files['user-json'][0].path;
      const data = JSON.parse(await readFile(filePath, 'utf8'));
      for (const user of data) {
        try {
          if (
            !user.role ||
            (user.role !== UserRole.Student &&
              user.role !== UserRole.HeadHunter) ||
            !validateEmail(user.email)
          ) {
            throw {
              code: 'C001',
              message: `Błedna rola, lub login: ${user.email} - Rola: ${user.role}`,
            };
          }
          const newUser = await this.userModel
            .findOneAndUpdate(
              {
                role: user.role,
                email: user.email.toLowerCase().trim(),
              },
              {
                idUser: uuid(),
                role: user.role,
                email: user.email.toLowerCase().trim(),
                login: user.email
                  .toLowerCase()
                  .split('@')[0]
                  .concat('-', uuid()),
                activeAccount: false,
                registerCode: uuid(),
              },
              {
                lean: true,
                upsert: true,
                new: true,
              },
            )
            .exec();
          allUsers.push(newUser);
        } catch (err) {
          errorsDatabase.push({
            user: err.keyValue,
            code: err.code,
            message: err.message,
          });
        }
      }
      for (const mailerUser of allUsers) {
        try {
          await this.mailService.sendMail(
            mailerUser.email.toLowerCase().trim(),
            'Link aktywacyjny do platformy HeadHunter MegaK',
            registerEmailTemplate(mailerUser.login, mailerUser.registerCode),
          );
        } catch (err) {
          errorsMailer.push({
            user: err,
            code: err.code,
            message: err.message,
          });
        }
      }
      try {
        if (files['user-json']) await unlink(files['user-json'][0].path);
      } catch (err) {
        return generateErrorResponse('E003');
      }
      return generateElementResponse('object', {
        numberOfSuccesses: allUsers.length,
        numberOfErrors: errorsDatabase.length + errorsMailer.length,
        errorsDatabase,
        errorsMailer,
      });
    } catch (err) {
      try {
        await unlink(files['user-json'][0].path);
      } catch (err2) {
        return generateErrorResponse('E002');
      }
      return generateErrorResponse('E001');
    }
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
        await this.mailService.sendMail(
          user.email.toLowerCase().trim(),
          'Ponowny link do platformy HeadHunter MegaK',
          editEmailTemplate(user.login, user.registerCode),
        );
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
        await this.mailService.sendMail(
          user.email.toLowerCase().trim(),
          'Resetowanie konta na platformie HeadHunter MegaK',
          newPasswordEmailTemplate(user.login, user.registerCode),
        );
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
