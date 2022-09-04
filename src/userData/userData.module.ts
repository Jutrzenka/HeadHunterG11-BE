import { forwardRef, Module } from '@nestjs/common';
import { UserDataService } from './userData.service';
import { UserDataController } from './userData.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Hr } from './entities/hr.entity';
import { InterviewModule } from '../interview/interview.module';
import { AuthModule } from 'src/auth/auth.module';
import { Interview } from '../interview/entities/interview.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from '../auth/schema/user.schema';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Hr, Interview]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => InterviewModule),
    forwardRef(() => AuthModule),
    forwardRef(() => MailModule),
  ],
  controllers: [UserDataController],
  providers: [UserDataService],
  exports: [UserDataService],
})
export class UserDataModule {}
