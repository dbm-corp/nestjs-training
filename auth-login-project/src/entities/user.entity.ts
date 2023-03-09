import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import BaseEntity from './base.entity';
import { Report } from './report.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  refreshToken: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
