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
exports.Province = void 0;
const typeorm_1 = require("typeorm");
const District_1 = require("./District");
const Order_1 = require("./Order");
const User_1 = require("./User");
let Province = class Province extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Province.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 65 }),
    __metadata("design:type", String)
], Province.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => District_1.District, (district) => district.province),
    __metadata("design:type", Array)
], Province.prototype, "districts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User_1.User, (user) => user.province),
    __metadata("design:type", Array)
], Province.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Order_1.Order, (order) => order.province),
    __metadata("design:type", Array)
], Province.prototype, "orders", void 0);
Province = __decorate([
    (0, typeorm_1.Entity)()
], Province);
exports.Province = Province;
//# sourceMappingURL=Province.js.map