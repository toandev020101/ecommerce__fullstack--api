import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  code!: string;

  @Column()
  price!: number;
}
