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
exports.OrderCoupon = void 0;
const typeorm_1 = require("typeorm");
const Coupon_1 = require("./Coupon");
const Order_1 = require("./Order");
let OrderCoupon = class OrderCoupon extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrderCoupon.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderCoupon.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order_1.Order, (order) => order.orderCoupons),
    (0, typeorm_1.JoinColumn)({ name: 'orderId' }),
    __metadata("design:type", Order_1.Order)
], OrderCoupon.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderCoupon.prototype, "couponId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Coupon_1.Coupon, (coupon) => coupon.orderCoupons),
    (0, typeorm_1.JoinColumn)({ name: 'couponId' }),
    __metadata("design:type", Coupon_1.Coupon)
], OrderCoupon.prototype, "coupon", void 0);
OrderCoupon = __decorate([
    (0, typeorm_1.Entity)()
], OrderCoupon);
exports.OrderCoupon = OrderCoupon;
//# sourceMappingURL=OrderCoupon.js.map