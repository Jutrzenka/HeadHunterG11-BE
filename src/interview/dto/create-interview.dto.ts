import { Hr } from 'src/userData/entities/hr.entity';
import { Student } from 'src/userData/entities/student.entity';
import { ValidateNested } from 'class-validator';

export class CreateInterviewDto {
  @ValidateNested()
  hr: Hr;
  @ValidateNested()
  student: Student;
}
