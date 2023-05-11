"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOne = exports.removeAny = exports.changeStatus = exports.updateOne = exports.addOne = exports.getOneByOrderLinedId = exports.getOneById = exports.getListByProductId = exports.getPagination = exports.getPaginationByProductId = void 0;
const ReviewImage_1 = require("./../models/ReviewImage");
const Review_1 = require("./../models/Review");
const typeorm_1 = require("typeorm");
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const getPaginationByProductId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const { _limit, _page, _sort, _order, star, isImage, searchTerm } = req.query;
    let whereOptions = [
        {
            comment: (0, typeorm_1.Like)(`%${searchTerm}%`),
            orderLine: { productItem: { product: { id: productId } } },
            status: 1,
            type: 0,
        },
        {
            user: { fullName: (0, typeorm_1.Like)(`%${searchTerm}%`) },
            orderLine: { productItem: { product: { id: productId } } },
            status: 1,
            type: 0,
        },
        {
            user: { username: (0, typeorm_1.Like)(`%${searchTerm}%`) },
            orderLine: { productItem: { product: { id: productId } } },
            status: 1,
            type: 0,
        },
    ];
    if (star && parseInt(star) !== 0) {
        const newWhereOptions = [];
        whereOptions.forEach((whereOption) => {
            newWhereOptions.push(Object.assign(Object.assign({}, whereOption), { ratingValue: parseInt(star) }));
        });
        whereOptions = [...newWhereOptions];
    }
    if (isImage === 'true') {
        const newWhereOptions = [];
        whereOptions.forEach((whereOption) => {
            newWhereOptions.push(Object.assign(Object.assign({}, whereOption), { reviewImages: { id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } }));
        });
        whereOptions = [...newWhereOptions];
    }
    try {
        const reviewRes = yield Review_1.Review.findAndCount({
            where: whereOptions,
            skip: _page * _limit,
            take: _limit,
            order: { [_sort]: _order },
            relations: {
                user: true,
                orderLine: { productItem: { product: true } },
                reviewImages: true,
                reply: { user: { role: true } },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách đánh giá thành công',
            data: reviewRes[0],
            pagination: {
                _limit,
                _page,
                _total: reviewRes[1],
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Lỗi server :: ${error.message}`,
        });
    }
});
exports.getPaginationByProductId = getPaginationByProductId;
const getPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order, status, searchTerm } = req.query;
    try {
        const reviewRes = yield Review_1.Review.findAndCount({
            where: status !== ''
                ? [
                    { comment: (0, typeorm_1.Like)(`%${searchTerm}%`), status },
                    { user: { fullName: (0, typeorm_1.Like)(`%${searchTerm}%`) }, status },
                    { user: { username: (0, typeorm_1.Like)(`%${searchTerm}%`) }, status },
                ]
                : [
                    { comment: (0, typeorm_1.Like)(`%${searchTerm}%`) },
                    { user: { fullName: (0, typeorm_1.Like)(`%${searchTerm}%`) } },
                    { user: { username: (0, typeorm_1.Like)(`%${searchTerm}%`) } },
                ],
            skip: _page * _limit,
            take: _limit,
            order: { [_sort]: _order },
            relations: {
                user: true,
                orderLine: { productItem: { product: true } },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách đánh giá thành công',
            data: reviewRes[0],
            pagination: {
                _limit,
                _page,
                _total: reviewRes[1],
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Lỗi server :: ${error.message}`,
        });
    }
});
exports.getPagination = getPagination;
const getListByProductId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    try {
        const reviews = yield Review_1.Review.find({
            where: { orderLine: { productItem: { product: { id: productId } } }, status: 1, type: 0 },
            relations: {
                orderLine: { productItem: { product: true } },
                reviewImages: true,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách đánh giá thành công',
            data: reviews,
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Lỗi server :: ${error.message}`,
        });
    }
});
exports.getListByProductId = getListByProductId;
const getOneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const review = yield Review_1.Review.findOne({
            where: { id },
            relations: {
                orderLine: { productItem: { product: true } },
                reviewImages: true,
            },
        });
        if (!review) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Đánh giá không tồn tại!',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy đánh giá thành công',
            data: review,
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Lỗi server :: ${error.message}`,
        });
    }
});
exports.getOneById = getOneById;
const getOneByOrderLinedId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderLinedId } = req.params;
    try {
        const review = yield Review_1.Review.findOne({
            where: { orderLinedId },
            relations: {
                orderLine: { productItem: { product: true } },
                reviewImages: true,
            },
        });
        if (!review) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Đánh giá không tồn tại!',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy đánh giá thành công',
            data: review,
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Lỗi server :: ${error.message}`,
        });
    }
});
exports.getOneByOrderLinedId = getOneByOrderLinedId;
const addOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const userId = req.userId;
    try {
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const { images } = data, others = __rest(data, ["images"]);
            const insertedReview = yield transactionalEntityManager.insert(Review_1.Review, Object.assign(Object.assign({}, others), { userId }));
            const newReviewImages = [];
            images.forEach((image) => {
                newReviewImages.push({
                    imageUrl: image,
                    reviewId: insertedReview.raw.insertId,
                });
            });
            yield transactionalEntityManager.insert(ReviewImage_1.ReviewImage, newReviewImages);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: `Thêm ${data.type === 0 ? 'đánh giá' : 'phản hồi'} thành công`,
            data: null,
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Lỗi server :: ${error.message}`,
        });
    }
});
exports.addOne = addOne;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    try {
        const review = yield Review_1.Review.findOneBy({ id });
        if (!review) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: `${data.type === 0 ? 'Đánh giá' : 'Phản hồi'} không tồn tại`,
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const { images } = data, others = __rest(data, ["images"]);
            yield transactionalEntityManager.update(Review_1.Review, id, Object.assign({}, others));
            const newReviewImages = [];
            images.forEach((image) => {
                newReviewImages.push({
                    imageUrl: image,
                    reviewId: id,
                });
            });
            yield transactionalEntityManager.delete(ReviewImage_1.ReviewImage, { reviewId: id });
            yield transactionalEntityManager.insert(ReviewImage_1.ReviewImage, newReviewImages);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: `Cập nhật ${data.type === 0 ? 'đánh giá' : 'phản hồi'} thành công`,
            data: null,
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Lỗi server :: ${error.message}`,
        });
    }
});
exports.updateOne = updateOne;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const review = yield Review_1.Review.findOneBy({ id });
        if (!review) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Đánh giá hoặc phản hồi không tồn tại',
            });
        }
        yield Review_1.Review.update(id, { status });
        return res.status(200).json({
            code: 200,
            success: true,
            message: `Cập nhật trạng thái ${review.type === 0 ? 'đánh giá' : 'phản hồi'} thành công`,
            data: null,
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Lỗi server :: ${error.message}`,
        });
    }
});
exports.changeStatus = changeStatus;
const removeAny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    try {
        for (let i = 0; i < ids.length; i++) {
            const review = yield Review_1.Review.findOneBy({ id: ids[i] });
            if (!review) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Đánh giá hoặc phản hồi không tồn tại',
                });
            }
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(ReviewImage_1.ReviewImage, { reviewId: ids });
            yield transactionalEntityManager.delete(Review_1.Review, { reviewId: ids });
            yield transactionalEntityManager.delete(Review_1.Review, ids);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa danh sách đánh giá hoặc phản hồi thành công',
            data: null,
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Lỗi server :: ${error.message}`,
        });
    }
});
exports.removeAny = removeAny;
const removeOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const review = yield Review_1.Review.findOneBy({ id });
        if (!review) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Đánh giá hoặc phản hồi không tồn tại',
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(ReviewImage_1.ReviewImage, { reviewId: id });
            yield transactionalEntityManager.delete(Review_1.Review, { reviewId: id });
            yield transactionalEntityManager.delete(Review_1.Review, id);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: `Xóa ${review.type === 0 ? 'đánh giá' : 'phản hồi'} thành công`,
            data: null,
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Lỗi server :: ${error.message}`,
        });
    }
});
exports.removeOne = removeOne;
//# sourceMappingURL=reviewController.js.map