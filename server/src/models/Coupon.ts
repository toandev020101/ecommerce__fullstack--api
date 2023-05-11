import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Coupon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 65 })
  name!: string;

  @Column({ nullable: true })
  priceMaxName: string;

  @Column()
  code!: string;

  @Column()
  discountValue!: number;

  @Column({ nullable: true })
  priceMax: number;

  @Column({ default: 0, type: 'tinyint', comment: '0: vnđ, 1: %' })
  type: number;

  @Column({ default: 0 })
  quantity!: number;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column()
  userId!: number;
  @ManyToOne(() => User, (user) => user.coupons)
  @JoinColumn({ name: 'userId' })
  user: User;
}
