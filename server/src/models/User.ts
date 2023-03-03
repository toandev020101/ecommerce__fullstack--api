import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './Role';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 20 })
  firstName!: string;

  @Column({ length: 20 })
  lastName!: string;

  @Column({ unique: true, length: 45 })
  username!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 0, comment: '0: nam, 1: nữ', type: 'tinyint' })
  gender: number;

  @Column({ unique: true, length: 65, nullable: true })
  email: string;

  @Column({ length: 15, nullable: true })
  phoneNumber: string;

  @Column({ default: 1, comment: '0: bị khóa, 1: đang hoạt động' })
  isActive: boolean;

  @Column({ default: 0 })
  tokenVersion: number;

  @Column()
  roleId!: number;
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
