import { Interview } from 'src/interview/entities/interview.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status, TypeWork, ContractType } from '../../Utils/types/export';

@Entity()
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
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
