import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './Product';
import { Tag } from './Tag';

@Entity()
export class ProductTag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productId!: number;
  @ManyToOne(() => Product, (product) => product.productTags)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  tagId!: number;
  @ManyToOne(() => Tag, (tag) => tag.productTags)
  @JoinColumn({ name: 'tagId' })
  tag: Tag;
}
