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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOne = exports.updateOne = exports.addOne = exports.getOneAndPermissionById = exports.getAllAndUser = exports.getAll = void 0;
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const RolePermission_1 = require("../models/RolePermission");
const Role_1 = require("./../models/Role");
const User_1 = require("./../models/User");
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
const getAllAndUser = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield Role_1.Role.find({
            select: {
                id: true,
                name: true,
                users: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
            relations: {
                users: true,
            },
        });
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
exports.getAllAndUser = getAllAndUser;
const getOneAndPermissionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const role = yield Role_1.Role.findOne({
            where: { id },
            relations: {
                rolePermissions: true,
            },
        });
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
exports.getOneAndPermissionById = getOneAndPermissionById;
const addOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, permissionIds } = req.body;
    if (name === '') {
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Thêm mới thất bại',
            errors: [{ field: 'name', message: 'Tên vai trò không thể để trống!' }],
        });
    }
    try {
        const role = yield Role_1.Role.findOneBy({ name });
        if (role) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Thêm mới vai trò thất bại',
                errors: [{ field: 'name', message: 'Tên vai trò đã tồn tại!' }],
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const insertedRole = yield transactionalEntityManager.insert(Role_1.Role, { name });
            let rolePermissionData = [];
            for (let i = 0; i < permissionIds.length; i++) {
                rolePermissionData.push({
                    roleId: insertedRole.raw.insertId,
                    permissionId: permissionIds[i],
                });
            }
            yield transactionalEntityManager.insert(RolePermission_1.RolePermission, rolePermissionData);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm mới vai trò thành công',
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
    const { id } = req.params;
    const { name, permissionIds } = req.body;
    if (name === '') {
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Cập nhật vai trò thất bại',
            errors: [{ field: 'name', message: 'Tên vai trò không thể để trống!' }],
        });
    }
    try {
        let role = yield Role_1.Role.findOneBy({ id });
        if (!role) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Vai trò không tồn tại!',
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.update(Role_1.Role, id, { name });
            let rolePermissionData = [];
            for (let i = 0; i < permissionIds.length; i++) {
                rolePermissionData.push({
                    roleId: id,
                    permissionId: permissionIds[i],
                });
            }
            yield transactionalEntityManager.delete(RolePermission_1.RolePermission, { roleId: id });
            yield transactionalEntityManager.insert(RolePermission_1.RolePermission, rolePermissionData);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật vai trò thành công',
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
const removeOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const role = yield Role_1.Role.findOneBy({ id });
        if (!role) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Vai trò không tồn tại',
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(User_1.User, { roleId: id });
            yield transactionalEntityManager.delete(RolePermission_1.RolePermission, { roleId: id });
            yield transactionalEntityManager.delete(Role_1.Role, id);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa vai trò thành công',
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
//# sourceMappingURL=roleController.js.map