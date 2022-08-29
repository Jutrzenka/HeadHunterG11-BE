import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import configuration from '../../Utils/config/configuration';
import { UserRole } from '../../Utils/types/user/AuthUser.type';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';

export interface JwtPayload {
  id: string;
  role: UserRole;
}

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class JwtAllStrategy extends PassportStrategy(Strategy, 'jwtAll') {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: configuration().server.secretKey,
    });
  }

  async validate(payload: JwtPayload, done: (error, user) => void) {
    if (!payload || !payload.id || !payload.role) {
      return done(new UnauthorizedException(), false);
    }

    const user = await this.userModel.findOne({
      accessToken: payload.id,
      role: payload.role,
    });

    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
