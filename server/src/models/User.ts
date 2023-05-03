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
import { CartItem } from './CartItem';
import { District } from './District';
import { Media } from './Media';
import { Order } from './Order';
import { Province } from './Province';
import { Review } from './Review';
import { Role } from './Role';
import { Ward } from './Ward';
import { Coupon } from './Coupon';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 45 })
  fullName!: string;

  @Column({ unique: true, length: 45 })
  username!: string;

  @Column({ select: false })
  password!: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 0, comment: '0: nam, 1: nữ', type: 'tinyint' })
  gender: number;

  @Column({ unique: true, length: 65, nullable: true })
  email: string;

  @Column({ length: 15, nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  wardId: number;
  @ManyToOne(() => Ward, (ward) => ward.users)
  @JoinColumn({ name: 'wardId' })
  ward: Ward;

  @Column({ nullable: true })
  districtId: number;
  @ManyToOne(() => District, (district) => district.users)
  @JoinColumn({ name: 'districtId' })
  district: District;

  @Column({ nullable: true })
  provinceId: number;
  @ManyToOne(() => Province, (province) => province.users)
  @JoinColumn({ name: 'provinceId' })
  province: Province;

  @Column({ default: 1, comment: '0: bị khóa, 1: đang hoạt động', type: 'tinyint' })
  isActive: number;

  @Column({ default: 0 })
  tokenVersion: number;

  @OneToMany(() => Media, (media) => media.user)
  medias: Media[];

  @Column()
  roleId!: number;
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Coupon, (coupon) => coupon.user)
  coupons: Coupon[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
