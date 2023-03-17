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
const userSchema = yup.object().shape({
    fullName: yup.string().min(4, 'Họ và tên phải có ít nhất 4 ký tự!').max(45, 'Họ và tên chỉ tối đa 45 ký tự!'),
    username: yup.string().min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự!').max(45, 'Tên đăng nhập chỉ tối đa 45 ký tự!'),
    password: yup.string().min(4, 'Mật khẩu phải có ít nhất 4 ký tự!').max(45, 'Mật khẩu chỉ tối đa 45 ký tự!'),
    gender: yup.number().oneOf([0, 1], 'Giới tính không hợp lệ (Nam / nữ)!'),
    email: yup.string().nullable().email('Email không hợp lệ!'),
    phoneNumber: yup.string().nullable().max(15, 'Số điện thoại chỉ tối đa 15 ký tự!'),
    isActive: yup.number().oneOf([0, 1], 'Trạng thái không hợp lệ!'),
    roleId: yup.number().required('Vai trò không thể để trống!'),
    avatar: yup.string().nullable(),
});
exports.default = userSchema;
//# sourceMappingURL=userSchema.js.map