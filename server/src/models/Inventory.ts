import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Inventory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'tinyint', default: 0 })
  quantity!: number;

  @Column({ default: 0 })
  priceEntry!: number;

  @Column({ length: 65 })
  locationCode!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
