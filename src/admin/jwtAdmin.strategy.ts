import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import configuration from '../Utils/config/configuration';

export interface JwtAdminPayload {
  id: string;
}

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwtAdmin') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: configuration().server.secretKey,
    });
  }

  async validate(payload: JwtAdminPayload, done: (error, user) => void) {
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }
    // tutaj chyba tak bedzie ten schemat z mongo admina adminModel
    const admin = await this.adminModel.findOne({
      accessToken: payload.id,
    });

    if (!admin) {
      return done(new UnauthorizedException(), false);
    }
    done(null, admin);
  }
}
