"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReviewImage_1 = require("./models/ReviewImage");
const typeorm_1 = require("typeorm");
const CartItem_1 = require("./models/CartItem");
const Category_1 = require("./models/Category");
const Coupon_1 = require("./models/Coupon");
const District_1 = require("./models/District");
const Inventory_1 = require("./models/Inventory");
const Media_1 = require("./models/Media");
const Order_1 = require("./models/Order");
const OrderCoupon_1 = require("./models/OrderCoupon");
const OrderLine_1 = require("./models/OrderLine");
const Permission_1 = require("./models/Permission");
const Product_1 = require("./models/Product");
const ProductConfiguration_1 = require("./models/ProductConfiguration");
const ProductConnect_1 = require("./models/ProductConnect");
const ProductImage_1 = require("./models/ProductImage");
const ProductItem_1 = require("./models/ProductItem");
const ProductTag_1 = require("./models/ProductTag");
const Province_1 = require("./models/Province");
const Review_1 = require("./models/Review");
const Role_1 = require("./models/Role");
const RolePermission_1 = require("./models/RolePermission");
const Tag_1 = require("./models/Tag");
const User_1 = require("./models/User");
const Variation_1 = require("./models/Variation");
const VariationCategory_1 = require("./models/VariationCategory");
const VariationOption_1 = require("./models/VariationOption");
const Ward_1 = require("./models/Ward");
const OrderStatus_1 = require("./models/OrderStatus");
const ShipMethod_1 = require("./models/ShipMethod");
const PaymentMethod_1 = require("./models/PaymentMethod");
const AppDataSource = new typeorm_1.DataSource({
    type: (process.env.DB_TYPE || 'mysql'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecomshop',
    synchronize: true,
    logging: false,
    entities: [
        User_1.User,
        Role_1.Role,
        Permission_1.Permission,
        RolePermission_1.RolePermission,
        Media_1.Media,
        CartItem_1.CartItem,
        Category_1.Category,
        Ward_1.Ward,
        Coupon_1.Coupon,
        District_1.District,
        Inventory_1.Inventory,
        Order_1.Order,
        OrderCoupon_1.OrderCoupon,
        OrderLine_1.OrderLine,
        OrderStatus_1.OrderStatus,
        ShipMethod_1.ShipMethod,
        PaymentMethod_1.PaymentMethod,
        Product_1.Product,
        ProductConfiguration_1.ProductConfiguration,
        ProductItem_1.ProductItem,
        ProductConnect_1.ProductConnect,
        ProductImage_1.ProductImage,
        Tag_1.Tag,
        ProductTag_1.ProductTag,
        Province_1.Province,
        Review_1.Review,
        ReviewImage_1.ReviewImage,
        Variation_1.Variation,
        VariationOption_1.VariationOption,
        VariationCategory_1.VariationCategory,
    ],
});
exports.default = AppDataSource;
//# sourceMappingURL=AppDataSource.js.map