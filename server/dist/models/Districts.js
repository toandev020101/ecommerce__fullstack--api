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
exports.District = void 0;
const typeorm_1 = require("typeorm");
const Order_1 = require("./Order");
const Province_1 = require("./Province");
const User_1 = require("./User");
const Ward_1 = require("./Ward");
let District = class District extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], District.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 65 }),
    __metadata("design:type", String)
], District.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], District.prototype, "provinceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Province_1.Province, (province) => province.districts),
    (0, typeorm_1.JoinColumn)({ name: 'provinceId' }),
    __metadata("design:type", Province_1.Province)
], District.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Ward_1.Ward, (ward) => ward.district),
    __metadata("design:type", Array)
], District.prototype, "wards", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User_1.User, (user) => user.district),
    __metadata("design:type", Array)
], District.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Order_1.Order, (order) => order.district),
    __metadata("design:type", Array)
], District.prototype, "orders", void 0);
District = __decorate([
    (0, typeorm_1.Entity)()
], District);
exports.District = District;
//# sourceMappingURL=Districts.js.map