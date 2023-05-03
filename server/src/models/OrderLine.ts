import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order';
import { ProductItem } from './ProductItem';
import { Review } from './Review';

@Entity()
export class OrderLine extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  variation!: string;

  @Column()
  quantity!: number;

  @Column()
  price!: number;

  @Column()
  orderId!: number;
  @ManyToOne(() => Order, (order) => order.orderLines)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  productItemId!: number;
  @ManyToOne(() => ProductItem, (productItem) => productItem.orderLines)
  @JoinColumn({ name: 'productItemId' })
  productItem: ProductItem;

  @OneToMany(() => Review, (review) => review.orderLine)
  reviews: Review[];
}
