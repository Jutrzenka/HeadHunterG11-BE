import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/schema/user.schema';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import configuration from '../Utils/config/configuration';
import { UserRole } from '../Utils/types/user/AuthUser.type';
import { UserTokenService } from './authorization-token/user-token.service';
import { decryption, encryption } from '../Utils/function/bcrypt';
import { UserDataService } from '../userData/userData.service';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import {
  generateElementResponse,
  generateErrorResponse,
  generateSuccessResponse,
} from '../Utils/function/generateJsonResponse/generateJsonResponse';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private authModel: Model<UserDocument>,
    @Inject(forwardRef(() => UserTokenService))
    private tokenService: UserTokenService,
    @Inject(forwardRef(() => UserDataService))
    private userDataService: UserDataService,
  ) {}

  // Dopisywanie wymaganych danych podczas pierwszego logowania
  async activateMongoAccount({
    login,
    newLogin,
    password,
    registerCode,
  }: {
    login: string;
    newLogin: string;
    password: string;
    registerCode: string;
  }): Promise<User> {
    const hashPassword = await encryption(password);
    if (!hashPassword.status) {
      throw new Error(hashPassword.error);
    }
    const filter = {
      login,
      registerCode,
    };
    const updateData = {
      login: newLogin,
      password: hashPassword.data,
      registerCode: null,
      activeAccount: true,
    };
    return this.authModel.findOneAndUpdate(filter, updateData, {
      new: true,
    });
  }

  async activateFullAccount(param, body): Promise<JsonCommunicationType> {
    const { login, registerCode } = param;
    const { newLogin, password, firstName, lastName } = body;
    try {
      const mongoDbData = await this.activateMongoAccount({
        login,
        newLogin,
        password,
        registerCode,
      });
      if (!mongoDbData) {
        return generateErrorResponse('C000');
      }
      const mariaDbData = await this.userDataService.activateMariaAccount({
        idUser: mongoDbData.idUser,
        firstName,
        lastName,
      });

      // if (mongoDbData.role === UserRole.Student) {
      //   const studentInfo = new Student();
      //   mariaDbData.infoStudent = studentInfo;
      //   studentInfo.status = Status.Active;
      //   await mariaDbData.save();
      // }
      //
      // if (mongoDbData.role === UserRole.HeadHunter) {
      //   const hrInfo = new Hr();
      //   mariaDbData.infoHR = hrInfo;
      //   await mariaDbData.save();
      // }

      return generateSuccessResponse();
    } catch (err) {
      if (err.code === 11000) {
        return generateErrorResponse('C003');
      }
      return generateErrorResponse('A000');
    }
  }

  async login(req: AuthLoginDto, res: Response) {
    try {
      const user = await this.authModel.findOne({
        email: req.email,
      });
      const isUser = await decryption(req.pwd, user.password);
      if (!isUser) {
        return generateErrorResponse('D000');
      }

      if (user.role === UserRole.Student) {
        const token = this.tokenService.createToken(
          await this.tokenService.generateToken(user),
          user.role,
        );

        return res
          .cookie('jwt', token.accessToken, {
            secure: configuration().server.ssl,
            domain: configuration().server.domain,
            httpOnly: true,
          })
          .json(
            generateElementResponse('object', {
              id: user.idUser,
              login: user.login,
              role: 'STUDENT',
            }),
          );
      }

      if (user.role === UserRole.HeadHunter) {
        const token = this.tokenService.createToken(
          await this.tokenService.generateToken(user),
          user.role,
        );

        return res
          .cookie('jwt', token.accessToken, {
            secure: configuration().server.ssl,
            domain: configuration().server.domain,
            httpOnly: true,
          })
          .json(
            generateElementResponse('object', {
              id: user.idUser,
              login: user.login,
              role: 'HEADHUNTER',
            }),
          );
      }
    } catch (e) {
      return res.json(generateErrorResponse('D000'));
    }
  }

  async logout(user: User, res: Response): Promise<any> {
    try {
      await this.authModel.findOneAndUpdate(
        { idUser: user.idUser },
        { accessToken: null },
      );
      res.clearCookie('jwt', {
        secure: configuration().server.ssl,
        domain: configuration().server.domain,
        httpOnly: true,
      });
      // return res.json({ ok: true });
      return res.json(generateSuccessResponse());
    } catch (e) {
      // return res.json({ error: e.message });
      return {
        success: false,
        typeData: 'status',
        data: { code: 404, message: e.message },
      };
    }
  }
}
