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
const typeorm_1 = require("typeorm");
const OrderLine_1 = require("./../models/OrderLine");
const getListBySearchTerm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.query;
    try {
        const orderLines = yield OrderLine_1.OrderLine.find({
            where: searchTerm
                ? {
                    productItem: { product: { name: (0, typeorm_1.Like)(`%${searchTerm.toLowerCase()}%`) } },
                    reviews: { id: (0, typeorm_1.IsNull)() },
                    order: { orderStatus: { name: 'Thành công' } },
                }
                : { reviews: { id: (0, typeorm_1.IsNull)() }, order: { orderStatus: { name: 'Thành công' } } },
            relations: {
                productItem: {
                    product: true,
                },
                reviews: true,
                order: { orderStatus: true },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách mục đơn hàng thành công',
            data: orderLines,
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
//# sourceMappingURL=orderLineController.js.map