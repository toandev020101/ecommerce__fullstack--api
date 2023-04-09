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
exports.getOneById = exports.getListByProvinceId = void 0;
const District_1 = require("./../models/District");
const getListByProvinceId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { provinceId } = req.params;
    try {
        const districts = yield District_1.District.find({ where: { provinceId } });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách quận, huyện thành công',
            data: districts,
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
exports.getListByProvinceId = getListByProvinceId;
const getOneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const district = yield District_1.District.findOneBy({ id });
        if (!district) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Quận, huyện không tồn tại',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy quận, huyện thành công',
            data: district,
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
//# sourceMappingURL=districtController.js.map