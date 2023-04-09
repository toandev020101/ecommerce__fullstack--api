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
exports.getOneById = exports.getAll = void 0;
const Province_1 = require("./../models/Province");
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provinces = yield Province_1.Province.find();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả tỉnh, thành phố thành công',
            data: provinces,
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
const getOneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const province = yield Province_1.Province.findOneBy({ id });
        if (!province) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Tỉnh, thành phố không tồn tại',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tỉnh, thành phố thành công',
            data: province,
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
//# sourceMappingURL=provinceController.js.map