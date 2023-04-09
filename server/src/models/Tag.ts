import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductTag } from './ProductTag';

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 65 })
  name!: string;

  @Column({ length: 65 })
  slug!: string;

  @OneToMany(() => ProductTag, (productTag) => productTag.tag)
  productTags: ProductTag[];
}
