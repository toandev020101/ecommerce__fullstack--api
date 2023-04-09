import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Coupon } from './Coupon';
import { Order } from './Order';

@Entity()
export class OrderCoupon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  orderId!: number;
  @ManyToOne(() => Order, (order) => order.orderCoupons)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  couponId!: number;
  @ManyToOne(() => Coupon, (coupon) => coupon.orderCoupons)
  @JoinColumn({ name: 'couponId' })
  coupon: Coupon;
}
