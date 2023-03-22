import { DataSource } from 'typeorm';
import { Media } from './models/Media';
import { Permission } from './models/Permission';
import { Role } from './models/Role';
import { RolePermission } from './models/RolePermission';
import { User } from './models/User';

const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE || 'postgres') as any,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  synchronize: true,
  logging: false,
  entities: [User, Role, Permission, RolePermission, Media],
});

export default AppDataSource;
