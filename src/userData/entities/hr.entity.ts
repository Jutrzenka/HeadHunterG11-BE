import { Interview } from 'src/interview/entities/interview.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Hr extends BaseEntity {
  @PrimaryColumn({
    length: 36,
    primary: true,
    nullable: false,
    unique: true,
  })
  id: string;

  @Column({
    length: 150,
  })
  fullName: string;

  @Column()
  company: string;

  @Column()
  reservedStudents: number;

  @OneToMany((type) => Interview, (entity) => entity.hr)
  interviews: Interview[];
}
