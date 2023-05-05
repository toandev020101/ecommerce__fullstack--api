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
const changePasswordSchema = yup.object().shape({
    password: yup
        .string()
        .min(4, 'Mật khẩu hiện tại phải có ít nhất 4 ký tự!')
        .max(45, 'Mật khẩu cũ chỉ tối đa 45 ký tự!'),
    newPassword: yup
        .string()
        .min(4, 'Mật khẩu mới phải có ít nhất 4 ký tự!')
        .max(45, 'Mật khẩu mới chỉ tối đa 45 ký tự!'),
    confirmPassword: yup
        .string()
        .min(4, 'Mật khẩu mới phải có ít nhất 4 ký tự!')
        .max(45, 'Mật khẩu mới chỉ tối đa 45 ký tự!')
        .oneOf([yup.ref('newPassword')], 'Không khớp mật khẩu mới!'),
});
exports.default = changePasswordSchema;
//# sourceMappingURL=changePasswordSchema.js.map