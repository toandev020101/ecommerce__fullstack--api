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
const orderSchema = yup.object().shape({
    fullName: yup.string().min(4, 'Họ và tên phải có ít nhất 4 ký tự!').max(45, 'Họ và tên chỉ tối đa 45 ký tự!'),
    phoneNumber: yup.string().min(10, 'Số điện thoại có ít nhất 10 ký tự!').max(15, 'Số điện thoại chỉ tối đa 15 ký tự!'),
    totalQuantity: yup.number().min(0, 'Tổng số lượng phải lớn hơn hoặc bằng 0!'),
    totalPrice: yup.number().min(0, 'Tổng giá phải lớn hơn hoặc bằng 0!'),
    street: yup.string().required('Đường không thể để trống!'),
    wardId: yup.number().min(0, 'Id phường, xã phải lớn hơn hoặc bằng 0!'),
    districtId: yup.number().min(0, 'Id quận, huyện phải lớn hơn hoặc bằng 0!'),
    provinceId: yup.number().min(0, 'Id tỉnh, thành phố lớn hơn hoặc bằng 0!'),
    lines: yup.array().of(yup.object().shape({
        variation: yup.string().required('Thuộc tính không thể để trống!'),
        quantity: yup.number().min(1, 'Số lượng phải lớn hơn hoặc bằng 1!'),
        price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0!'),
        productItemId: yup.number().min(0, 'Id sản phẩm phải lớn hơn hoặc bằng 0!'),
    })),
});
exports.default = orderSchema;
//# sourceMappingURL=orderSchema.js.map