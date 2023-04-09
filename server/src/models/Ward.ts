import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { District } from './District';
import { Order } from './Order';
import { User } from './User';

@Entity()
export class Ward extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 65 })
  name!: string;

  @Column()
  districtId!: number;
  @ManyToOne(() => District, (district) => district.wards)
  @JoinColumn({ name: 'districtId' })
  district: District;

  @OneToMany(() => User, (user) => user.ward)
  users: User[];

  @OneToMany(() => Order, (order) => order.ward)
  orders: Order[];
}
