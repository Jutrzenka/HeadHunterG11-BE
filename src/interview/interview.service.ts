import { Injectable } from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { Interview } from './entities/interview.entity';

@Injectable()
export class InterviewService {
  async createInterview(createInterviewDto: CreateInterviewDto) {
    const newInterview = await new Interview();
    newInterview.hr = createInterviewDto.hr;
    newInterview.student = createInterviewDto.student;
    return newInterview.save();
  }

  async deleteInterview(id: string) {
    return await Interview.delete({ id: id });
  }
}
