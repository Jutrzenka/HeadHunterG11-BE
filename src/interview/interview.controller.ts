import { Controller } from '@nestjs/common';
import { InterviewService } from './interview.service';

@Controller('/api')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}
}
