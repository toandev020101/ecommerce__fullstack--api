import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderCoupon } from './OrderCoupon';

@Entity()
export class Coupon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 65 })
  name!: string;

  @Column()
  description!: string;

  @Column()
  code!: string;

  @Column()
  discountValue!: number;

  @Column()
  quantity!: number;

  @Column({ nullable: true })
  priceMax: number;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @OneToMany(() => OrderCoupon, (orderCoupon) => orderCoupon.coupon)
  orderCoupons: OrderCoupon[];
}
