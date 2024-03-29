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
exports.getAll = void 0;
const ShipMethod_1 = require("./../models/ShipMethod");
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
//# sourceMappingURL=shipMethodController%20copy.js.map