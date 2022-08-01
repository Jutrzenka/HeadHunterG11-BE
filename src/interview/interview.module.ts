import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';

@Module({
  controllers: [],
  providers: [InterviewService],
})
export class InterviewModule {}
