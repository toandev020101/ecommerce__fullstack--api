import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './Review';

@Entity()
export class ReviewImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  imageUrl!: string;

  @Column()
  reviewId!: number;
  @ManyToOne(() => Review, (review) => review.reviewImages)
  @JoinColumn({ name: 'reviewId' })
  review: Review;
}
