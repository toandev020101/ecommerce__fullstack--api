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
exports.removeOne = exports.removeAny = exports.updateOne = exports.addOne = exports.getPaginationAndRole = exports.getAll = void 0;
const typeorm_1 = require("typeorm");
const RolePermission_1 = require("./../models/RolePermission");
const Permission_1 = require("../models/Permission");
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const Role_1 = require("../models/Role");
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = yield Permission_1.Permission.find();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả quyền thành công',
            data: permissions,
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
const getPaginationAndRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order, searchTerm } = req.query;
    try {
        const permissions = yield Permission_1.Permission.find({
            select: {
                id: true,
                name: true,
                slug: true,
                method: true,
                createdAt: true,
                rolePermissions: {
                    id: true,
                    roleId: true,
                    permissionId: true,
                    role: {
                        id: true,
                        name: true,
                    },
                },
            },
            where: { name: (0, typeorm_1.Like)(`%${searchTerm}%`) },
            skip: _page * _limit,
            take: _limit,
            order: { [_sort]: _order },
            relations: {
                rolePermissions: { role: true },
            },
        });
        const total = yield Permission_1.Permission.count();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách quyền thành công',
            data: permissions,
            pagination: {
                _limit,
                _page,
                _total: total,
            },
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
exports.getPaginationAndRole = getPaginationAndRole;
const addOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { slug, method } = data;
    try {
        const permission = yield Permission_1.Permission.findOneBy({ slug, method });
        if (permission) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Quyền đã tồn tại',
                errors: [
                    { field: 'slug', message: 'Quyền đã tồn tại' },
                    { field: 'method', message: 'Quyền đã tồn tại' },
                ],
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const insertedPermission = yield transactionalEntityManager.insert(Permission_1.Permission, data);
            const role = yield transactionalEntityManager.findOneBy(Role_1.Role, { name: 'Quản trị viên' });
            yield transactionalEntityManager.insert(RolePermission_1.RolePermission, {
                roleId: role === null || role === void 0 ? void 0 : role.id,
                permissionId: insertedPermission.raw.insertId,
            });
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm quyền thành công',
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
    const data = req.body;
    try {
        const permission = yield Permission_1.Permission.findOneBy({ id });
        if (!permission) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Quyền không tồn tại',
            });
        }
        yield Permission_1.Permission.update(id, data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật quyền thành công',
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
const removeAny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    try {
        for (let i = 0; i < ids.length; i++) {
            const permission = yield Permission_1.Permission.findOneBy({ id: ids[i] });
            if (!permission) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Quyền không tồn tại',
                });
            }
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(RolePermission_1.RolePermission, { permissionId: (0, typeorm_1.In)(ids) });
            yield transactionalEntityManager.delete(Permission_1.Permission, ids);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa danh sách quyền thành công',
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
exports.removeAny = removeAny;
const removeOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const permission = yield Permission_1.Permission.findOneBy({ id });
        if (!permission) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Quyền không tồn tại',
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(RolePermission_1.RolePermission, { permissionId: id });
            yield transactionalEntityManager.delete(Permission_1.Permission, id);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa quyền thành công',
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
//# sourceMappingURL=permissionController.js.map