"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createToken = (type, user) => (0, jsonwebtoken_1.sign)(Object.assign({ userId: user.id }, (type === 'refreshToken' ? { tokenVersion: user.tokenVersion } : {})), type === 'accessToken' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: type === 'accessToken' ? '15m' : '1h',
});
exports.createToken = createToken;
const sendRefreshToken = (res, user) => {
    const refreshToken = (0, exports.createToken)('refreshToken', user);
    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/api/v1/auth/refresh-token',
    });
};
exports.sendRefreshToken = sendRefreshToken;
//# sourceMappingURL=jwt.js.map