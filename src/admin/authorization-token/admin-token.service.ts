import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { JwtAdminPayload } from './jwtAdmin.strategy';
import { v4 as uuid } from 'uuid';
import configuration from '../../Utils/config/configuration';
import { Admin, AdminDocument } from '../schema/admin.schema';

@Injectable()
export class AdminTokenService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
  ) {}

  public createAdminToken(
    currentTokenId: string,
    idAdmin: string,
    login: string,
  ): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtAdminPayload = { id: currentTokenId, idAdmin, login };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(payload, configuration().server.secretKey, {
      expiresIn,
    });
    return {
      accessToken,
      expiresIn,
    };
  }

  public async generateAdminToken(admin: Admin): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await this.adminModel.findOne({ accessToken: token });
    } while (!!userWithThisToken);
    await this.adminModel.findOneAndUpdate(
      { idAdmin: admin.idAdmin, login: admin.login },
      { accessToken: token },
    );
    return token;
  }
}
