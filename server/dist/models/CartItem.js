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
exports.CartItem = void 0;
const typeorm_1 = require("typeorm");
const Cart_1 = require("./Cart");
const ProductItem_1 = require("./ProductItem");
let CartItem = class CartItem extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CartItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CartItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CartItem.prototype, "cartId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cart_1.Cart, (cart) => cart.cartItems),
    (0, typeorm_1.JoinColumn)({ name: 'cartId' }),
    __metadata("design:type", Cart_1.Cart)
], CartItem.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CartItem.prototype, "productItemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProductItem_1.ProductItem, (productItem) => productItem.cartItems),
    (0, typeorm_1.JoinColumn)({ name: 'productItemId' }),
    __metadata("design:type", ProductItem_1.ProductItem)
], CartItem.prototype, "productItem", void 0);
CartItem = __decorate([
    (0, typeorm_1.Entity)()
], CartItem);
exports.CartItem = CartItem;
//# sourceMappingURL=CartItem.js.map