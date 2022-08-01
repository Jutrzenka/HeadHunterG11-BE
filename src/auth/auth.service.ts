import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/schema/user.schema';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import configuration from '../Utils/config/configuration';
import { UserRole } from '../Utils/types/user/AuthUser.type';
import { UserTokenService } from './authorization-token/user-token.service';
import { decryption, encryption } from '../Utils/function/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private tokenService: UserTokenService,
  ) {}

  // Dopisywanie wymaganych danych podczas pierwszego logowania
  async register({
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
    };
    return this.userModel.findOneAndUpdate(filter, updateData, {
      new: true,
    });
  }

  async login(req: AuthLoginDto, res: Response) {
    try {
      const user = await this.userModel.findOne({
        email: req.email,
      });
      const isUser = await decryption(req.pwd, user.password);
      if (!isUser) {
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

        return res
          .cookie('jwt', token.accessToken, {
            secure: false, // w wersji produkcyjnej (https) ustawiamy true
            domain: configuration().server.domain,
            httpOnly: true,
          })
          .json({
            success: true,
            typeData: 'status',
            data: null,
          });
      }

      if (user.role === UserRole.HeadHunter) {
        const token = this.tokenService.createToken(
          await this.tokenService.generateToken(user),
          user.role,
        );

        return res
          .cookie('jwt', token.accessToken, {
            secure: false,
            domain: configuration().server.domain,
            httpOnly: true,
          })
          .json({
            success: true,
            typeData: 'status',
            data: null,
          });
      }
    } catch (e) {
      return {
        success: false,
        typeData: 'status',
        data: { code: 404, message: e.message },
      };
    }
  }

  async logout(user: User, res: Response) {
    try {
      await this.userModel.findOneAndUpdate(
        { idUser: user.idUser },
        { accessToken: null },
      );
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
    }
  }

  async editEmail() {}

  async newRegisterCode() {}
}
