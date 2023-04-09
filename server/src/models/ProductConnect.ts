import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product';

@Entity()
export class ProductConnect extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productId!: number;
  @ManyToOne(() => Product, (product) => product.productConnects)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  connectId!: number;
  @ManyToOne(() => Product, (connect) => connect.connects)
  @JoinColumn({ name: 'connectId' })
  connect: Product;
}
