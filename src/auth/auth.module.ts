import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/auth/schema/user.schema';
import { JwtStudentStrategy } from './authorization-token/jwtStudent.strategy';
import { TokenService } from './authorization-token/token.service';
import { JwtHrStrategy } from './authorization-token/jwtHr.strategy';
import { UserDataModule } from '../userData/userData.module';

@Module({
  imports: [
    //add schema for auth
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UserDataModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStudentStrategy, JwtHrStrategy, TokenService],
  exports: [JwtStudentStrategy, JwtHrStrategy, AuthService],
})
export class AuthModule {}
