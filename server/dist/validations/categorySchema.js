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
const categorySchema = yup.object().shape({
    imageUrl: yup.string().required('Hình ảnh danh mục không thể để trống'),
    name: yup.string().min(4, 'Tên danh mục phải có ít nhất 4 ký tự!').max(100, 'Tên danh mục chỉ tối đa 100 ký tự!'),
    slug: yup
        .string()
        .min(4, 'Đường dẫn danh mục phải có ít nhất 4 ký tự!')
        .max(100, 'Đường dẫn danh mục chỉ tối đa 100 ký tự!'),
    level: yup.number().required('Vị trí danh mục không thể để trống!'),
    parentId: yup.number().nullable(),
    isActive: yup.number().oneOf([0, 1], 'Trạng thái không hợp lệ!'),
});
exports.default = categorySchema;
//# sourceMappingURL=categorySchema.js.map