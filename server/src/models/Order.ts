import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { District } from './District';
import { OrderCoupon } from './OrderCoupon';
import { OrderLine } from './OrderLine';
import { Province } from './Province';
import { User } from './User';
import { Ward } from './Ward';
import { OrderStatus } from './OrderStatus';
import { ShipMethod } from './ShipMethod';
import { PaymentMethod } from './PaymentMethod';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 45 })
  fullName!: string;

  @Column({ length: 15 })
  phoneNumber!: string;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.order)
  orderLines: OrderLine[];

  @OneToMany(() => OrderCoupon, (orderCoupon) => orderCoupon.order)
  orderCoupons: OrderCoupon[];

  @Column()
  totalQuantity!: number;

  @Column()
  totalPrice!: number;

  @Column()
  street!: string;

  @Column()
  wardId!: number;
  @ManyToOne(() => Ward, (ward) => ward.orders)
  @JoinColumn({ name: 'wardId' })
  ward: Ward;

  @Column()
  districtId!: number;
  @ManyToOne(() => District, (district) => district.orders)
  @JoinColumn({ name: 'districtId' })
  district: District;

  @Column()
  provinceId!: number;
  @ManyToOne(() => Province, (province) => province.orders)
  @JoinColumn({ name: 'provinceId' })
  province: Province;

  @Column({ nullable: true, length: 300 })
  note: string;

  @Column()
  orderStatusId!: number;
  @ManyToOne(() => OrderStatus, (orderStatus) => orderStatus.orders)
  @JoinColumn({ name: 'orderStatusId' })
  orderStatus: OrderStatus;

  @Column()
  shipMethodId!: number;
  @ManyToOne(() => ShipMethod, (shipMethod) => shipMethod.orders)
  @JoinColumn({ name: 'shipMethodId' })
  shipMethod: ShipMethod;

  @Column()
  paymentMethodId!: number;
  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.orders)
  @JoinColumn({ name: 'paymentMethodId' })
  paymentMethod: PaymentMethod;

  @Column()
  userId!: number;
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
