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
exports.removeOne = exports.removeAny = exports.updateOne = exports.addOne = exports.getPagination = exports.getAll = void 0;
const ShipMethod_1 = require("./../models/ShipMethod");
const typeorm_1 = require("typeorm");
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shipMethods = yield ShipMethod_1.ShipMethod.find();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả phương thức giao hàng thành công',
            data: shipMethods,
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
exports.getAll = getAll;
const getPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order, searchTerm } = req.query;
    try {
        const shipMethodRes = yield ShipMethod_1.ShipMethod.findAndCount({
            where: searchTerm ? [{ name: (0, typeorm_1.Like)(`%${searchTerm}%`) }] : {},
            skip: _page * _limit,
            take: _limit,
            order: { [_sort]: _order },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách phương thức giao hàng thành công',
            data: shipMethodRes[0],
            pagination: {
                _limit,
                _page,
                _total: shipMethodRes[1],
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
const addOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        yield ShipMethod_1.ShipMethod.insert(data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm phương thức giao hàng thành công',
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
        let coupon = yield Coupon.findOneBy({ id: parseInt(id) });
        if (!coupon) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Mã giảm giá không tồn tại',
            });
        }
        coupon = yield Coupon.findOneBy({ code: data.code });
        if (coupon && coupon.id !== parseInt(id)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Mã đã tồn tại',
                errors: [{ field: 'code', message: 'Mã đã tồn tại!' }],
            });
        }
        yield Coupon.update(id, Object.assign(Object.assign({}, data), { userId }));
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
            const coupon = yield Coupon.findOneBy({ id: ids[i] });
            if (!coupon) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Mã giảm giá không tồn tại',
                });
            }
        }
        yield Coupon.delete(ids);
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
        const coupon = yield Coupon.findOneBy({ id });
        if (!coupon) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Mã giảm giá không tồn tại',
            });
        }
        yield Coupon.delete(id);
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
//# sourceMappingURL=shipMethodController.js.map