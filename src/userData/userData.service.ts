import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { Interview } from 'src/interview/entities/interview.entity';
import { InterviewService } from '../interview/interview.service';
import { Student } from './entities/student.entity';
import { Hr } from './entities/hr.entity';

@Injectable()
export class UserDataService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(forwardRef(() => InterviewService))
    private interviewService: InterviewService,
  ) {}

  async activateMariaAccount({
    idUser,
    firstName,
    lastName,
  }: {
    idUser: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    // if ((await this.getAllUsers()).some(user => user.email === newUser.email)) {
    //   throw new Error("This email is already in use");
    // }
    try {
      const user = new User();
      user.idUser = idUser;
      user.firstName = firstName;
      user.lastName = lastName;
      await user.save();

      return user;
    } catch (err) {
      throw err;
    }
  }

  async getAllStudentsForHr(): Promise<JsonCommunicationType> {
    try {
      const users = await User.find({
        relations: [
          'infoStudent',
          'infoStudent.interview',
          'infoStudent.interview.hr',
        ],
        where: {
          infoStudent: true,
        },
      });
      const filteredUsers = users.filter(
        (user) => user.infoStudent.interview === null,
      );
      return {
        success: true,
        typeData: 'array',
        data: {
          info: {
            elements: filteredUsers.length,
            pages: 0,
          },
          value: filteredUsers,
        },
      };
    } catch (err) {
      return {
        success: false,
        typeData: 'status',
        data: { code: 'A0001', message: `${err}` },
      };
    }
  }

  async getStudent(idUser: string): Promise<JsonCommunicationType> {
    try {
      const student = await User.findOne({
        relations: [
          'infoStudent',
          'infoStudent.interview',
          'infoStudent.interview.hr',
        ],
        where: { idUser: idUser },
      });
      if (student === null) {
        return {
          success: false,
          typeData: 'status',
          data: { code: 'A0001', message: 'User not found' },
        };
      }
      return {
        success: true,
        typeData: 'element',
        data: {
          type: 'object',
          value: student,
        },
      };
    } catch (e) {
      return {
        success: false,
        typeData: 'status',
        data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
      };
    }
  }

  async getAllInterviewsForHr(idHr: string): Promise<JsonCommunicationType> {
    try {
      const interviews = await User.find({
        relations: [
          'infoStudent',
          'infoStudent.interview',
          'infoStudent.interview.hr',
        ],
        where: {
          infoStudent: {
            interview: {
              hr: {
                id: idHr,
              },
            },
          },
        },
      });
      // const interviews = Interview.find({
      //   relations: ['hr'],
      //   where: { hr: { id: idHr } },
      // });
      return {
        success: true,
        typeData: 'array',
        data: {
          info: {
            elements: interviews.length,
            pages: 0,
          },
          value: interviews,
        },
      };
    } catch (err) {
      return {
        success: false,
        typeData: 'status',
        data: { code: 'A0001', message: `${err}` },
      };
    }
  }

  async removeInterviewByHr(
    id: string,
    idHr: string,
  ): Promise<JsonCommunicationType> {
    const student = await Student.findOne({
      relations: ['interview'],
      where: {
        interview: {
          id: id,
        },
      },
    });
    const hr = await Hr.findOne({ where: { id: idHr } });
    if (student) {
      student.interview = null;
      await student.save();
      hr.reservedStudents -= 1;
      await hr.save();
    }
    await this.interviewService.deleteInterview(id);
    return {
      success: true,
      typeData: 'status',
      data: null,
    };
  }

  async addToInterview(
    infoStudentId: string,
    idHr: string,
  ): Promise<JsonCommunicationType> {
    const hr = await Hr.findOne({ where: { id: idHr } });
    if (hr.reservedStudents >= 5) {
      return {
        success: false,
        typeData: 'status',
        data: {
          code: 'A0003',
          message: `Maksymalna ilość osób zaproszonych na rozmowę wynosi 5`,
        },
      };
    }
    const student = await Student.findOne({
      relations: ['interview'],
      where: { id: infoStudentId },
    });
    if (student.interview === null) {
      const interview = new Interview();
      interview.hr = hr;
      await interview.save();

      student.interview = interview;
      await student.save();

      hr.reservedStudents += 1;
      await hr.save();
    }

    return {
      success: true,
      typeData: 'status',
      data: null,
    };
  }

  async updateStudentInfo(idUser, body): Promise<JsonCommunicationType> {
    const user = await User.findOne({
      relations: [
        'infoStudent',
        'infoStudent.interview',
        'infoStudent.interview.hr',
      ],
      where: { idUser },
    });
    const infoStudentID = user.infoStudent.id;

    const updateStudentInfo = await Student.update(
      { id: infoStudentID },
      {
        status: body.status,
        bonusProjectUrls: body.bonusProjectUrls,
        tel: body.tel,
        githubUsername: body.githubUsername,
        portfolioUrls: body.portfolioUrls,
        projectUrls: body.projectUrls,
        bio: body.bio,
        expectedTypeWork: body.expectedTypeWork,
        targetWorkCity: body.targetWorkCity,
        expectedContractType: body.expectedContractType,
        expectedSalary: body.expectedSalary,
        canTakeApprenticeship: body.canTakeApprenticeship,
        monthsOfCommercialExp: body.monthsOfCommercialExp,
        education: body.education,
        workExperience: body.workExperience,
        courses: body.courses,
      },
    );
    return {
      success: true,
      typeData: 'status',
      data: null,
    };
  }
}
