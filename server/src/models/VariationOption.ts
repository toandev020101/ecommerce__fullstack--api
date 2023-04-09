import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductConfiguration } from './ProductConfiguration';
import { Variation } from './Variation';

@Entity()
export class VariationOption extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 65 })
  value!: string;

  @Column({ length: 65 })
  slug!: string;

  @Column()
  variationId!: number;
  @ManyToOne(() => Variation, (variation) => variation.variationOptions)
  @JoinColumn({ name: 'variationId' })
  variation: Variation;

  @OneToMany(() => ProductConfiguration, (productConfiguration) => productConfiguration.variationOption)
  productConfigurations: ProductConfiguration[];
}
