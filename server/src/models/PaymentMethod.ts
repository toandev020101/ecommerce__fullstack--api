import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order';

@Entity()
export class PaymentMethod extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column()
  description!: string;

  @Column({ default: 0, comment: '0: chưa xóa, 1: đã xóa' })
  deleted: number;

  @OneToMany(() => Order, (order) => order.paymentMethod)
  orders: Order[];
}
