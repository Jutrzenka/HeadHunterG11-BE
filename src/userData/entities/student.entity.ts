import { Interview } from 'src/interview/entities/interview.entity';
import { v4 as uuid } from 'uuid';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Status, TypeWork, ContractType } from '../../Utils/types/export';

@Entity()
export class Student extends BaseEntity {
  @PrimaryColumn({
    length: 36,
    primary: true,
    nullable: false,
    unique: true,
    default: uuid(),
  })
  id: string;

  @Column({
    length: 36,
    nullable: false,
  })
  idUser: string;

  @Column({
    nullable: true,
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

  @Column()
  bonusProjectUrls: string;

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
    nullable: true,
    default: null,
  })
  portfolioUrls: string;

  @Column()
  projectUrls: string;

  @Column()
  bio: string;

  @Column({
    default: TypeWork.None,
  })
  expectedTypeWork: TypeWork;

  @Column({
    length: 40,
  })
  targetWorkCity: string;

  @Column({
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

  @OneToOne((type) => Interview)
  @JoinColumn()
  interview: Interview;
}
