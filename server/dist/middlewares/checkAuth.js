"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const checkAuth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const accessToken = authHeader && authHeader.split(' ')[1];
        if (!accessToken)
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'Token không hợp lệ!',
            });
        const decodedUser = (0, jsonwebtoken_1.verify)(accessToken, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedUser)
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'Token không hợp lệ!',
            });
        req.body.user = decodedUser;
        return next();
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: `Lỗi server :: ${error.message}`,
        });
    }
};
exports.checkAuth = checkAuth;
//# sourceMappingURL=checkAuth.js.map