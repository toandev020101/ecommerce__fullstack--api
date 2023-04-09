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
exports.getOneById = exports.getListByDistrictId = void 0;
const Ward_1 = require("./../models/Ward");
const getListByDistrictId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { districtId } = req.params;
    try {
        const wards = yield Ward_1.Ward.find({ where: { districtId } });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách phường, xã thành công',
            data: wards,
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
exports.getListByDistrictId = getListByDistrictId;
const getOneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ward = yield Ward_1.Ward.findOneBy({ id });
        if (!ward) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Phường, xã không tồn tại',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy phường, xã thành công',
            data: ward,
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
//# sourceMappingURL=wardController.js.map