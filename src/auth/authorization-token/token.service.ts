import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/schema/user.schema';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwtStudent.strategy';
import { v4 as uuid } from 'uuid';
import configuration from '../../Utils/config/configuration';
import { UserRole } from '../../Utils/types/user/AuthUser.type';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(User.name)
    private authModel: Model<UserDocument>,
  ) {}

  public createToken(
    currentTokenId: string,
    userRole: UserRole,
  ): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId, role: userRole };
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
      userWithThisToken = await this.authModel.findOne({ accessToken: token });
    } while (!!userWithThisToken);
    await this.authModel.findOneAndUpdate(
      { idUser: user.idUser },
      { accessToken: token },
    );
    return token;
  }
}
