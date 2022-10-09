import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../auth/schema/user.schema';
import { Admin, AdminSchema } from './schema/admin.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminAuthService } from './admin-auth.service';
import { JwtAdminStrategy } from './authorization-token/jwtAdmin.strategy';
import { AdminTokenService } from './authorization-token/admin-token.service';
import { MailModule } from '../mail/mail.module';
import { UserDataModule } from '../userData/userData.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => MailModule),
    forwardRef(() => UserDataModule),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminAuthService,
    JwtAdminStrategy,
    AdminTokenService,
  ],
  exports: [JwtAdminStrategy],
})
export class AdminModule {}
