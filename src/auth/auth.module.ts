import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
<<<<<<< HEAD
import { User, UserSchema } from 'src/auth/schema/user.schema';
import { JwtStudentStrategy } from './authorization-token/jwtStudent.strategy';
import { UserTokenService } from './authorization-token/user-token.service';
import { JwtHrStrategy } from './authorization-token/jwtHr.strategy';
import { UserDataModule } from '../userData/userData.module';
import { JwtAllStrategy } from './authorization-token/jwtAll.strategy';

@Module({
  imports: [
=======
import { User, UserSchema } from 'src/Utils/schema/user.schema';
import { JwtStudentStrategy } from './jwtStudent.strategy';
import { TokenService } from './token.service';
import { JwtHrStrategy } from './jwtHr.strategy';
import { UserDataModule } from '../userData/userData.module';

@Module({
  imports: [
    //add schema for auth
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UserDataModule),
  ],
  controllers: [AuthController],
<<<<<<< HEAD
  providers: [
    AuthService,
    JwtStudentStrategy,
    JwtHrStrategy,
    JwtAllStrategy,
    UserTokenService,
  ],
  exports: [
    JwtStudentStrategy,
    JwtHrStrategy,
    JwtAllStrategy,
    AuthService,
    UserTokenService,
  ],
=======
  providers: [AuthService, JwtStudentStrategy, JwtHrStrategy, TokenService],
  exports: [JwtStudentStrategy, JwtHrStrategy, AuthService],
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950
})
export class AuthModule {}
