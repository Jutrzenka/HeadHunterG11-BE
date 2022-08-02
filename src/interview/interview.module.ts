import { forwardRef, Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { UserDataModule } from '../userData/userData.module';

@Module({
  imports: [forwardRef(() => UserDataModule)],
  controllers: [],
  providers: [InterviewService],
  exports: [InterviewService],
})
export class InterviewModule {}
