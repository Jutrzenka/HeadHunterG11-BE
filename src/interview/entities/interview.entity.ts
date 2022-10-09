import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hr } from '../../userData/entities/hr.entity';
<<<<<<< HEAD
import { Student } from '../../userData/entities/student.entity';
=======
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950

@Entity()
export class Interview extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => Hr, (entity) => entity.interviews)
  @JoinColumn()
  hr: Hr;

  @ManyToOne((type) => Student, (entity) => entity.interviews)
  @JoinColumn()
  student: Student;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
