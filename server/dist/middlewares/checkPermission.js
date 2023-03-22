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
exports.checkPermission = void 0;
const User_1 = require("./../models/User");
const checkPermission = (slug, method) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const methods = {
            get: 0,
            post: 1,
            put: 2,
            patch: 3,
            delete: 4,
        };
        const { userId } = req;
        const methodRoute = methods[method];
        const user = yield User_1.User.findOne({
            select: {
                id: true,
                role: {
                    id: true,
                    rolePermissions: {
                        id: true,
                        roleId: true,
                        permissionId: true,
                        permission: {
                            id: true,
                            slug: true,
                            method: true,
                        },
                    },
                },
            },
            where: { id: userId },
            relations: {
                role: { rolePermissions: { permission: true } },
            },
        });
        const permissionIndex = user === null || user === void 0 ? void 0 : user.role.rolePermissions.findIndex((rolePermission) => rolePermission.permission.slug === slug && rolePermission.permission.method === methodRoute);
        if (permissionIndex === -1) {
            return res.status(403).json({
                code: 403,
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này',
            });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Lỗi server :: ${error.message}`,
        });
    }
});
exports.checkPermission = checkPermission;
//# sourceMappingURL=checkPermission.js.map