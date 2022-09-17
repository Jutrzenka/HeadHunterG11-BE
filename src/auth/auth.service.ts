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
  RestStandardError,
} from '../Utils/function/generateJsonResponse/generateJsonResponse';
import * as striptags from 'striptags';
import { RegisterUserDto } from './dto/register-user.dto';

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
      login: striptags(login),
      registerCode: striptags(registerCode),
    };
    const updateData = {
      login: striptags(newLogin),
      password: hashPassword.data,
      registerCode: null,
      activeAccount: true,
    };
    return this.authModel.findOneAndUpdate(filter, updateData, {
      new: true,
    });
  }

  async activateFullAccount(
    param,
    body: RegisterUserDto,
  ): Promise<JsonCommunicationType> {
    const { login, registerCode } = param;
    const { newLogin, password } = body;
    try {
      const mongoDbData = await this.activateMongoAccount({
        login,
        newLogin,
        password,
        registerCode,
      });
      if (!mongoDbData) {
        throw new RestStandardError('Błędny link do rejestracji', 400);
      }
      if (mongoDbData.role === UserRole.Student) {
        await this.userDataService.activateMariaAccount({
          idUser: mongoDbData.idUser,
        });
      }

      return generateSuccessResponse();
    } catch (err) {
      if (err.code === 11000) {
        throw new RestStandardError(
          'Użytkownik z takim loginem już istnieje',
          400,
        );
      }
      return generateErrorResponse(err, err.message, err.status);
    }
  }

  async login(req: AuthLoginDto, res: Response) {
    try {
      const user = await this.authModel.findOne({
        email: striptags(req.email),
      });

      if (!user) {
        throw new RestStandardError('Błędny email', 400);
      }

      const isUser = await decryption(req.pwd, user.password);

      if (!isUser) {
        throw new RestStandardError('Błędne hasło', 400);
      }

      if (
        (user.role === UserRole.Student && user.activeAccount) ||
        (user.role === UserRole.HeadHunter && user.activeAccount)
      ) {
        const token = this.tokenService.createToken(
          await this.tokenService.generateToken(user),
          user.role,
        );

        return res
          .status(200)
          .cookie('jwt', token.accessToken, {
            secure: configuration().server.ssl,
            domain: configuration().server.domain,
            sameSite: 'none',
            httpOnly: true,
          })
          .json(
            generateElementResponse('object', {
              id: user.idUser,
              login: user.login,
              role: user.role,
            }),
          );
      }
    } catch (err) {
      return res.json(generateErrorResponse(err, err.message, err.status));
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

      return res.status(200).json(generateSuccessResponse());
    } catch (err) {
      return res.json(generateErrorResponse(err, err.message, err.status));
    }
  }
}
