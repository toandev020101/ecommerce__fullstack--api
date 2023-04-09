import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { District } from './District';
import { Order } from './Order';
import { User } from './User';

@Entity()
export class Province extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 65 })
  name!: string;

  @OneToMany(() => District, (district) => district.province)
  districts: District[];

  @OneToMany(() => User, (user) => user.province)
  users: User[];

  @OneToMany(() => Order, (order) => order.province)
  orders: Order[];
}
