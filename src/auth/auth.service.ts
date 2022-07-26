import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from 'src/Utils/schema/user.schema';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { hashPwd } from 'src/Utils/hash-pwd';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwt.strategy';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async newUser(): Promise<User> {
    const newUser = await this.userModel.create({
      idUser: uuidv4(),
      role: 'A',
      email: 'e@mai.l',
      password: '111111',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      registerCode: 'dadfaDA56adfad',
    });
    return newUser.save();
  }

  findAll() {
    return `This action returns all users`;
  }

  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(payload, process.env.SECRET_OR_KEY, { expiresIn });
    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(user: User): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await this.userModel.findOne({
        currentTokenId: token,
      });
    } while (!!userWithThisToken);
    user.accessToken = token;
    await user.save();
    return token;
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
      const token = this.createToken(await this.generateToken(user));

      return res
        .cookie('jwt', token.accessToken, {
          secure: false, // w wersji produkcyjnej (https) ustawiamy true
          domain: 'localhost',
          httpOnly: true,
        })
        .json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}
