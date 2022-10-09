import { type } from 'os';
import { Interview } from 'src/interview/entities/interview.entity';
<<<<<<< HEAD:src/userData/entities/student.entity.ts
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
=======
import { v4 as uuid } from 'uuid';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950:src/user/entities/student.entity.ts
import { Status, TypeWork, ContractType } from '../../Utils/types/export';

@Entity()
export class Student extends BaseEntity {
  @PrimaryColumn({
    length: 36,
    primary: true,
    nullable: false,
    unique: true,
<<<<<<< HEAD:src/userData/entities/student.entity.ts
=======
    default: uuid(),
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950:src/user/entities/student.entity.ts
  })
  id: string;

  @Column({
<<<<<<< HEAD:src/userData/entities/student.entity.ts
    type: 'enum',
    enum: Status,
    default: Status.Inactive,
=======
    length: 36,
    nullable: false,
  })
  idUser: string;

  @Column({
    nullable: true,
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950:src/user/entities/student.entity.ts
  })
  status: Status;

  @Column()
  courseCompletion: number;

  @Column()
  courseEngagement: number;

  @Column()
  projectDegree: number;

  @Column()
  teamProjectDegree: number;

  @Column({
    type: 'simple-array',
  })
  bonusProjectUrls: string[];

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

  @Column({
    nullable: true,
    default: null,
  })
  tel: number;

  @Column({
    length: 39,
  })
  githubUsername: string;

  @Column({
    type: 'simple-array',
    nullable: true,
    default: null,
  })
  portfolioUrls: string[];

  @Column({
    type: 'simple-array',
  })
  projectUrls: string[];

  @Column({
    length: 1000,
  })
  bio: string;

  @Column({
    type: 'enum',
    enum: TypeWork,
    default: TypeWork.None,
  })
  expectedTypeWork: TypeWork;

  @Column({
    length: 40,
  })
  targetWorkCity: string;

  @Column({
    type: 'enum',
    enum: ContractType,
    default: ContractType.None,
  })
  expectedContractType: ContractType;

  @Column({
    nullable: true,
    default: null,
    type: 'float',
    precision: 8,
    scale: 2,
  })
  expectedSalary: number;

  @Column({
    default: false,
  })
  canTakeApprenticeship: boolean;

  @Column({
    default: 0,
  })
  monthsOfCommercialExp: number;

  @Column()
  education: string;

  @Column({
    nullable: true,
    default: null,
  })
  workExperience: string;

  @Column({
    nullable: true,
    default: null,
  })
  courses: string;

  @OneToMany((type) => Interview, (entity) => entity.student)
  interviews: Interview[];
}
