import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwtAdmin.strategy';
import { v4 as uuid } from 'uuid';
import configuration from '../../Utils/config/configuration';
import { UserRole } from '../../Utils/types/user/AuthUser.type';
import { Admin, AdminDocument } from '../schema/admin.schema';

@Injectable()
export class AdminTokenService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
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

  public async generateToken(user: Admin): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await this.adminModel.findOne({ accessToken: token });
    } while (!!userWithThisToken);
    await this.adminModel.findOneAndUpdate(
      { idUser: user.idUser },
      { accessToken: token },
    );
    return token;
  }
}
