import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../auth/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAdminStrategy } from './jwtAdmin.strategy';

@Module({
  imports: [
    //add schema for admin
    // MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtAdminStrategy],
  exports: [JwtAdminStrategy],
})
export class AdminModule {}
