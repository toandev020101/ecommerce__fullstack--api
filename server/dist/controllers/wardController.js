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
exports.getListByDistrictIdAndSearchTerm = void 0;
const Ward_1 = require("./../models/Ward");
const typeorm_1 = require("typeorm");
const getListByDistrictIdAndSearchTerm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { districtId } = req.params;
    const { searchTerm } = req.query;
    try {
        const wards = yield Ward_1.Ward.find({
            where: searchTerm ? { districtId, name: (0, typeorm_1.Like)(`%${searchTerm}%`) } : { districtId },
        });
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
exports.getListByDistrictIdAndSearchTerm = getListByDistrictIdAndSearchTerm;
//# sourceMappingURL=wardController.js.map