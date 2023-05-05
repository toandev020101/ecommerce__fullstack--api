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
exports.removeOne = exports.removeAny = exports.changeStatus = exports.updateOne = exports.addOne = exports.getOneById = exports.getPagination = exports.getListByStatusId = void 0;
const Inventory_1 = require("./../models/Inventory");
const ProductItem_1 = require("./../models/ProductItem");
const OrderStatus_1 = require("./../models/OrderStatus");
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const CartItem_1 = require("../models/CartItem");
const Order_1 = require("../models/Order");
const OrderCoupon_1 = require("./../models/OrderCoupon");
const OrderLine_1 = require("./../models/OrderLine");
const typeorm_1 = require("typeorm");
const getListByStatusId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusId } = req.params;
    const { searchTerm } = req.query;
    const userId = req.userId;
    let whereOptions = [{ userId }];
    const orderStatusId = parseInt(statusId);
    if (orderStatusId !== -1 && searchTerm) {
        whereOptions = [
            {
                orderStatusId,
                id: (0, typeorm_1.Like)(`%${searchTerm[0] === '#' ? searchTerm.split('#')[1] : searchTerm}%`),
                userId,
            },
            {
                orderStatusId,
                orderLines: {
                    productItem: {
                        product: {
                            name: (0, typeorm_1.Like)(`%${searchTerm}%`),
                        },
                    },
                },
                userId,
            },
        ];
    }
    else if (orderStatusId !== -1) {
        whereOptions = [{ orderStatusId, userId }];
    }
    else if (searchTerm) {
        whereOptions = [
            { id: (0, typeorm_1.Like)(`%${searchTerm[0] === '#' ? searchTerm.split('#')[1] : searchTerm}%`), userId },
            {
                orderLines: {
                    productItem: {
                        product: {
                            name: (0, typeorm_1.Like)(`%${searchTerm}%`),
                        },
                    },
                },
                userId,
            },
        ];
    }
    try {
        const orders = yield Order_1.Order.find({
            select: {
                id: true,
                userId: true,
                totalPrice: true,
                orderStatusId: true,
                orderStatus: {
                    id: true,
                    name: true,
                },
                orderLines: {
                    id: true,
                    variation: true,
                    quantity: true,
                    price: true,
                    productItemId: true,
                    productItem: {
                        id: true,
                        productId: true,
                        product: {
                            id: true,
                            name: true,
                            imageUrl: true,
                        },
                    },
                },
            },
            where: whereOptions,
            relations: {
                orderStatus: true,
                orderLines: {
                    productItem: {
                        product: true,
                    },
                },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách đơn hàng thành công',
            data: orders,
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
exports.getListByStatusId = getListByStatusId;
const getPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order, statusId, searchTerm } = req.query;
    try {
        let whereOptions = [];
        if (statusId && searchTerm) {
            whereOptions = [
                { orderStatusId: statusId, id: (0, typeorm_1.Like)(`%${searchTerm[0] === '#' ? searchTerm.split('#')[1] : searchTerm}%`) },
                { orderStatusId: statusId, fullName: (0, typeorm_1.Like)(`%${searchTerm}%`) },
                { orderStatusId: statusId, phoneNumber: (0, typeorm_1.Like)(`%${searchTerm}%`) },
            ];
        }
        else if (statusId) {
            whereOptions = [{ orderStatusId: statusId }];
        }
        else if (searchTerm) {
            whereOptions = [
                { id: (0, typeorm_1.Like)(`%${searchTerm[0] === '#' ? searchTerm.split('#')[1] : searchTerm}%`) },
                { fullName: (0, typeorm_1.Like)(`%${searchTerm}%`) },
                { phoneNumber: (0, typeorm_1.Like)(`%${searchTerm}%`) },
            ];
        }
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
                totalQuantity: true,
                totalPrice: true,
                orderStatusId: true,
                orderStatus: {
                    id: true,
                    name: true,
                },
                orderLines: {
                    id: true,
                    variation: true,
                    quantity: true,
                    price: true,
                    productItemId: true,
                    productItem: {
                        id: true,
                        productId: true,
                        product: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderCoupons: {
                    id: true,
                    code: true,
                    price: true,
                },
                shipMethodId: true,
                shipMethod: {
                    id: true,
                    name: true,
                    price: true,
                },
                paymentMethodId: true,
                paymentMethod: {
                    id: true,
                    name: true,
                },
                createdAt: true,
            },
            where: whereOptions,
            skip: _page * _limit,
            take: _limit,
            order: { [_sort]: _order },
            relations: {
                ward: true,
                district: true,
                province: true,
                orderStatus: true,
                orderLines: {
                    productItem: {
                        product: true,
                    },
                },
                orderCoupons: true,
                shipMethod: true,
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
const getOneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const order = yield Order_1.Order.findOne({
            where: { id },
            relations: {
                ward: true,
                district: true,
                province: true,
                orderLines: { productItem: { product: true } },
                orderCoupons: true,
                orderStatus: true,
                shipMethod: true,
                paymentMethod: true,
            },
        });
        if (!order) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Đơn hàng không tồn tại',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy đơn hàng thành công',
            data: order,
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
exports.getOneById = getOneById;
const addOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { lines, coupons } = _a, others = __rest(_a, ["lines", "coupons"]);
    const userId = req.userId;
    try {
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            let orderStatusId = others.orderStatusId;
            if (!orderStatusId) {
                const orderStatus = yield OrderStatus_1.OrderStatus.findOneBy({ name: 'Chờ xử lý' });
                if (!orderStatus) {
                    return res.status(500).json({
                        code: 500,
                        success: false,
                        message: `Lỗi server :: không tìm thấy trạng thái`,
                    });
                }
                orderStatusId = orderStatus.id;
            }
            const insertedOrder = yield transactionalEntityManager.insert(Order_1.Order, Object.assign(Object.assign({}, others), { userId,
                orderStatusId }));
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
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _c = req.body, { lines, coupons } = _c, others = __rest(_c, ["lines", "coupons"]);
    const userId = req.userId;
    try {
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            var _d;
            yield transactionalEntityManager.update(Order_1.Order, id, Object.assign(Object.assign({}, others), { userId }));
            if (lines.length > 0) {
                const oldOrderLines = yield OrderLine_1.OrderLine.find({
                    where: { orderId: id },
                    relations: {
                        productItem: {
                            inventory: true,
                        },
                    },
                });
                oldOrderLines.forEach((oldOrderLine) => __awaiter(void 0, void 0, void 0, function* () {
                    yield transactionalEntityManager.update(Inventory_1.Inventory, oldOrderLine.productItem.inventoryId, {
                        quantity: oldOrderLine.productItem.inventory.quantity + oldOrderLine.quantity,
                    });
                }));
                yield transactionalEntityManager.delete(OrderLine_1.OrderLine, { orderId: id });
                let lineData = [];
                for (let i = 0; i < lines.length; i++) {
                    lineData.push({
                        orderId: id,
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
                        quantity: ((_d = productItem === null || productItem === void 0 ? void 0 : productItem.inventory) === null || _d === void 0 ? void 0 : _d.quantity) - lines[i].quantity,
                    });
                }
                yield transactionalEntityManager.insert(OrderLine_1.OrderLine, lineData);
            }
            if (coupons && coupons.length > 0) {
                yield transactionalEntityManager.delete(OrderCoupon_1.OrderCoupon, { orderId: id });
                let couponData = [];
                for (let i = 0; i < coupons.length; i++) {
                    couponData.push({
                        orderId: id,
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
            message: 'Cập nhật đơn hàng thành công',
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
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { orderStatusId } = req.body;
    try {
        const order = yield Order_1.Order.findOneBy({ id });
        if (!order) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Đơn hàng không tồn tại',
            });
        }
        yield Order_1.Order.update(id, { orderStatusId });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật đơn hàng thành công',
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
exports.changeStatus = changeStatus;
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
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(OrderLine_1.OrderLine, { orderId: (0, typeorm_1.In)(ids) });
            yield transactionalEntityManager.delete(OrderCoupon_1.OrderCoupon, { orderId: (0, typeorm_1.In)(ids) });
            yield transactionalEntityManager.delete(Order_1.Order, { id: (0, typeorm_1.In)(ids) });
        }));
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
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(OrderLine_1.OrderLine, { orderId: id });
            yield transactionalEntityManager.delete(OrderCoupon_1.OrderCoupon, { orderId: id });
            yield transactionalEntityManager.delete(Order_1.Order, { id });
        }));
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
//# sourceMappingURL=orderController.js.map