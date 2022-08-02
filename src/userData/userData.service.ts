import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { Interview } from 'src/interview/entities/interview.entity';

@Injectable()
export class UserDataService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
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

  // async getAllStudentsForHr(): Promise<User[]> {
  //   return User.find({
  //     relations: ['infoStudent', 'infoStudent.interview'],
  //     where: {
  //       infoStudent: {
  //         interview: {
  //           id: undefined,
  //         },
  //       },
  //     },
  //   });
  // }
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
        data: { code: 'A0001', message: 'Not found this User' },
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
}
