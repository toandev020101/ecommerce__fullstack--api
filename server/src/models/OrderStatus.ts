import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order';

@Entity()
export class OrderStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ default: 0, comment: '0: không phải đơn vị giao hàng, 1: đơn vị giao hàng' })
  isShip!: number;

  @OneToMany(() => Order, (order) => order.orderStatus)
  orders: Order[];
}
