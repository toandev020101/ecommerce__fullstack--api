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
var Review_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const typeorm_1 = require("typeorm");
const OrderLine_1 = require("./OrderLine");
const User_1 = require("./User");
const ReviewImage_1 = require("./ReviewImage");
let Review = Review_1 = class Review extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Review.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Review.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.reviews),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], Review.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Review.prototype, "orderLinedId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => OrderLine_1.OrderLine, (orderLine) => orderLine.reviews),
    (0, typeorm_1.JoinColumn)({ name: 'orderLinedId' }),
    __metadata("design:type", OrderLine_1.OrderLine)
], Review.prototype, "orderLine", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Review.prototype, "ratingValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 350 }),
    __metadata("design:type", String)
], Review.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '0: chưa duyệt, 1: đã duyệt' }),
    __metadata("design:type", Number)
], Review.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: '0: đánh giá, 1: phản hồi' }),
    __metadata("design:type", Number)
], Review.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Review.prototype, "reviewId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Review_1, (review) => review.reply),
    (0, typeorm_1.JoinColumn)({ name: 'reviewId' }),
    __metadata("design:type", Review)
], Review.prototype, "review", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Review_1, (reply) => reply.review),
    __metadata("design:type", Review)
], Review.prototype, "reply", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Review.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Review.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReviewImage_1.ReviewImage, (reviewImage) => reviewImage.review),
    __metadata("design:type", Array)
], Review.prototype, "reviewImages", void 0);
Review = Review_1 = __decorate([
    (0, typeorm_1.Entity)()
], Review);
exports.Review = Review;
//# sourceMappingURL=Review.js.map