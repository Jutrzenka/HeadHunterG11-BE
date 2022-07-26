import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/Utils/schema/user.schema';
import { JwtStrategy } from './jwt.strategy';
import { TokenService } from './token.service';
import { UserDataService } from '../userData/userData.service';

@Module({
  imports: [
    //add schema for auth
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenService, UserDataService],
  exports: [JwtStrategy],
})
export class AuthModule {}
