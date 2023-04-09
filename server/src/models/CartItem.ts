import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './Cart';
import { ProductItem } from './ProductItem';

@Entity()
export class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @Column()
  cartId!: number;
  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @Column()
  productItemId!: number;
  @ManyToOne(() => ProductItem, (productItem) => productItem.cartItems)
  @JoinColumn({ name: 'productItemId' })
  productItem: ProductItem;
}
