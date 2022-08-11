import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import configuration from '../../Utils/config/configuration';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../schema/admin.schema';

export interface JwtAdminPayload {
  id: string;
  idAdmin: string;
  login: string;
}

function cookieAdminExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwtAdmin ?? null : null;
}

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwtAdmin') {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
  ) {
    super({
      jwtFromRequest: cookieAdminExtractor,
      secretOrKey: configuration().server.secretKey,
    });
  }

  async validate(payload: JwtAdminPayload, done: (error, user) => void) {
    if (!payload || !payload.id || !payload.idAdmin || !payload.login) {
      return done(new UnauthorizedException(), false);
    }

    const admin = await this.adminModel.findOne({
      accessToken: payload.id,
      idAdmin: payload.idAdmin,
      login: payload.login,
    });

    if (!admin) {
      return done(new UnauthorizedException(), false);
    }
    done(null, admin);
  }
}
