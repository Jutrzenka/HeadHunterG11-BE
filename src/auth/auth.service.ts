import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/Utils/schema/user.schema';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { hashPwd } from 'src/Utils/hash-pwd';
import { v4 as uuid } from 'uuid';
import configuration from '../Utils/config/configuration';
import { UserRole } from '../Utils/types/user/authUser';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private tokenService: TokenService,
  ) {}

  // Zapisywanie
  async register(
    idUser: uuid,
    role: UserRole,
    email: string,
    password: string,
  ): Promise<User> {
    const newUser = await this.userModel.create({
      idUser: idUser,
      role: role,
      email: email,
      password: password,
      accessToken: null,
      registerCode: null,
    });
    return newUser.save();
  }

  async login(req: AuthLoginDto, res: Response) {
    try {
      const user = await this.userModel.findOne({
        email: req.email,
        pwdHash: hashPwd(req.pwd),
      });
      if (!user) {
        return res.json({ error: 'Invalid login data!' });
      }
      const token = this.tokenService.createToken(
        await this.tokenService.generateToken(user),
      );

      return res
        .cookie('jwt', token.accessToken, {
          secure: false, // w wersji produkcyjnej (https) ustawiamy true
          domain: configuration().server.domain,
          httpOnly: true,
        })
        .json({ ok: true });
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
