import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
import { Student } from '../userData/entities/student.entity';
import { Hr } from '../userData/entities/hr.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateHrDto } from './dto/create-hr.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
  ) {}

  async createUser({
    email,
    role,
  }: {
    email: string;
    role: UserRole;
  }): Promise<[User, Student | Hr]> {
    const newUser = await this.userModel.create({
      idUser: uuid(),
      role,
      email: email.toLowerCase().trim(),
      login: email.toLowerCase().split('@')[0].concat('-', uuid()),
      activeAccount: false,
      registerCode: uuid(),
    });
    await newUser.save();

    let user;
    if (newUser.role === UserRole.Student) {
      const student = new Student();
      student.id = newUser.idUser;
      await student.save();
      user = student;
    }

    if (newUser.role === UserRole.HeadHunter) {
      const hr = new Hr();
      hr.id = newUser.idUser;
      await hr.save();
      user = hr;
    }
    await this.mailService.sendMail(
      email.toLowerCase().trim(),
      'Link aktywacyjny do platformy HeadHunter MegaK',
      registerEmailTemplate(newUser.login, newUser.registerCode),
    );
    return [newUser, user];
  }

  async createHr(body: CreateHrDto): Promise<[User, Hr]> {
    const newHrMongo = await this.userModel.create({
      idUser: uuid(),
      role: UserRole.HeadHunter,
      email: body.email.toLowerCase().trim(),
      login: body.email.toLowerCase().split('@')[0].concat('-', uuid()),
      activeAccount: false,
      registerCode: uuid(),
    });
    await newHrMongo.save();

    const hrSql = new Hr();
    hrSql.id = newHrMongo.idUser;
    hrSql.fullName = body.fullName;
    hrSql.company = body.company;
    await hrSql.save();

    await this.mailService.sendMail(
      newHrMongo.email.toLowerCase().trim(),
      'Link aktywacyjny do platformy HeadHunter MegaK',
      registerEmailTemplate(newHrMongo.login, newHrMongo.registerCode),
    );
    return [newHrMongo, hrSql];
  }

  async createStudentsJson(files: ReceivedFiles) {
    try {
      const errorsDatabase = [];
      const errorsMailer = [];
      const allUsers = [];
      const filePath = files['user-json'][0].path;
      const data = JSON.parse(await readFile(filePath, 'utf8'));
      for (const student of data as CreateStudentDto[]) {
        try {
          if (!validateEmail(student.email)) {
            throw {
              code: 'C001',
              message: `Błędny adres email: ${student.email}`,
            };
          }
          if (!(await this.userModel.findOne({ email: student.email }))) {
            const newStudentMongo = await this.userModel.create({
              idUser: uuid(),
              role: UserRole.Student,
              email: student.email.toLowerCase().trim(),
              login: student.email
                .toLowerCase()
                .split('@')[0]
                .concat('-', uuid()),
              activeAccount: false,
              registerCode: uuid(),
            });
            await newStudentMongo.save();

            const studentSql = new Student();
            studentSql.id = newStudentMongo.idUser;
            studentSql.courseCompletion = student.courseCompletion;
            studentSql.courseEngagement = student.courseEngagement;
            studentSql.projectDegree = student.projectDegree;
            studentSql.teamProjectDegree = student.teamProjectDegree;
            studentSql.bonusProjectUrls = student.bonusProjectUrls;
            await studentSql.save();

            allUsers.push(newStudentMongo);
          } else
            throw {
              code: 'C001',
              message: `Kursant o takim adresie email: ${student.email} już istnieje`,
            };
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
