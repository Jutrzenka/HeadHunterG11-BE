import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { Interview } from 'src/interview/entities/interview.entity';
import { InterviewService } from '../interview/interview.service';
import { Student } from './entities/student.entity';
import { Hr } from './entities/hr.entity';
import { Status } from '../Utils/types/user/Student.type';
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
} from '../Utils/function/generateJsonResponse/generateJsonResponse';
import { employStudentByHrEmailTemplate } from '../mail/templates/employStudentByHr-email.template';
import { employEmailTemplate } from '../mail/templates/employ-email.template';
import { UpdateStudentDto } from './dto/update-student.dto';
import { validateEmail } from '../Utils/function/validateEmail';

@Injectable()
export class UserDataService {
  constructor(
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
  ): Promise<JsonCommunicationType> {
    const maxPerPage = elements ? elements : 10;
    const currentPage = page ? page : 1;
    try {
      const [users, count] = await Student.findAndCount({
        where: {
          status: Status.Active,
        },
        skip: maxPerPage * (currentPage - 1),
        take: maxPerPage,
      });
      const totalPages = Math.ceil(count / maxPerPage);

      return generateArrayResponse(count, totalPages, users);
    } catch (err) {
      return generateErrorResponse('A000');
    }
  }

  async getStudentForHr(idUser: string): Promise<JsonCommunicationType> {
    try {
      const student = await Student.findOne({
        where: { id: idUser, status: Status.Active },
      });
      if (!student) {
        return generateErrorResponse('C007');
      }
      return generateElementResponse('object', student);
    } catch (e) {
      return generateErrorResponse('A000');
    }
  }

  async getStudent(user: User): Promise<JsonCommunicationType> {
    try {
      const student = await Student.findOne({
        where: { id: user.idUser, status: Status.Active },
      });

      return generateElementResponse('object', student);
    } catch (e) {
      return generateErrorResponse('A000');
    }
  }

  async getAllInterviewsForHr(
    user: User,
    page: number,
    elements: number,
  ): Promise<JsonCommunicationType> {
    const maxPerPage = elements ? elements : 5;
    const currentPage = page ? page : 1;
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
      return generateErrorResponse('A000');
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
        return generateErrorResponse('C005');
      }
    } catch (err) {
      return generateErrorResponse('A000');
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
        return generateErrorResponse('C006');
      }
      if (addedStudent) {
        return generateErrorResponse('C008');
      }
      if (!student) {
        return generateErrorResponse('C007');
      }

      if (student) {
        await this.interviewService.createInterview({ hr, student });

        hr.reservedStudents += 1;
        await hr.save();

        return generateSuccessResponse();
      }
    } catch (e) {
      return generateErrorResponse('A000');
    }
  }

  async employStudent(user, studentId): Promise<JsonCommunicationType> {
    await this.userModel.findOneAndUpdate(
      {
        idUser: studentId,
      },
      { activeAccount: false },
    );

    await Student.update({ id: studentId }, { status: Status.Employed });

    const hr = await Hr.findOne({ where: { id: user.idUser } });

    await this.mailService.sendMail(
      'admin@gmail.com',
      `Kursant został zatrudniony przez ${hr.company}`,
      employStudentByHrEmailTemplate(studentId, hr.company),
    );

    return generateSuccessResponse();
  }

  async updateStudentInfo(
    user: User,
    body: UpdateStudentDto,
    res,
  ): Promise<JsonCommunicationType> {
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
    if (validateEmail(body.email)) {
      await this.userModel.findOneAndUpdate(
        { idUser: user.idUser },
        { email: body.email },
      );
    }
    if (body.status === Status.Employed) {
      await this.userModel.findOneAndUpdate(
        {
          idUser: user.idUser,
        },
        { activeAccount: false },
      );

      await this.mailService.sendMail(
        'admin@gmail.com',
        `Kursant znalazł zatrudnienie`,
        employEmailTemplate(user.idUser),
      );

      await this.authService.logout(user, res);
    }
    return res.json(generateSuccessResponse());
  }
}
