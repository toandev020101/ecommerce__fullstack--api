import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductItem } from './ProductItem';
import { VariationOption } from './VariationOption';

@Entity()
export class ProductConfiguration extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productItemId!: number;
  @ManyToOne(() => ProductItem, (productItem) => productItem.productConfigurations)
  @JoinColumn({ name: 'productItemId' })
  productItem: ProductItem;

  @Column()
  variationOptionId!: number;
  @ManyToOne(() => VariationOption, (variationOption) => variationOption.productConfigurations)
  @JoinColumn({ name: 'variationOptionId' })
  variationOption: VariationOption;
}
