import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Variation } from './Variation';
import { Category } from './Category';

@Entity()
export class VariationCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  variationId!: number;
  @ManyToOne(() => Variation, (variation) => variation.variationCategories)
  @JoinColumn({ name: 'variationId' })
  variation: Variation;

  @Column()
  categoryId!: number;
  @ManyToOne(() => Category, (category) => category.variationCategories)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
