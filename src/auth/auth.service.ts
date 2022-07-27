import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/Utils/schema/user.schema';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import configuration from '../Utils/config/configuration';
import { UserRole } from '../Utils/types/user/authUser';
import { TokenService } from './token.service';
import { encryption } from '../Utils/function/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private tokenService: TokenService,
  ) {}

  //async create() {}

  // Dopisywanie danych podczas pierwszego logowania
  async register(
    idUser: uuid,
    role: UserRole,
    email: string,
    password: string,
  ): Promise<User> {
    const hashPassword = await encryption(password);
    if (!hashPassword.status) {
      throw new Error(hashPassword.error);
    }
    const newUser = await this.userModel.create({
      idUser,
      role,
      email,
      password: hashPassword.data,
      accessToken: null,
      registerCode: null,
    });
    return newUser.save();
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
