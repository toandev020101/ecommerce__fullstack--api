import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order';

@Entity()
export class ShipMethod extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length: 100})
  name!: string;

  @Column()
  price: number;

  @OneToMany(() => Order, (order) => order.shipMethod)
  orders: Order[];
}
