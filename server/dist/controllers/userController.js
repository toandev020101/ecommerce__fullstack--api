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
exports.getOneById = exports.getAll = exports.refreshToken = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const Role_1 = require("./../models/Role");
const User_1 = require("./../models/User");
const jwt_1 = require("./../utils/jwt");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User_1.User.findOneBy({ username });
        if (user) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Đăng ký thất bại',
                errors: [{ field: 'username', message: 'Tên tài khoản đã tồn tại!' }],
            });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const role = yield Role_1.Role.findOneBy({ code: 'customer' });
        if (!role) {
            return res.status(500).json({
                code: 500,
                success: false,
                message: 'Lỗi server!',
            });
        }
        const newUser = User_1.User.create(Object.assign(Object.assign({}, req.body), { password: hashedPassword, roleId: role.id }));
        yield newUser.save();
        newUser.password = '';
        (0, jwt_1.sendRefreshToken)(res, newUser);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Đăng ký thành công',
            data: newUser,
            accessToken: (0, jwt_1.createToken)('accessToken', newUser),
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
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User_1.User.findOneBy({ username });
        if (!user) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Đăng nhập thất bại',
                errors: [
                    { field: 'username', message: 'Tài khoản hoặc mật khẩu không chính xác!' },
                    { field: 'password', message: 'Tài khoản hoặc mật khẩu không chính xác!' },
                ],
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Đăng nhập thất bại',
                errors: [
                    { field: 'username', message: 'Tài khoản hoặc mật khẩu không chính xác!' },
                    { field: 'password', message: 'Tài khoản hoặc mật khẩu không chính xác!' },
                ],
            });
        }
        user.password = '';
        (0, jwt_1.sendRefreshToken)(res, user);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Đăng nhập thành công',
            data: user,
            accessToken: (0, jwt_1.createToken)('accessToken', user),
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
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];
        if (!token) {
            return res.status(403).json({
                code: 403,
                success: false,
                message: 'Không có quyền truy cập',
            });
        }
        const decodedUser = (0, jsonwebtoken_1.verify)(token, process.env.REFRESH_TOKEN_SECRET);
        const user = yield User_1.User.findOneBy({ id: decodedUser.userId });
        if (!user) {
            return res.status(403).json({
                code: 403,
                success: false,
                message: 'Không có quyền truy cập',
            });
        }
        (0, jwt_1.sendRefreshToken)(res, user);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Làm mới token thành công',
            accessToken: (0, jwt_1.createToken)('accessToken', user),
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
exports.refreshToken = refreshToken;
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả tài khoản thành công',
            data: users,
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
        const user = yield User_1.User.findOneBy({ id: req.body.id });
        if (!user) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Tài khoản không tồn tại!',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tài khoản thành công',
            data: user,
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
//# sourceMappingURL=userController.js.map