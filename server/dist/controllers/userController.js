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
exports.removeOne = exports.removeAny = exports.changePassword = exports.changeActive = exports.updateOne = exports.addOne = exports.addAny = exports.getOneAndRoleById = exports.getOneAndRoleByIdPublic = exports.getAllAndRole = exports.getPaginationAndRole = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const Role_1 = require("./../models/Role");
const User_1 = require("./../models/User");
const jwt_1 = require("./../utils/jwt");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
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
        const role = yield Role_1.Role.findOneBy({ name: 'Khách hàng' });
        if (!role) {
            return res.status(500).json({
                code: 500,
                success: false,
                message: 'Lỗi server :: chưa có vai trò khách hàng!',
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
    const { username, password } = req.body;
    try {
        const user = yield User_1.User.findOne({
            where: { username },
            select: ['id', 'fullName', 'username', 'password', 'avatar', 'gender', 'email', 'isActive', 'tokenVersion'],
        });
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
        if (!user.isActive) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Đăng nhập thất bại',
                errors: [
                    { field: 'username', message: 'Tài khoản đã bị khóa!' },
                    { field: 'password', message: 'Tài khoản đã bị khóa!' },
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
    const token = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];
    if (!token) {
        return res.status(403).json({
            code: 403,
            success: false,
            message: 'Không có quyền truy cập',
        });
    }
    try {
        const decodedUser = (0, jsonwebtoken_1.verify)(token, process.env.REFRESH_TOKEN_SECRET);
        const user = yield User_1.User.findOneBy({ id: decodedUser.userId });
        if (!user || user.tokenVersion !== decodedUser.tokenVersion) {
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
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.User.findOneBy({ id });
        if (!user) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Đăng xuất thất bại',
            });
        }
        user.tokenVersion += 1;
        yield user.save();
        res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/api/v1/auth/refresh-token',
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Đăng xuất thành công',
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
exports.logout = logout;
const getPaginationAndRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order, roleId, gender, isActive, searchTerm } = req.query;
    try {
        const userRepository = AppDataSource_1.default.getRepository(User_1.User);
        const queryBuilder = userRepository.createQueryBuilder('user');
        queryBuilder.select([
            'user.id',
            'user.fullName',
            'user.username',
            'user.avatar',
            'user.gender',
            'user.email',
            'user.isActive',
            'role.id',
            'role.name',
        ]);
        queryBuilder.leftJoin('user.role', 'role');
        if (roleId && roleId !== '') {
            queryBuilder.andWhere(`user.roleId = ${roleId}`);
        }
        if (gender && gender !== '') {
            queryBuilder.andWhere(`user.gender = ${gender}`);
        }
        if (isActive && isActive !== '') {
            queryBuilder.andWhere(`user.isActive = ${isActive === '1'}`);
        }
        if (searchTerm && searchTerm !== '') {
            queryBuilder.andWhere(new typeorm_1.Brackets((qb) => {
                qb.where(`user.fullName like '%${searchTerm}%'`)
                    .orWhere(`user.username like '%${searchTerm}%'`)
                    .orWhere(`user.email like '%${searchTerm}%'`);
            }));
        }
        if (_limit && _page) {
            queryBuilder.skip(_page * _limit);
            queryBuilder.take(_limit);
        }
        if (_sort && _order) {
            queryBuilder.orderBy(_sort === 'role' ? 'role.name' : `user.${_sort}`, _order.toUpperCase());
        }
        const users = yield queryBuilder.getMany();
        const total = yield queryBuilder.getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách tài khoản thành công',
            data: users,
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
const getAllAndRole = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find({
            relations: {
                role: true,
                ward: true,
                district: true,
                province: true,
            },
        });
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
exports.getAllAndRole = getAllAndRole;
const getOneAndRoleByIdPublic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.User.findOne({
            where: { id },
            relations: {
                role: true,
                ward: true,
                district: true,
                province: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Tài khoản không tồn tại!',
            });
        }
        if (!user.isActive) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Đăng nhập thất bại',
                errors: [
                    { field: 'username', message: 'Tài khoản đã bị khóa!' },
                    { field: 'password', message: 'Tài khoản đã bị khóa!' },
                ],
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
exports.getOneAndRoleByIdPublic = getOneAndRoleByIdPublic;
const getOneAndRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.User.findOne({
            where: { id },
            relations: {
                role: true,
                ward: true,
                district: true,
                province: true,
            },
        });
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
exports.getOneAndRoleById = getOneAndRoleById;
const addAny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        for (let i = 0; i < data.length; i++) {
            const { username, email, password } = data[i];
            const user = yield User_1.User.findOne({ where: [{ username }, { email }] });
            if (user) {
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Tên đăng nhập hoặc email đã tồn tại!',
                });
            }
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            data[i].password = hashedPassword;
        }
        yield User_1.User.insert(data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm danh sách tài khoản thành công',
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
exports.addAny = addAny;
const addOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { username, email, password } = data;
    const errors = [];
    try {
        let user = yield User_1.User.findOne({ where: { username } });
        if (user) {
            errors.push({ field: 'username', message: 'Tên đăng nhập đã tồn tại!' });
        }
        if (email) {
            user = yield User_1.User.findOne({ where: { email } });
            if (user) {
                errors.push({ field: 'email', message: 'Email đã tồn tại!' });
            }
        }
        if (errors.length > 0) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Thêm tài khoản thất bại',
                errors,
            });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        data.password = hashedPassword;
        yield User_1.User.insert(data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm tài khoản thành công',
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
        let user = yield User_1.User.findOneBy({ id });
        if (!user) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Tài khoản không tồn tại!',
            });
        }
        if (data.email && data.email !== '') {
            user = yield User_1.User.findOneBy({ email: data.email });
            if (user) {
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Email đã tồn tại!',
                    errors: [{ field: 'email', message: 'Email đã tồn tại!' }],
                });
            }
        }
        yield User_1.User.update(id, data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật tài khoản thành công',
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
const changeActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    try {
        let user = yield User_1.User.findOneBy({ id });
        if (!user) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Tài khoản không tồn tại!',
            });
        }
        yield User_1.User.update(id, data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật tài khoản thành công',
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
exports.changeActive = changeActive;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { password, newPassword } = req.body;
    try {
        let user = yield User_1.User.findOne({
            select: {
                username: true,
                password: true,
            },
            where: { id },
        });
        if (!user) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Tài khoản không tồn tại!',
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Thay đổi mật khẩu thất bại',
                errors: [{ field: 'password', message: 'Mật khẩu không chính xác!' }],
            });
        }
        if (password === newPassword) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Thay đổi mật khẩu thất bại',
                errors: [
                    { field: 'newPassword', message: 'Không thể nhập mật khẩu hiện tại!' },
                    { field: 'confirmNewPassword', message: 'Không thể nhập mật khẩu hiện tại!' },
                ],
            });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
        yield User_1.User.update(id, { password: hashedPassword });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thay đổi mật khẩu thành công',
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
exports.changePassword = changePassword;
const removeAny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    try {
        let avatars = [];
        for (let i = 0; i < ids.length; i++) {
            const user = yield User_1.User.findOneBy({ id: ids[i] });
            if (!user) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Tài khoản không tồn tại!',
                });
            }
            if (user.avatar) {
                avatars.push(user.avatar);
            }
        }
        yield User_1.User.delete(ids);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa danh sách tài khoản thành công',
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
        const user = yield User_1.User.findOneBy({ id });
        if (!user) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Tài khoản không tồn tại',
            });
        }
        yield User_1.User.delete(id);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa tài khoản thành công',
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
//# sourceMappingURL=userController.js.map