import { Hr } from 'src/userData/entities/hr.entity';
import { Student } from 'src/userData/entities/student.entity';

export class CreateInterviewDto {
  hr: Hr;
  student: Student;
}
