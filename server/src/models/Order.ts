import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { District } from './District';
import { OrderCoupon } from './OrderCoupon';
import { OrderLine } from './OrderLine';
import { Province } from './Province';
import { User } from './User';
import { Ward } from './Ward';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.order)
  orderLines: OrderLine[];

  @Column({
    default: 0,
    comment:
      '0: Chờ thanh toán, 1: Đang xử lý, 2: Đã xử lý, 3: Chờ giao hàng, 4: Đang giao hàng, 5: Đã hoàn thành, 6: Đã hủy, 7: Đã hoàn tiền',
  })
  status!: number;

  @OneToMany(() => OrderCoupon, (orderCoupon) => orderCoupon.order)
  orderCoupons: OrderCoupon[];

  @Column()
  total_price!: number;

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
}
