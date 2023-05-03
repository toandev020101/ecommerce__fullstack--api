import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product';
import { VariationCategory } from './VariationCategory';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100, unique: true })
  slug!: string;

  @Column({ default: 1, type: 'tinyint' })
  level!: number;

  @OneToMany(() => Category, (category) => category.parent)
  categories: Category[];

  @Column({ nullable: true })
  parentId: number;
  @ManyToOne(() => Category, (category) => category.categories)
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @Column({ default: 1, comment: '0: ẩn, 1: hiện', type: 'tinyint' })
  isActive!: number;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => VariationCategory, (variationCategory) => variationCategory.category)
  variationCategories: VariationCategory[];
}
