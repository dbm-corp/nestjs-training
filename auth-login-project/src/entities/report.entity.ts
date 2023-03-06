import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from './base.entity';
import { User } from './user.entity';

@Entity()
export class Report extends BaseEntity {
  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
