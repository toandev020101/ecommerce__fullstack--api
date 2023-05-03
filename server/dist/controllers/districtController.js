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
exports.getListByProvinceIdAndSearchTerm = void 0;
const District_1 = require("./../models/District");
const typeorm_1 = require("typeorm");
const getListByProvinceIdAndSearchTerm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { provinceId } = req.params;
    const { searchTerm } = req.query;
    try {
        const districts = yield District_1.District.find({
            where: searchTerm ? { provinceId, name: (0, typeorm_1.Like)(`%${searchTerm}%`) } : { provinceId },
        });
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
exports.getListByProvinceIdAndSearchTerm = getListByProvinceIdAndSearchTerm;
//# sourceMappingURL=districtController.js.map