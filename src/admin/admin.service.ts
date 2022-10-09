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
  RestStandardError,
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
import * as striptags from 'striptags';
import { UserDataService } from '../userData/userData.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
    @Inject(forwardRef(() => UserDataService))
    private userDataService: UserDataService,
  ) {}

  async createStudent(body: CreateStudentDto): Promise<JsonCommunicationType> {
    try {
      const newStudentMongo = await this.userModel.create({
        idUser: uuid(),
        role: UserRole.Student,
        email: body.email.toLowerCase().trim(),
        login: body.email.toLowerCase().split('@')[0].concat('-', uuid()),
        activeAccount: false,
        registerCode: uuid(),
      });
      await newStudentMongo.save();

      const newStudentSql = new Student();
      newStudentSql.id = newStudentMongo.idUser;
      newStudentSql.courseCompletion = body.courseCompletion;
      newStudentSql.courseEngagement = body.courseEngagement;
      newStudentSql.projectDegree = body.projectDegree;
      newStudentSql.teamProjectDegree = body.teamProjectDegree;
      newStudentSql.bonusProjectUrls = body.bonusProjectUrls;
      await newStudentSql.save();

      await this.mailService.sendMail(
        body.email.toLowerCase().trim(),
        'Link aktywacyjny do platformy HeadHunter MegaK',
        registerEmailTemplate(
          newStudentMongo.login,
          newStudentMongo.registerCode,
        ),
      );
      return generateElementResponse('object', newStudentMongo);
    } catch (err) {
      if (err.code === 11000) {
        throw new RestStandardError(
          'Unikalne dane nie mogą się duplikować',
          400,
        );
      }
      return generateErrorResponse(err, err.message, err.status);
    }
  }

  async createHr(body: CreateHrDto): Promise<JsonCommunicationType> {
    try {
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
      hrSql.fullName = striptags(body.fullName);
      hrSql.company = striptags(body.company);
      await hrSql.save();

      await this.mailService.sendMail(
        newHrMongo.email.toLowerCase().trim(),
        'Link aktywacyjny do platformy HeadHunter MegaK',
        registerEmailTemplate(newHrMongo.login, newHrMongo.registerCode),
      );
      return generateElementResponse('object', newHrMongo);
    } catch (err) {
      if (err.code === 11000) {
        throw new RestStandardError(
          'Unikalne dane nie mogą się duplikować',
          400,
        );
      }
      return generateErrorResponse(err, err.message, err.status);
    }
  }

  async createStudentsJson(files: ReceivedFiles) {
    try {
      if (
        !files['user-json'] ||
        files['user-json'][0].mimetype !== 'application/json'
      ) {
        throw new RestStandardError(
          'Nie wysłano pliku, lub był w złym formacie',
          415,
        );
      }
      const errorsDatabase = [];
      const errorsMailer = [];
      const allUsers = [];
      const filePath = files['user-json'][0].path;
      const data = JSON.parse(await readFile(filePath, 'utf8'));
      for (const student of data as CreateStudentDto[]) {
        try {
          if (!validateEmail(student.email)) {
            throw { message: `Błedny email ${student.email}` };
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
              message: `Kursant o takim adresie email: ${student.email} już istnieje`,
            };
        } catch (err) {
          errorsDatabase.push({
            user: err.keyValue,
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
            message: err.message,
          });
        }
      }
      try {
        if (files['user-json']) await unlink(files['user-json'][0].path);
      } catch (err) {
        throw new RestStandardError(
          'Nie udało się usunąć pliku na końcu zapytania',
          500,
        );
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
      } catch (err) {
        throw new RestStandardError(
          'Nieznany błąd i nie udało się usunąć pliku, albo określonego pliku już brak',
          400,
        );
      }
      return generateErrorResponse(err, err.message, err.status);
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
      if (limit > 50 || limit < 1 || page < 1) {
        throw new RestStandardError('Błędne dane w body', 400);
      }
      return await searchUsersInMongo(
        { role: UserRole.Student, limit, page, filter },
        this.userModel,
      );
    } catch (err) {
      return generateErrorResponse(err, err.message, err.status);
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
      if (limit > 50 || limit < 1 || page < 1) {
        throw new RestStandardError('Błędne dane w body', 400);
      }
      return await searchUsersInMongo(
        { role: UserRole.HeadHunter, limit, page, filter },
        this.userModel,
      );
    } catch (err) {
      return generateErrorResponse(err, err.message, err.status);
    }
  }

  async deleteUser(idUser: string): Promise<JsonCommunicationType> {
    try {
      if (!idUser || idUser.length !== 36) {
        throw new RestStandardError('Niepoprawne ID', 400);
      }
      const user = await this.userModel.findOne({ idUser });
      const status = await this.userModel.deleteOne({ idUser }).exec();
      if (status.deletedCount !== 1) {
        throw new RestStandardError('Nie udało się usunąć użytkownika', 500);
      } else {
        user.role === UserRole.Student
          ? await Student.delete({ id: idUser })
          : await Hr.delete({ id: idUser });
        return generateSuccessResponse();
      }
    } catch (err) {
      return generateErrorResponse(err, err.message, err.status);
    }
  }

  async editEmail(
    idUser: string,
    newEmail: string,
  ): Promise<JsonCommunicationType> {
    try {
      if (!validateEmail(newEmail)) {
        throw new RestStandardError('Niepoprawny adres email', 400);
      }
      if (!idUser || idUser.length !== 36) {
        throw new RestStandardError('Niepoprawne ID', 400);
      }
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
        throw new RestStandardError('Taki użytkownik nie istnieje', 404);
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
        throw new RestStandardError(
          'Unikalne dane nie mogą się duplikować',
          400,
        );
      }
      return generateErrorResponse(err, err.message, err.status);
    }
  }

  async newPassword(idUser: string): Promise<JsonCommunicationType> {
    try {
      if (!idUser || idUser.length !== 36) {
        throw new RestStandardError('Niepoprawne ID', 400);
      }
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
        throw new RestStandardError('Taki użytkownik nie istnieje', 404);
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
        throw new RestStandardError(
          'Unikalne dane nie mogą się duplikować',
          400,
        );
      }
      return generateErrorResponse(err, err.message, err.status);
    }
  }
}
