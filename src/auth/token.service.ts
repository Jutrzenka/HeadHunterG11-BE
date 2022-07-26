import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/Utils/schema/user.schema';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwt.strategy';
import { v4 as uuid } from 'uuid';
import configuration from '../Utils/config/configuration';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  public createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(payload, configuration().server.secretKey, {
      expiresIn,
    });
    return {
      accessToken,
      expiresIn,
    };
  }

  public async generateToken(user: User): Promise<string> {
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
}
