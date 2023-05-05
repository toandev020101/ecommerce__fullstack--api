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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOne = exports.removeAny = exports.changeQuantity = exports.changeProductItem = exports.addOne = exports.addAny = exports.getAll = void 0;
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const CartItem_1 = require("./../models/CartItem");
const ProductItem_1 = require("./../models/ProductItem");
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const cartItems = yield CartItem_1.CartItem.find({
            select: {
                id: true,
                quantity: true,
                productItemId: true,
                userId: true,
                productItem: {
                    id: true,
                    SKU: true,
                    imageUrl: true,
                    productId: true,
                    inventoryId: true,
                    price: true,
                    discount: true,
                    discountStartDate: true,
                    discountEndDate: true,
                    product: {
                        id: true,
                        name: true,
                        slug: true,
                        category: {
                            id: true,
                            slug: true,
                        },
                        productItems: {
                            id: true,
                            SKU: true,
                            imageUrl: true,
                            productId: true,
                            inventoryId: true,
                            price: true,
                            discount: true,
                            discountStartDate: true,
                            discountEndDate: true,
                            inventory: {
                                id: true,
                                quantity: true,
                            },
                            productConfigurations: {
                                id: true,
                                variationOption: {
                                    id: true,
                                    value: true,
                                    slug: true,
                                    variationId: true,
                                    variation: {
                                        id: true,
                                        name: true,
                                        slug: true,
                                    },
                                },
                            },
                        },
                    },
                    inventory: {
                        id: true,
                        quantity: true,
                    },
                    productConfigurations: {
                        id: true,
                        variationOption: {
                            id: true,
                            value: true,
                            slug: true,
                            variationId: true,
                            variation: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
            where: { userId },
            relations: {
                productItem: {
                    product: {
                        category: true,
                        productItems: {
                            inventory: true,
                            productConfigurations: {
                                variationOption: { variation: true },
                            },
                        },
                    },
                    inventory: true,
                    productConfigurations: {
                        variationOption: { variation: true },
                    },
                },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả sản phẩm thành công',
            data: cartItems,
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
exports.getAll = getAll;
const addAny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const userId = req.userId;
    try {
        data.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            const { quantity, productItemId } = item;
            const cartItem = yield CartItem_1.CartItem.findOneBy({ userId, productItemId });
            if (cartItem) {
                yield CartItem_1.CartItem.update({ userId, productItemId }, { quantity: quantity + cartItem.quantity });
            }
            else {
                yield CartItem_1.CartItem.insert(Object.assign(Object.assign({}, item), { userId }));
            }
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm danh sách sản phẩm thành công',
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
exports.addAny = addAny;
const addOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { quantity, productItemId } = data;
    const userId = req.userId;
    try {
        const cartItem = yield CartItem_1.CartItem.findOneBy({ userId, productItemId });
        if (cartItem) {
            yield CartItem_1.CartItem.update({ userId, productItemId }, { quantity: quantity + cartItem.quantity });
        }
        else {
            yield CartItem_1.CartItem.insert(Object.assign(Object.assign({}, data), { userId }));
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm sản phẩm vào giỏ hàng thành công',
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
const changeProductItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { productItemId } = req.body;
    const userId = req.userId;
    try {
        const cartItem = yield CartItem_1.CartItem.findOneBy({ id });
        if (!cartItem) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Sản phẩm không tồn tại',
            });
        }
        let data = { quantity: cartItem.quantity, productItemId };
        const productItem = yield ProductItem_1.ProductItem.findOneBy({ id: productItemId });
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const cartItemCheck = yield CartItem_1.CartItem.findOneBy({ productItemId, userId });
            if (cartItemCheck) {
                data.quantity += cartItemCheck.quantity;
            }
            if (((_a = productItem === null || productItem === void 0 ? void 0 : productItem.inventory) === null || _a === void 0 ? void 0 : _a.quantity) < data.quantity) {
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Cập nhật sản phẩm thất bại',
                });
            }
            if (cartItemCheck) {
                yield transactionalEntityManager.delete(CartItem_1.CartItem, cartItemCheck.id);
            }
            yield transactionalEntityManager.update(CartItem_1.CartItem, id, data);
            return null;
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật sản phẩm thành công',
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
exports.changeProductItem = changeProductItem;
const changeQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    try {
        const cartItem = yield CartItem_1.CartItem.findOneBy({ id });
        if (!cartItem) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Sản phẩm không tồn tại',
            });
        }
        yield CartItem_1.CartItem.update(id, data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật sản phẩm thành công',
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
exports.changeQuantity = changeQuantity;
const removeAny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    try {
        for (let i = 0; i < ids.length; i++) {
            const cartItem = yield CartItem_1.CartItem.findOneBy({ id: ids[i] });
            if (!cartItem) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Sản phẩm không tồn tại',
                });
            }
        }
        yield CartItem_1.CartItem.delete(ids);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa danh sách sản phẩm thành công',
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
        const cartItem = yield CartItem_1.CartItem.findOneBy({ id });
        if (!cartItem) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Sản phẩm không tồn tại',
            });
        }
        yield CartItem_1.CartItem.delete(id);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa sản phẩm thành công',
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
//# sourceMappingURL=cartItemController.js.map