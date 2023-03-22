import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './Permission';
import { Role } from './Role';

@Entity()
export class RolePermission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  roleId!: number;
  @ManyToOne(() => Role, (role) => role.rolePermissions)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column()
  permissionId!: number;
  @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;
}
