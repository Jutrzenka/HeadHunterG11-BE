import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../auth/schema/user.schema';
import { Admin, AdminSchema } from './schema/admin.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAdminStrategy } from './authorization-token/jwtAdmin.strategy';
import { AdminAuthService } from './admin-auth.service';
import { UserDataService } from '../userData/userData.service';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminAuthService,
    UserDataService,
    AuthService,
    JwtAdminStrategy,
  ],
  exports: [JwtAdminStrategy],
})
export class AdminModule {}
