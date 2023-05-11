import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderLine } from './OrderLine';
import { User } from './User';
import { ReviewImage } from './ReviewImage';

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  orderLinedId!: number;
  @ManyToOne(() => OrderLine, (orderLine) => orderLine.reviews)
  @JoinColumn({ name: 'orderLinedId' })
  orderLine: OrderLine;

  @Column({ default: 0 })
  ratingValue!: number;

  @Column({ length: 350 })
  comment!: string;

  @Column({ default: 0, comment: '0: chưa duyệt, 1: đã duyệt' })
  status!: number;

  @Column({ default: 0, comment: '0: đánh giá, 1: phản hồi' })
  type!: number;

  @Column({ nullable: true })
  reviewId: number;

  @OneToOne(() => Review, (review) => review.reply)
  @JoinColumn({ name: 'reviewId' })
  review: Review;

  @OneToOne(() => Review, (reply) => reply.review)
  reply: Review;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ReviewImage, (reviewImage) => reviewImage.review)
  reviewImages: ReviewImage[];
}
