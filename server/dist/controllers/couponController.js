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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOne = exports.removeAny = exports.updateOne = exports.addOne = exports.checkOne = exports.getPagination = exports.getAllPublic = void 0;
const typeorm_1 = require("typeorm");
const date_1 = require("../utils/date");
const Coupon_1 = require("./../models/Coupon");
const getAllPublic = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupons = yield Coupon_1.Coupon.find();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả mã giảm giá thành công',
            data: coupons,
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
exports.getAllPublic = getAllPublic;
const getPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order, searchTerm } = req.query;
    try {
        const couponRes = yield Coupon_1.Coupon.findAndCount({
            where: searchTerm
                ? [
                    { name: (0, typeorm_1.Like)(`%${searchTerm.toLowerCase()}%`) },
                    { priceMaxName: (0, typeorm_1.Like)(`%${searchTerm.toLowerCase()}%`) },
                    { code: (0, typeorm_1.Like)(`%${searchTerm.toLowerCase()}%`) },
                ]
                : {},
            skip: _page * _limit,
            take: _limit,
            order: { [_sort]: _order },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách mã giảm giá thành công',
            data: couponRes[0],
            pagination: {
                _limit,
                _page,
                _total: couponRes[1],
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
const checkOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.params;
    try {
        const coupon = yield Coupon_1.Coupon.findOneBy({ code });
        if (!coupon) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Mã giảm giá không tồn tại',
            });
        }
        const currentDate = new Date();
        const currentDateString = (0, date_1.toDateString)(currentDate);
        if ((0, date_1.toDate)((0, date_1.toDateString)(coupon.startDate)) > (0, date_1.toDate)(currentDateString)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Mã giảm giá chưa được triển khai',
            });
        }
        if ((0, date_1.toDate)((0, date_1.toDateString)(coupon.endDate)) < (0, date_1.toDate)(currentDateString)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Mã giảm giá đã quá hạn',
            });
        }
        if (coupon.quantity === 0) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Mã giảm giá đã hết',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Áp dụng mã giảm giá thành công',
            data: coupon,
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
exports.checkOne = checkOne;
const addOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const userId = req.userId;
    try {
        const coupon = yield Coupon_1.Coupon.findOneBy({ code: data.code });
        if (coupon) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Mã đã tồn tại',
                errors: [{ field: 'code', message: 'Mã đã tồn tại!' }],
            });
        }
        yield Coupon_1.Coupon.insert(Object.assign(Object.assign({}, data), { userId }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm mã giảm giá thành công',
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
    const data = req.body;
    const userId = req.userId;
    const { id } = req.params;
    try {
        let coupon = yield Coupon_1.Coupon.findOneBy({ id: parseInt(id) });
        if (!coupon) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Mã giảm giá không tồn tại',
            });
        }
        coupon = yield Coupon_1.Coupon.findOneBy({ code: data.code });
        if (coupon && coupon.id !== parseInt(id)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Mã đã tồn tại',
                errors: [{ field: 'code', message: 'Mã đã tồn tại!' }],
            });
        }
        yield Coupon_1.Coupon.update(id, Object.assign(Object.assign({}, data), { userId }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật mã giảm giá thành công',
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
            const coupon = yield Coupon_1.Coupon.findOneBy({ id: ids[i] });
            if (!coupon) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Mã giảm giá không tồn tại',
                });
            }
        }
        yield Coupon_1.Coupon.delete(ids);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa danh sách mã giảm giá thành công',
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
        const coupon = yield Coupon_1.Coupon.findOneBy({ id });
        if (!coupon) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Mã giảm giá không tồn tại',
            });
        }
        yield Coupon_1.Coupon.delete(id);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa mã giảm giá thành công',
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
//# sourceMappingURL=couponController.js.map