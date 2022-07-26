import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Hr } from './hr.entity';
import { Student } from './student.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idUser: string;

  @Column({
    length: 50,
  })
  firstName: string;

  @Column({
    length: 100,
  })
  lastName: string;

  @OneToOne((type) => Student)
  @JoinColumn()
  infoStudent: Student;

  @OneToOne((type) => Hr)
  @JoinColumn()
  infoHR: Hr;
}
