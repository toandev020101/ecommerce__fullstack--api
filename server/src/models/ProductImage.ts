import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductItem } from './ProductItem';

@Entity()
export class ProductImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  imageUrl!: string;

  @Column()
  productItemId!: number;
  @ManyToOne(() => ProductItem, (productItem) => productItem.productImages)
  @JoinColumn({ name: 'productItemId' })
  productItem: ProductItem;
}
