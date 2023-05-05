import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItem } from './CartItem';
import { OrderLine } from './OrderLine';
import { Product } from './Product';
import { ProductConfiguration } from './ProductConfiguration';
import { Inventory } from './Inventory';
import { ProductImage } from './ProductImage';

@Entity()
export class ProductItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  SKU!: string;

  @Column()
  imageUrl: string;

  @Column({ default: 0 })
  price!: number;

  @Column({ default: 0 })
  discount!: number;

  @Column({ nullable: true })
  discountStartDate: Date;

  @Column({ nullable: true })
  discountEndDate: Date;

  @Column({ default: 0, comment: '0: chưa xóa, 1: đã xóa' })
  deleted: number;

  @Column()
  inventoryId!: number;
  @OneToOne(() => Inventory)
  @JoinColumn({ name: 'inventoryId' })
  inventory: Inventory;

  @Column()
  productId!: number;
  @ManyToOne(() => Product, (product) => product.productItems)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @OneToMany(() => ProductImage, (productImage) => productImage.productItem)
  productImages: ProductImage[];

  @OneToMany(() => ProductConfiguration, (productConfiguration) => productConfiguration.productItem)
  productConfigurations: ProductConfiguration[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.productItem)
  cartItems: CartItem[];

  @OneToMany(() => OrderLine, (orderLine) => orderLine.productItem)
  orderLines: OrderLine[];
}
