import { Interview } from 'src/interview/entities/interview.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Hr extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company: string;

  @Column()
  reservedStudents: number;

  @OneToMany((type) => Interview, (entity) => entity.hr)
  interviews: Interview[];
}
