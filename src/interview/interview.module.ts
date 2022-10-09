import { forwardRef, Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { UserDataModule } from '../userData/userData.module';

@Module({
<<<<<<< HEAD
  imports: [forwardRef(() => UserDataModule)],
  controllers: [],
  providers: [InterviewService],
  exports: [InterviewService],
=======
  controllers: [InterviewController],
  providers: [InterviewService],
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950
})
export class InterviewModule {}
