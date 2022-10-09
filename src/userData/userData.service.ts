<<<<<<< HEAD
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { Interview } from 'src/interview/entities/interview.entity';
import { InterviewService } from '../interview/interview.service';
import { Student } from './entities/student.entity';
import { Hr } from './entities/hr.entity';
import { FilterStudents, Status } from '../Utils/types/user/Student.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from '../auth/schema/user.schema';
import { MailService } from '../mail/mail.service';
import * as striptags from 'striptags';
import {
  generateArrayResponse,
  generateElementResponse,
  generateErrorResponse,
  generateSuccessResponse,
  RestStandardError,
} from '../Utils/function/generateJsonResponse/generateJsonResponse';
import { employStudentByHrEmailTemplate } from '../mail/templates/employStudentByHr-email.template';
import { employEmailTemplate } from '../mail/templates/employ-email.template';
import { UpdateStudentDto } from './dto/update-student.dto';
import { validateEmail } from '../Utils/function/validateEmail';
import { Between, MoreThanOrEqual } from 'typeorm';
=======
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950

@Injectable()
export class UserDataService {
  constructor(
<<<<<<< HEAD
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(forwardRef(() => InterviewService))
    private interviewService: InterviewService,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
  ) {}

  async activateMariaAccount({ idUser }: { idUser: string }): Promise<any> {
    await Student.update(
      { id: idUser },
      {
        status: Status.Active,
      },
    );
  }

  async getAllStudentsForHr(
    page: number,
    elements: number,
    filter: FilterStudents,
  ): Promise<JsonCommunicationType> {
    const maxPerPage = elements <= 10 ? 10 : elements;
    const currentPage = page <= 1 ? 1 : page;
    const {
      canTakeApprenticeship,
      monthsOfCommercialExp,
      courseCompletion,
      courseEngagement,
      expectedContractType,
      expectedTypeWork,
      minSalary,
      maxSalary,
      projectDegree,
      teamProjectDegree,
    } = filter;
    try {
      const [users, count] = await Student.findAndCount({
        where: {
          status: Status.Active,
          courseCompletion:
            courseCompletion && MoreThanOrEqual(courseCompletion),
          courseEngagement:
            courseEngagement && MoreThanOrEqual(courseEngagement),
          projectDegree: projectDegree && MoreThanOrEqual(projectDegree),
          teamProjectDegree:
            teamProjectDegree && MoreThanOrEqual(teamProjectDegree),
          canTakeApprenticeship,
          monthsOfCommercialExp,
          expectedContractType,
          expectedTypeWork,
          expectedSalary:
            minSalary && maxSalary
              ? Between(minSalary, maxSalary)
              : minSalary
              ? Between(minSalary, 100000)
              : maxSalary && Between(1, maxSalary),
        },
        skip: maxPerPage * (currentPage - 1),
        take: maxPerPage,
      });
      const totalPages = Math.ceil(count / maxPerPage);

      return generateArrayResponse(count, totalPages, users);
    } catch (err) {
      return generateErrorResponse(err, err.message, err.status);
    }
  }

  async getStudentForHr(idUser: string): Promise<JsonCommunicationType> {
    try {
      const student = await Student.findOne({
        where: { id: idUser, status: Status.Active },
      });
      if (!student) {
        throw new RestStandardError('Nie znaleziono takiego kursanta', 404);
      }
      return generateElementResponse('object', student);
    } catch (err) {
      return generateErrorResponse(err, err.message, err.status);
    }
  }

  async getStudent(user: User): Promise<JsonCommunicationType> {
    try {
      const student = await Student.findOne({
        where: { id: user.idUser, status: Status.Active },
      });

      return generateElementResponse('object', student);
    } catch (err) {
      return generateErrorResponse(err, err.message, err.status);
    }
  }

  async getAllInterviewsForHr(
    user: User,
    page: number,
    elements: number,
  ): Promise<JsonCommunicationType> {
    const maxPerPage = elements <= 5 ? 5 : elements;
    const currentPage = page <= 1 ? 1 : page;
    try {
      const [interviews, count] = await Interview.findAndCount({
        relations: ['student'],
        where: {
          hr: { id: user.idUser },
        },
        skip: maxPerPage * (currentPage - 1),
        take: maxPerPage,
      });

      const totalPages = Math.ceil(count / maxPerPage);

      return generateArrayResponse(count, totalPages, interviews);
    } catch (err) {
      return generateErrorResponse(err, err.message, err.status);
    }
  }

