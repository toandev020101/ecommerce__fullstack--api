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
exports.ShipMethod = void 0;
const typeorm_1 = require("typeorm");
const Order_1 = require("./Order");
let ShipMethod = class ShipMethod extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ShipMethod.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], ShipMethod.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ShipMethod.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '0: chưa xóa, 1: đã xóa' }),
    __metadata("design:type", Number)
], ShipMethod.prototype, "deleted", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Order_1.Order, (order) => order.shipMethod),
    __metadata("design:type", Array)
], ShipMethod.prototype, "orders", void 0);
ShipMethod = __decorate([
    (0, typeorm_1.Entity)()
], ShipMethod);
exports.ShipMethod = ShipMethod;
//# sourceMappingURL=ShipMethod.js.map