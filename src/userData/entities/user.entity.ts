import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Hr } from './hr.entity';
import { Student } from './student.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({
    length: 36,
    primary: true,
    nullable: false,
    unique: true,
  })
  idUser: string;

  @Column({
    length: 50,
    nullable: false,
  })
  firstName: string;

  @Column({
    length: 100,
    nullable: false,
  })
  lastName: string;

  @OneToOne(() => Student)
  @JoinColumn()
  infoStudent: Student;

  @OneToOne(() => Hr)
  @JoinColumn()
  infoHR: Hr;
}
