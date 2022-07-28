import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hr } from '../../userData/entities/hr.entity';

@Entity()
export class Interview extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => Hr, (entity) => entity.interviews)
  @JoinColumn()
  hr: Hr;
}
