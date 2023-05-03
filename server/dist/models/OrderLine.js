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
exports.OrderLine = void 0;
const typeorm_1 = require("typeorm");
const Order_1 = require("./Order");
const ProductItem_1 = require("./ProductItem");
const Review_1 = require("./Review");
let OrderLine = class OrderLine extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrderLine.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderLine.prototype, "variation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderLine.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderLine.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderLine.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order_1.Order, (order) => order.orderLines),
    (0, typeorm_1.JoinColumn)({ name: 'orderId' }),
    __metadata("design:type", Order_1.Order)
], OrderLine.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderLine.prototype, "productItemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProductItem_1.ProductItem, (productItem) => productItem.orderLines),
    (0, typeorm_1.JoinColumn)({ name: 'productItemId' }),
    __metadata("design:type", ProductItem_1.ProductItem)
], OrderLine.prototype, "productItem", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Review_1.Review, (review) => review.orderLine),
    __metadata("design:type", Array)
], OrderLine.prototype, "reviews", void 0);
OrderLine = __decorate([
    (0, typeorm_1.Entity)()
], OrderLine);
exports.OrderLine = OrderLine;
//# sourceMappingURL=OrderLine.js.map