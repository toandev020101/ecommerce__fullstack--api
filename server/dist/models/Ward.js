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
exports.Ward = void 0;
const typeorm_1 = require("typeorm");
const District_1 = require("./District");
const Order_1 = require("./Order");
const User_1 = require("./User");
let Ward = class Ward extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Ward.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 65 }),
    __metadata("design:type", String)
], Ward.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Ward.prototype, "districtId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => District_1.District, (district) => district.wards),
    (0, typeorm_1.JoinColumn)({ name: 'districtId' }),
    __metadata("design:type", District_1.District)
], Ward.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User_1.User, (user) => user.ward),
    __metadata("design:type", Array)
], Ward.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Order_1.Order, (order) => order.ward),
    __metadata("design:type", Array)
], Ward.prototype, "orders", void 0);
Ward = __decorate([
    (0, typeorm_1.Entity)()
], Ward);
exports.Ward = Ward;
//# sourceMappingURL=Ward.js.map