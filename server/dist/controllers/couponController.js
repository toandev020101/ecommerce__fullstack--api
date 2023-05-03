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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOne = exports.removeAny = exports.addOne = exports.checkOne = exports.getPagination = void 0;
const date_1 = require("../utils/date");
const Coupon_1 = require("./../models/Coupon");
const Inventory_1 = require("../models/Inventory");
const ProductItem_1 = require("../models/ProductItem");
const OrderStatus_1 = require("../models/OrderStatus");
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const CartItem_1 = require("../models/CartItem");
const Order_1 = require("../models/Order");
const OrderCoupon_1 = require("../models/OrderCoupon");
const OrderLine_1 = require("../models/OrderLine");
const getPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order } = req.query;
    try {
        const orderRes = yield Order_1.Order.findAndCount({
            select: {
                id: true,
                userId: true,
                fullName: true,
                phoneNumber: true,
                street: true,
                wardId: true,
                ward: {
                    id: true,
                    name: true,
                },
                districtId: true,
                district: {
                    id: true,
                    name: true,
                },
                provinceId: true,
                province: {
                    id: true,
                    name: true,
                },
                totalPrice: true,
                orderStatusId: true,
                orderStatus: {
                    id: true,
                    name: true,
                },
                paymentMethodId: true,
                paymentMethod: {
                    id: true,
                    name: true,
                },
            },
            skip: _page * _limit,
            take: _limit,
            order: { [_sort]: _order },
            relations: {
                ward: true,
                district: true,
                province: true,
                paymentMethod: true,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách đơn hàng thành công',
            data: orderRes[0],
            pagination: {
                _limit,
                _page,
                _total: orderRes[1],
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
exports.getPagination = getPagination;
const checkOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    try {
        const coupon = yield Coupon_1.Coupon.findOneBy({ code });
        if (!coupon) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Mã giảm giá không tồn tại',
            });
        }
        const currentDate = new Date();
        if ((0, date_1.toDate)(coupon.startDate) > currentDate) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Mã giảm giá chưa được triển khai',
            });
        }
        if ((0, date_1.toDate)(coupon.endDate) < currentDate) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Mã giảm giá đã quá hạn',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Áp dụng mã giảm giá thành công',
            data: coupon,
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
exports.checkOne = checkOne;
const addOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { lines, coupons } = _a, others = __rest(_a, ["lines", "coupons"]);
    const userId = req.userId;
    try {
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const orderStatus = yield OrderStatus_1.OrderStatus.findOneBy({ name: 'Chờ xác nhận' });
            if (!orderStatus) {
                return res.status(500).json({
                    code: 500,
                    success: false,
                    message: `Lỗi server :: không tìm thấy trạng thái`,
                });
            }
            const insertedOrder = yield transactionalEntityManager.insert(Order_1.Order, Object.assign(Object.assign({}, others), { userId, orderStatusId: orderStatus.id }));
            if (lines.length > 0) {
                let lineData = [];
                for (let i = 0; i < lines.length; i++) {
                    lineData.push({
                        orderId: insertedOrder.raw.insertId,
                        variation: lines[i].variation,
                        quantity: lines[i].quantity,
                        price: lines[i].price,
                        productItemId: lines[i].productItemId,
                    });
                    yield transactionalEntityManager.delete(CartItem_1.CartItem, { userId, productItemId: lines[i].productItemId });
                    const productItem = yield ProductItem_1.ProductItem.findOne({
                        where: { id: lines[i].productItemId },
                        relations: { inventory: true },
                    });
                    yield transactionalEntityManager.update(Inventory_1.Inventory, productItem === null || productItem === void 0 ? void 0 : productItem.inventoryId, {
                        quantity: ((_b = productItem === null || productItem === void 0 ? void 0 : productItem.inventory) === null || _b === void 0 ? void 0 : _b.quantity) - lines[i].quantity,
                    });
                }
                yield transactionalEntityManager.insert(OrderLine_1.OrderLine, lineData);
            }
            if (coupons && coupons.length > 0) {
                let couponData = [];
                for (let i = 0; i < coupons.length; i++) {
                    couponData.push({
                        orderId: insertedOrder.raw.insertId,
                        code: coupons[i].code,
                        price: coupons[i].price,
                    });
                }
                yield transactionalEntityManager.insert(OrderCoupon_1.OrderCoupon, couponData);
            }
            return null;
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm đơn hàng thành công',
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
const removeAny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    try {
        for (let i = 0; i < ids.length; i++) {
            const order = yield Order_1.Order.findOneBy({ id: ids[i] });
            if (!order) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Đơn hàng không tồn tại',
                });
            }
        }
        yield Order_1.Order.delete(ids);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa danh sách đơn hàng thành công',
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
        const order = yield Order_1.Order.findOneBy({ id });
        if (!order) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Đơn hàng không tồn tại',
            });
        }
        yield CartItem_1.CartItem.delete(id);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa đơn hàng thành công',
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
//# sourceMappingURL=couponController.js.map