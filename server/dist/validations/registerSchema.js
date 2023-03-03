"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yup = __importStar(require("yup"));
const registerSchema = yup.object().shape({
    firstName: yup.string().min(2, 'Họ phải có ít nhất 2 ký tự!').max(20, 'Họ chỉ tối đa 20 ký tự!'),
    lastName: yup.string().min(2, 'Tên phải có ít nhất 2 ký tự!').max(20, 'Tên chỉ tối đa 20 ký tự!'),
    username: yup.string().min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự!').max(45, 'Tên đăng nhập chỉ tối đa 45 ký tự!'),
    password: yup.string().min(4, 'Mật khẩu phải có ít nhất 4 ký tự!').max(45, 'Mật khẩu chỉ tối đa 45 ký tự!'),
    gender: yup.number().oneOf([0, 1], 'Giới tính không hợp lệ (Nam / nữ)!'),
});
exports.default = registerSchema;
//# sourceMappingURL=registerSchema.js.map