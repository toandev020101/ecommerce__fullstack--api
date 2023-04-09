import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderLine } from './OrderLine';
import { User } from './User';

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  orderedProductId!: number;
  @ManyToOne(() => OrderLine, (orderLine) => orderLine.reviews)
  @JoinColumn({ name: 'orderedProductId' })
  orderLine: OrderLine;

  @Column()
  ratingValue!: number;

  @Column({ length: 350 })
  comment!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
