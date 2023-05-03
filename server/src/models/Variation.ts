import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VariationOption } from './VariationOption';
import { VariationCategory } from './VariationCategory';

@Entity()
export class Variation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 65 })
  name!: string;

  @Column({ length: 65 })
  slug!: string;

  @OneToMany(() => VariationOption, (variationOption) => variationOption.variation)
  variationOptions: VariationOption[];

  @OneToMany(() => VariationCategory, (variationCategory) => variationCategory.variation)
  variationCategories: VariationCategory[];
}
