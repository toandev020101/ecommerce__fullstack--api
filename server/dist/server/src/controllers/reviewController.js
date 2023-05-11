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
exports.removeOne = exports.removeAny = exports.updateOne = exports.addOne = exports.getOneByOrderLinedId = exports.getPagination = void 0;
const Review_1 = require("./../models/Review");
const typeorm_1 = require("typeorm");
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const getPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order, searchTerm } = req.query;
    try {
        const reviewRes = yield Review_1.Review.findAndCount({
            where: [{ comment: (0, typeorm_1.Like)(`%${searchTerm}%`) }, { user: { fullName: (0, typeorm_1.Like)(`%${searchTerm}%`) } }],
            skip: _page * _limit,
            take: _limit,
            order: { [_sort]: _order },
            relations: {
                user: true,
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
const getOneByOrderLinedId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderLinedId } = req.params;
    try {
        const review = yield Review_1.Review.findOneBy({ orderLinedId });
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
            yield transactionalEntityManager.insert(Review_1.Review, Object.assign(Object.assign({}, others), { userId }));
            yield transactionalEntityManager.delete(Tag, ids);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm đánh giá thành công',
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
                message: 'Đánh giá không tồn tại',
            });
        }
        yield Review_1.Review.update(id, data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật đánh giá thành công',
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
const removeAny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    try {
        for (let i = 0; i < ids.length; i++) {
            const tag = yield Tag.findOneBy({ id: ids[i] });
            if (!tag) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Từ khóa không tồn tại',
                });
            }
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(ProductTag, { tagId: ids });
            yield transactionalEntityManager.delete(Tag, ids);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa danh sách từ khóa thành công',
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
        const tag = yield Tag.findOneBy({ id });
        if (!tag) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Từ khóa không tồn tại',
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(ProductTag, { tagId: id });
            yield transactionalEntityManager.delete(Tag, id);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa từ khóa thành công',
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