import { DataSource } from 'typeorm';
import { Cart } from './models/Cart';
import { CartItem } from './models/CartItem';
import { Category } from './models/Category';
import { Coupon } from './models/Coupon';
import { District } from './models/District';
import { Inventory } from './models/Inventory';
import { Media } from './models/Media';
import { Order } from './models/Order';
import { OrderCoupon } from './models/OrderCoupon';
import { OrderLine } from './models/OrderLine';
import { Permission } from './models/Permission';
import { Product } from './models/Product';
import { ProductConfiguration } from './models/ProductConfiguration';
import { ProductConnect } from './models/ProductConnect';
import { ProductItem } from './models/ProductItem';
import { ProductTag } from './models/ProductTag';
import { Province } from './models/Province';
import { Review } from './models/Review';
import { Role } from './models/Role';
import { RolePermission } from './models/RolePermission';
import { Tag } from './models/Tag';
import { User } from './models/User';
import { Variation } from './models/Variation';
import { VariationOption } from './models/VariationOption';
import { Ward } from './models/Ward';
import { ProductImage } from './models/ProductImage';

const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE || 'postgres') as any,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  synchronize: true,
  logging: false,
  entities: [
    User,
    Role,
    Permission,
    RolePermission,
    Media,
    Cart,
    CartItem,
    Category,
    Ward,
    Coupon,
    District,
    Inventory,
    Order,
    OrderCoupon,
    OrderLine,
    Product,
    ProductConfiguration,
    ProductItem,
    ProductConnect,
    ProductImage,
    Tag,
    ProductTag,
    Province,
    Review,
    Variation,
    VariationOption,
  ],
});

export default AppDataSource;
