import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/Utils/schema/user.schema';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import configuration from '../Utils/config/configuration';
import { UserRole } from '../Utils/types/user/AuthUser.type';
import { TokenService } from './token.service';
import { encryption } from '../Utils/function/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
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
      const hashPassword = await encryption(req.pwd);
      if (!hashPassword.status) {
        throw new Error(hashPassword.error);
      }
      const user = await this.userModel.findOne({
        email: req.email,
        hashPassword,
      });
      if (!user) {
        return res.json({ error: 'Invalid login data!' });
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
          .json({ ok: true, student: true });
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
          .json({ ok: true, hr: true });
      }
    } catch (e) {
      return res.json({ error: e.message });
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
      return res.json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}
