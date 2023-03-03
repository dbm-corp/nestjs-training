import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import BaseEntity from './base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;
}
