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
exports.VariationCategory = void 0;
const typeorm_1 = require("typeorm");
const Variation_1 = require("./Variation");
const Category_1 = require("./Category");
let VariationCategory = class VariationCategory extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VariationCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VariationCategory.prototype, "variationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Variation_1.Variation, (variation) => variation.variationCategories),
    (0, typeorm_1.JoinColumn)({ name: 'variationId' }),
    __metadata("design:type", Variation_1.Variation)
], VariationCategory.prototype, "variation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VariationCategory.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category_1.Category, (category) => category.variationCategories),
    (0, typeorm_1.JoinColumn)({ name: 'categoryId' }),
    __metadata("design:type", Category_1.Category)
], VariationCategory.prototype, "category", void 0);
VariationCategory = __decorate([
    (0, typeorm_1.Entity)()
], VariationCategory);
exports.VariationCategory = VariationCategory;
//# sourceMappingURL=VariationCategory.js.map