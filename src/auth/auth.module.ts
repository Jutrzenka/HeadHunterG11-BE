import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/Utils/schema/user.schema';
import { JwtStudentStrategy } from './jwtStudent.strategy';
import { TokenService } from './token.service';
import { UserDataService } from '../userData/userData.service';
import { JwtHrStrategy } from './jwtHr.strategy';

@Module({
  imports: [
    //add schema for auth
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStudentStrategy,
    JwtHrStrategy,
    TokenService,
    UserDataService,
  ],
  exports: [JwtStudentStrategy, JwtHrStrategy],
})
export class AuthModule {}
