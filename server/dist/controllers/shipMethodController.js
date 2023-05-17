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
        const shipMethods = yield ShipMethod_1.ShipMethod.findBy({ deleted: 0 });
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
            where: searchTerm ? [{ name: (0, typeorm_1.Like)(`%${searchTerm.toLowerCase()}%`), deleted: 0 }] : { deleted: 0 },
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
    const { id } = req.params;
    try {
        let shipMethod = yield ShipMethod_1.ShipMethod.findOneBy({ id: parseInt(id) });
        if (!shipMethod) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Phương thức giao hàng không tồn tại',
            });
        }
        yield ShipMethod_1.ShipMethod.update(id, data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật phương thức giao hàng thành công',
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
            const shipMethod = yield ShipMethod_1.ShipMethod.findOneBy({ id: ids[i] });
            if (!shipMethod) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Phương thức giao hàng không tồn tại',
                });
            }
        }
        yield ShipMethod_1.ShipMethod.update(ids, { deleted: 1 });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa danh sách phương thức giao hàng thành công',
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
        const shipMethod = yield ShipMethod_1.ShipMethod.findOneBy({ id });
        if (!shipMethod) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Phương thức giao hàng không tồn tại',
            });
        }
        yield ShipMethod_1.ShipMethod.update(id, { deleted: 1 });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa phương thức giao hàng thành công',
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