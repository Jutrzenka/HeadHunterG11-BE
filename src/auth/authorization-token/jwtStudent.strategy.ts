import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy } from 'passport-jwt';
import configuration from '../../Utils/config/configuration';
import { UserRole } from '../../Utils/types/user/AuthUser.type';
import { User, UserDocument } from '../schema/user.schema';

export interface JwtPayload {
  id: string;
  role: UserRole;
}

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class JwtStudentStrategy extends PassportStrategy(
  Strategy,
  'jwtStudent',
) {
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
    if (!payload || !payload.id || payload.role !== UserRole.Student) {
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
