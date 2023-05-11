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
const couponSchema = yup.object().shape({
    name: yup.string().min(2, 'Tên mã phải có ít nhất 2 ký tự!').max(65, 'Tên mã chỉ tối đa 65 ký tự!'),
    priceMaxName: yup.string().nullable(),
    code: yup.string().min(2, 'Mã phải có ít nhất 2 ký tự!').max(65, 'Mã chỉ tối đa 65 ký tự!'),
    discountValue: yup.number().min(1, 'Giá trị giảm phải lớn hơn 0!'),
    priceMax: yup.number().nullable(),
    type: yup.number(),
    quantity: yup.number().min(0, 'Số lượng phải lớn hơn hoặc bằng 0!'),
    startDate: yup.date().required('Ngày bắt đầu không thể để trống!'),
    endDate: yup.date().required('Ngày kết thúc không thể để trống!'),
});
exports.default = couponSchema;
//# sourceMappingURL=couponSchema.js.map