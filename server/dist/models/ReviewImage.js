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
exports.ReviewImage = void 0;
const typeorm_1 = require("typeorm");
const Review_1 = require("./Review");
let ReviewImage = class ReviewImage extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReviewImage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReviewImage.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReviewImage.prototype, "reviewId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Review_1.Review, (review) => review.reviewImages),
    (0, typeorm_1.JoinColumn)({ name: 'reviewId' }),
    __metadata("design:type", Review_1.Review)
], ReviewImage.prototype, "review", void 0);
ReviewImage = __decorate([
    (0, typeorm_1.Entity)()
], ReviewImage);
exports.ReviewImage = ReviewImage;
//# sourceMappingURL=ReviewImage.js.map