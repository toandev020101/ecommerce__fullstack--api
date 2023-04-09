import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order';
import { Province } from './Province';
import { User } from './User';
import { Ward } from './Ward';

@Entity()
export class District extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 65 })
  name!: string;

  @Column()
  provinceId!: number;
  @ManyToOne(() => Province, (province) => province.districts)
  @JoinColumn({ name: 'provinceId' })
  province: Province;

  @OneToMany(() => Ward, (ward) => ward.district)
  wards: Ward[];

  @OneToMany(() => User, (user) => user.district)
  users: User[];

  @OneToMany(() => Order, (order) => order.district)
  orders: Order[];
}
