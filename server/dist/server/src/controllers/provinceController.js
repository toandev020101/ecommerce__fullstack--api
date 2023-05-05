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
exports.getListBySearchTerm = void 0;
const Province_1 = require("./../models/Province");
const typeorm_1 = require("typeorm");
const getListBySearchTerm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.query;
    try {
        const provinces = yield Province_1.Province.findBy(searchTerm ? { name: (0, typeorm_1.Like)(`%${searchTerm}%`) } : {});
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách tỉnh, thành phố thành công',
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
exports.getListBySearchTerm = getListBySearchTerm;
//# sourceMappingURL=provinceController.js.map