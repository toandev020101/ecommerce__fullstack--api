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
exports.ProductTag = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
const Tag_1 = require("./Tag");
let ProductTag = class ProductTag extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductTag.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductTag.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, (product) => product.productTags),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", Product_1.Product)
], ProductTag.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductTag.prototype, "tagId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tag_1.Tag, (tag) => tag.productTags),
    (0, typeorm_1.JoinColumn)({ name: 'tagId' }),
    __metadata("design:type", Tag_1.Tag)
], ProductTag.prototype, "tag", void 0);
ProductTag = __decorate([
    (0, typeorm_1.Entity)()
], ProductTag);
exports.ProductTag = ProductTag;
//# sourceMappingURL=ProductTag.js.map