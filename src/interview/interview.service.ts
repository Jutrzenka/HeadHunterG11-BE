import { Injectable } from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Interview } from './entities/interview.entity';

@Injectable()
export class InterviewService {
  create(createInterviewDto: CreateInterviewDto) {
    return 'This action adds a new interview';
  }

  findAll() {
    return `This action returns all interview`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interview`;
  }

  update(id: number, updateInterviewDto: UpdateInterviewDto) {
    return `This action updates a #${id} interview`;
  }

  async deleteInterview(id: string) {
    return await Interview.delete({ id: id });
  }
}
