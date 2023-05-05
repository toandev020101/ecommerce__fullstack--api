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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const District_1 = require("./District");
const OrderCoupon_1 = require("./OrderCoupon");
const OrderLine_1 = require("./OrderLine");
const Province_1 = require("./Province");
const User_1 = require("./User");
const Ward_1 = require("./Ward");
const OrderStatus_1 = require("./OrderStatus");
const ShipMethod_1 = require("./ShipMethod");
const PaymentMethod_1 = require("./PaymentMethod");
let Order = class Order extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 45 }),
    __metadata("design:type", String)
], Order.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15 }),
    __metadata("design:type", String)
], Order.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderLine_1.OrderLine, (orderLine) => orderLine.order),
    __metadata("design:type", Array)
], Order.prototype, "orderLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderCoupon_1.OrderCoupon, (orderCoupon) => orderCoupon.order),
    __metadata("design:type", Array)
], Order.prototype, "orderCoupons", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "totalQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "street", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "wardId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Ward_1.Ward, (ward) => ward.orders),
    (0, typeorm_1.JoinColumn)({ name: 'wardId' }),
    __metadata("design:type", Ward_1.Ward)
], Order.prototype, "ward", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "districtId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => District_1.District, (district) => district.orders),
    (0, typeorm_1.JoinColumn)({ name: 'districtId' }),
    __metadata("design:type", District_1.District)
], Order.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "provinceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Province_1.Province, (province) => province.orders),
    (0, typeorm_1.JoinColumn)({ name: 'provinceId' }),
    __metadata("design:type", Province_1.Province)
], Order.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 300 }),
    __metadata("design:type", String)
], Order.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "orderStatusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => OrderStatus_1.OrderStatus, (orderStatus) => orderStatus.orders),
    (0, typeorm_1.JoinColumn)({ name: 'orderStatusId' }),
    __metadata("design:type", OrderStatus_1.OrderStatus)
], Order.prototype, "orderStatus", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "shipMethodId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ShipMethod_1.ShipMethod, (shipMethod) => shipMethod.orders),
    (0, typeorm_1.JoinColumn)({ name: 'shipMethodId' }),
    __metadata("design:type", ShipMethod_1.ShipMethod)
], Order.prototype, "shipMethod", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "paymentMethodId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PaymentMethod_1.PaymentMethod, (paymentMethod) => paymentMethod.orders),
    (0, typeorm_1.JoinColumn)({ name: 'paymentMethodId' }),
    __metadata("design:type", PaymentMethod_1.PaymentMethod)
], Order.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.orders),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
Order = __decorate([
    (0, typeorm_1.Entity)()
], Order);
exports.Order = Order;
//# sourceMappingURL=Order.js.map