  async removeInterviewByHr(
    user: User,
    id: string,
  ): Promise<JsonCommunicationType> {
    try {
      const interview = await Interview.findOne({
        relations: ['hr'],
        where: {
          hr: { id: user.idUser },
          id,
        },
      });
      const hr = await Hr.findOne({
        where: { id: user.idUser },
      });

      if (interview) {
        await this.interviewService.deleteInterview(id);
        hr.reservedStudents -= 1;
        await hr.save();

        return generateSuccessResponse();
      } else {
        throw new RestStandardError('Taka rozmowa nie istnieje', 404);
      }
    } catch (err) {
      return generateErrorResponse(err, err.message, err.status);
    }
  }

  async addToInterview(
    user: User,
    studentId: string,
  ): Promise<JsonCommunicationType> {
    const hr = await Hr.findOne({ where: { id: user.idUser } });
    const student = await Student.findOne({
      where: { id: studentId },
    });
    const addedStudent = (
      await Interview.find({
        relations: ['student'],
        where: {
          hr: { id: user.idUser },
        },
      })
    ).some((interview) => interview.student.id === studentId);

    try {
      if (hr.reservedStudents >= 5) {
        throw new RestStandardError(
          'Osiągnięto maksymalną ilość zarezerwowanych rozmów',
          400,
        );
      }
      if (addedStudent) {
        throw new RestStandardError(
          'Rozmowa z tym kursantem została już zarezerwowana',
          400,
        );
      }
      if (!student) {
        throw new RestStandardError('Nie znaleziono takiego kursanta', 404);
      }

      if (student) {
        await this.interviewService.createInterview({ hr, student });

        hr.reservedStudents += 1;
        await hr.save();

        return generateSuccessResponse();
      }
    } catch (err) {
      return generateErrorResponse(err, err.message, err.status);
    }
  }

  async employStudent(user, studentId): Promise<JsonCommunicationType> {
    try {
      const student = await this.userModel.findOneAndUpdate(
        {
          idUser: studentId,
          activeAccount: true,
        },
        { activeAccount: false },
      );

      if (!student) {
        throw new RestStandardError('Kursant już został zatrudniony ', 400);
      }

      await Student.update({ id: studentId }, { status: Status.Employed });

      const hr = await Hr.findOne({ where: { id: user.idUser } });

      await this.mailService.sendMail(
        'admin@gmail.com',
        `Kursant został zatrudniony przez ${hr.company}`,
        employStudentByHrEmailTemplate(studentId, hr.company),
      );

      return generateSuccessResponse();
    } catch (err) {
      return generateErrorResponse(err, err.message, err.status);
    }
  }

  async getEmploy(user, res): Promise<JsonCommunicationType> {
    try {
      await this.userModel.findOneAndUpdate(
        {
          idUser: user.idUser,
          activeAccount: true,
        },
        { activeAccount: false },
      );

      await Student.update({ id: user.idUser }, { status: Status.Employed });

      await this.mailService.sendMail(
        'admin@gmail.com',
        `Kursant znalazł zatrudnienie`,
        employEmailTemplate(user.idUser),
      );

      await this.authService.logout(user, res);

      return res.json(generateSuccessResponse());
    } catch (err) {
      return res.json(generateErrorResponse(err, err.message, err.status));
    }
  }

  async updateStudentInfo(
    user: User,
    body: UpdateStudentDto,
  ): Promise<JsonCommunicationType> {
    try {
      if (!body) {
        throw new RestStandardError('Brak danych do aktualizacji', 400);
      }

      if (body.email && validateEmail(body.email)) {
        await this.userModel.findOneAndUpdate(
          { idUser: user.idUser },
          { email: body.email },
        );
      }

      await Student.update(
        { id: user.idUser },
        {
          status: body.status,
          firstName: striptags(body.firstName),
          lastName: striptags(body.lastName),
          tel: body.tel,
          githubUsername: striptags(body.githubUsername),
          portfolioUrls: body.portfolioUrls,
          projectUrls: body.projectUrls,
          bio: striptags(body.bio),
          expectedTypeWork: body.expectedTypeWork,
          targetWorkCity: striptags(body.targetWorkCity),
          expectedContractType: body.expectedContractType,
          expectedSalary: body.expectedSalary,
          canTakeApprenticeship: body.canTakeApprenticeship,
          monthsOfCommercialExp: body.monthsOfCommercialExp,
          education: striptags(body.education),
          workExperience: striptags(body.workExperience),
          courses: striptags(body.courses),
        },
      );
      return generateSuccessResponse();
    } catch (err) {
      return generateErrorResponse(err, err.message, err.status);
    }
=======
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create({
    idUser,
    firstName,
    lastName,
  }: {
    idUser: string;
    firstName: string;
    lastName: string;
  }) {
    return this.usersRepository.create({ idUser, firstName, lastName }).save();
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950
  }
}
