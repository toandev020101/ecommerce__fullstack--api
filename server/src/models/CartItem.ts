import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductItem } from './ProductItem';
import { User } from './User';

@Entity()
export class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @Column()
  userId!: number;
  @ManyToOne(() => User, (user) => user.cartItems)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  productItemId!: number;
  @ManyToOne(() => ProductItem, (productItem) => productItem.cartItems)
  @JoinColumn({ name: 'productItemId' })
  productItem: ProductItem;
}
