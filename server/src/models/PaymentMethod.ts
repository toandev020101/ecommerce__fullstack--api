import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order';

@Entity()
export class PaymentMethod extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length: 100})
  name!: string;

  @Column()
  description!: string;

  @OneToMany(() => Order, (order) => order.paymentMethod)
  orders: Order[];
}
