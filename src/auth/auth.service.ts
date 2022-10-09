import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
<<<<<<< HEAD
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
=======
import { User, UserDocument } from 'src/Utils/schema/user.schema';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import configuration from '../Utils/config/configuration';
import { UserRole } from '../Utils/types/user/AuthUser.type';
import { TokenService } from './token.service';
import { encryption } from '../Utils/function/bcrypt';
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
<<<<<<< HEAD
    private authModel: Model<UserDocument>,
    @Inject(forwardRef(() => UserTokenService))
    private tokenService: UserTokenService,
    @Inject(forwardRef(() => UserDataService))
    private userDataService: UserDataService,
  ) {}

  async activateMongoAccount({
=======
    private userModel: Model<UserDocument>,
    private tokenService: TokenService,
  ) {}

  // Dodawanie użytkownika przez Kubę
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
      email,
      login: email.toUpperCase().split('@')[0].concat('-', uuid()),
      registerCode: uuid(),
    });
    return newUser.save();
  }

  // Dopisywanie wymaganych danych podczas pierwszego logowania
  async register({
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950
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
<<<<<<< HEAD
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
=======
      login,
      registerCode,
    };
    const updateData = {
      login: newLogin,
      password: hashPassword.data,
      registerCode: null,
    };
    return this.userModel.findOneAndUpdate(filter, updateData, {
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950
      new: true,
    });
  }

<<<<<<< HEAD
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
=======
  async login(req: AuthLoginDto, res: Response) {
    try {
      const hashPassword = await encryption(req.pwd);
      if (!hashPassword.status) {
        throw new Error(hashPassword.error);
      }
      const user = await this.userModel.findOne({
        email: req.email,
        hashPassword,
      });
      if (!user) {
        // return res.json({ error: 'Invalid login data!' });
        return {
          success: false,
          typeData: 'status',
          data: { code: 404, message: 'Not found this User' },
        };
      }

      if (user.role === UserRole.Student) {
        const token = this.tokenService.createToken(
          await this.tokenService.generateToken(user),
          user.role,
        );

        return (
          res
            .cookie('jwt', token.accessToken, {
              secure: false, // w wersji produkcyjnej (https) ustawiamy true
              domain: configuration().server.domain,
              httpOnly: true,
            })
            // .json({ ok: true, student: true });
            .json({
              success: true,
              typeData: 'status',
              data: null,
            })
        );
      }

      if (user.role === UserRole.HeadHunter) {
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950
        const token = this.tokenService.createToken(
          await this.tokenService.generateToken(user),
          user.role,
        );

<<<<<<< HEAD
        return res
          .status(200)
          .cookie('jwt', token.accessToken, {
            secure: configuration().server.secure,
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
      res.clearCookie('jwt');

      return res.status(200).json(generateSuccessResponse());
    } catch (err) {
      return res.json(generateErrorResponse(err, err.message, err.status));
=======
        return (
          res
            .cookie('jwt', token.accessToken, {
              secure: false,
              domain: configuration().server.domain,
              httpOnly: true,
            })
            // .json({ ok: true, hr: true });
            .json({
              success: true,
              typeData: 'status',
              data: null,
            })
        );
      }
    } catch (e) {
      // return res.json({ error: e.message });
      return {
        success: false,
        typeData: 'status',
        data: { code: 404, message: e.message },
      };
    }
  }

  async logout(user: User, res: Response) {
    try {
      user.accessToken = null;
      await user.save();
      res.clearCookie('jwt', {
        secure: false,
        domain: configuration().server.domain,
        httpOnly: true,
      });
      // return res.json({ ok: true });
      return res.json({
        success: true,
        typeData: 'status',
        data: null,
      });
    } catch (e) {
      // return res.json({ error: e.message });
      return {
        success: false,
        typeData: 'status',
        data: { code: 404, message: e.message },
      };
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950
    }
  }
}
