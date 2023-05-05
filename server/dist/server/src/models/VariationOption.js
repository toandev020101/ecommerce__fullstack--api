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
exports.VariationOption = void 0;
const typeorm_1 = require("typeorm");
const ProductConfiguration_1 = require("./ProductConfiguration");
const Variation_1 = require("./Variation");
let VariationOption = class VariationOption extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VariationOption.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 65 }),
    __metadata("design:type", String)
], VariationOption.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 65 }),
    __metadata("design:type", String)
], VariationOption.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VariationOption.prototype, "variationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Variation_1.Variation, (variation) => variation.variationOptions),
    (0, typeorm_1.JoinColumn)({ name: 'variationId' }),
    __metadata("design:type", Variation_1.Variation)
], VariationOption.prototype, "variation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductConfiguration_1.ProductConfiguration, (productConfiguration) => productConfiguration.variationOption),
    __metadata("design:type", Array)
], VariationOption.prototype, "productConfigurations", void 0);
VariationOption = __decorate([
    (0, typeorm_1.Entity)()
], VariationOption);
exports.VariationOption = VariationOption;
//# sourceMappingURL=VariationOption.js.map