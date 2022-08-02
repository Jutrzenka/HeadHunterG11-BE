import { Interview } from 'src/interview/entities/interview.entity';
import { v4 as uuid } from 'uuid';
import {BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Hr extends BaseEntity {
  // @PrimaryColumn({
  //   length: 36,
  //   primary: true,
  //   nullable: false,
  //   unique: true,
  //   default: uuid(),
  // })
  // id: string;
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({
  //   length: 36,
  //   nullable: false,
  // })
  // idUser: string;

  @Column()
  company: string;

  @Column()
  reservedStudents: number;

  @OneToMany((type) => Interview, (entity) => entity.hr)
  interviews: Interview[];
}
