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
const Role_1 = require("./../models/Role");
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield Role_1.Role.find();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả vai trò thành công',
            data: roles,
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
    try {
        const role = yield Role_1.Role.findOneBy({ id: req.body.id });
        if (!role) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Vai trò không tồn tại!',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy vai trò thành công',
            data: role,
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
//# sourceMappingURL=roleController.js.map