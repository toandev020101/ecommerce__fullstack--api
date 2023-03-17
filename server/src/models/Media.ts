import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fileUrl!: string;

  @Column()
  name!: string;

  @Column({ length: 45 })
  mimetype!: string;

  @Column({ length: 45 })
  size!: string;

  @Column({ type: 'tinyint', comment: '0: hình ảnh, 1: video' })
  type!: number;

  @Column()
  path!: string;

  @Column()
  userId!: number;
  @ManyToOne(() => User, (user) => user.medias)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt!: Date;
}
