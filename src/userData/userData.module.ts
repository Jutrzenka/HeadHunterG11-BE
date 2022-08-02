import { forwardRef, Module } from '@nestjs/common';
import { UserDataService } from './userData.service';
import { UserDataController } from './userData.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Student } from './entities/student.entity';
import { Hr } from './entities/hr.entity';
import { InterviewModule } from '../interview/interview.module';
import { AuthModule } from 'src/auth/auth.module';
import { Interview } from '../interview/entities/interview.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, Hr, Interview]),
    forwardRef(() => InterviewModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserDataController],
  providers: [UserDataService],
  exports: [UserDataService],
})
export class UserDataModule {}
