import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './Category';
import { ProductConnect } from './ProductConnect';
import { ProductItem } from './ProductItem';
import { ProductTag } from './ProductTag';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  slug!: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  imageUrl!: string;

  @Column({ type: 'float', default: 0 })
  weight!: number;

  @Column({ default: 0 })
  length!: number;

  @Column({ default: 0 })
  width!: number;

  @Column({ default: 0 })
  height!: number;

  @Column({ default: 0 })
  isHot!: number;

  @Column({ default: 1 })
  isActive!: number;

  @Column({ default: 0, comment: '0: chưa xóa, 1: đã xóa' })
  deleted: number;

  @Column()
  categoryId!: number;
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => ProductItem, (productItem) => productItem.product)
  productItems: ProductItem[];

  @OneToMany(() => ProductTag, (productTag) => productTag.product)
  productTags: ProductTag[];

  @OneToMany(() => ProductConnect, (productConnect) => productConnect.product)
  productConnects: ProductConnect[];

  @OneToMany(() => ProductConnect, (productConnect) => productConnect.connect)
  connects: ProductConnect[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
