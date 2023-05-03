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
exports.ProductConfiguration = void 0;
const typeorm_1 = require("typeorm");
const ProductItem_1 = require("./ProductItem");
const VariationOption_1 = require("./VariationOption");
let ProductConfiguration = class ProductConfiguration extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductConfiguration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductConfiguration.prototype, "productItemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProductItem_1.ProductItem, (productItem) => productItem.productConfigurations),
    (0, typeorm_1.JoinColumn)({ name: 'productItemId' }),
    __metadata("design:type", ProductItem_1.ProductItem)
], ProductConfiguration.prototype, "productItem", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductConfiguration.prototype, "variationOptionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => VariationOption_1.VariationOption, (variationOption) => variationOption.productConfigurations),
    (0, typeorm_1.JoinColumn)({ name: 'variationOptionId' }),
    __metadata("design:type", VariationOption_1.VariationOption)
], ProductConfiguration.prototype, "variationOption", void 0);
ProductConfiguration = __decorate([
    (0, typeorm_1.Entity)()
], ProductConfiguration);
exports.ProductConfiguration = ProductConfiguration;
//# sourceMappingURL=CartItemConfiguration.js.map