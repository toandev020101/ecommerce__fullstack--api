"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductItem = void 0;
const typeorm_1 = require("typeorm");
const CartItem_1 = require("./CartItem");
const OrderLine_1 = require("./OrderLine");
const Product_1 = require("./Product");
const ProductConfiguration_1 = require("./ProductConfiguration");
const Inventory_1 = require("./Inventory");
const ProductImage_1 = require("./ProductImage");
let ProductItem = class ProductItem extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductItem.prototype, "SKU", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductItem.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ProductItem.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ProductItem.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ProductItem.prototype, "discountStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ProductItem.prototype, "discountEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '0: chưa xóa, 1: đã xóa' }),
    __metadata("design:type", Number)
], ProductItem.prototype, "deleted", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductItem.prototype, "inventoryId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Inventory_1.Inventory),
    (0, typeorm_1.JoinColumn)({ name: 'inventoryId' }),
    __metadata("design:type", Inventory_1.Inventory)
], ProductItem.prototype, "inventory", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, (product) => product.productItems),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", Product_1.Product)
], ProductItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductImage_1.ProductImage, (productImage) => productImage.productItem),
    __metadata("design:type", Array)
], ProductItem.prototype, "productImages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductConfiguration_1.ProductConfiguration, (productConfiguration) => productConfiguration.productItem),
    __metadata("design:type", Array)
], ProductItem.prototype, "productConfigurations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CartItem_1.CartItem, (cartItem) => cartItem.productItem),
    __metadata("design:type", Array)
], ProductItem.prototype, "cartItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderLine_1.OrderLine, (orderLine) => orderLine.productItem),
    __metadata("design:type", Array)
], ProductItem.prototype, "orderLines", void 0);
ProductItem = __decorate([
    (0, typeorm_1.Entity)()
], ProductItem);
exports.ProductItem = ProductItem;
//# sourceMappingURL=ProductItem.js.map