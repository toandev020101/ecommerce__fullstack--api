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
exports.removeOne = exports.removeAny = exports.changeActive = exports.updateOne = exports.addOne = exports.addAny = exports.getOneById = exports.getPagination = exports.getListBySearchTerm = exports.getAll = void 0;
const typeorm_1 = require("typeorm");
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const Inventory_1 = require("../models/Inventory");
const ProductConfiguration_1 = require("../models/ProductConfiguration");
const ProductConnect_1 = require("../models/ProductConnect");
const ProductImage_1 = require("../models/ProductImage");
const ProductItem_1 = require("../models/ProductItem");
const ProductTag_1 = require("../models/ProductTag");
const Product_1 = require("./../models/Product");
const Category_1 = require("../models/Category");
const Tag_1 = require("../models/Tag");
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.Product.find({
            where: { deleted: 0 },
            relations: {
                category: true,
                productItems: {
                    inventory: true,
                    productImages: true,
                },
                productTags: { tag: true },
                productConnects: true,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả sản phẩm thành công',
            data: products,
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
const getListBySearchTerm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.query;
    try {
        const products = yield Product_1.Product.findBy({ name: (0, typeorm_1.Like)(`%${searchTerm}%`), deleted: 0 });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách sản phẩm thành công',
            data: products,
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
exports.getListBySearchTerm = getListBySearchTerm;
const getPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order, categoryId, inventoryStatus, isActive, searchTerm } = req.query;
    try {
        let whereOptions = [
            { name: (0, typeorm_1.Like)(`%${searchTerm}%`), deleted: 0 },
            { slug: (0, typeorm_1.Like)(`%${searchTerm}%`), deleted: 0 },
        ];
        if (categoryId && categoryId !== '') {
            whereOptions = whereOptions.map((option) => (Object.assign(Object.assign({}, option), { categoryId })));
        }
        if (isActive && isActive !== '') {
            whereOptions = whereOptions.map((option) => (Object.assign(Object.assign({}, option), { isActive })));
        }
        const productRes = yield Product_1.Product.findAndCount({
            select: {
                id: true,
                name: true,
                slug: true,
                imageUrl: true,
                isActive: true,
                category: {
                    id: true,
                    name: true,
                    slug: true,
                },
                productTags: {
                    id: true,
                    productId: true,
                    tagId: true,
                    tag: {
                        id: true,
                        name: true,
                    },
                },
                productItems: {
                    id: true,
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
                },
            },
            where: whereOptions,
            skip: _page * _limit,
            take: _limit,
            order: _sort === 'price' ? {} : { [_sort]: _order },
            relations: {
                category: true,
                productTags: { tag: true },
                productItems: {
                    inventory: true,
                },
            },
        });
        let data = productRes[0];
        if (inventoryStatus && inventoryStatus !== '') {
            data = productRes[0].map((product) => {
                let quantityTotal = 0;
                product.productItems.forEach((productItem) => {
                    quantityTotal += productItem.inventory.quantity;
                });
                if ((parseInt(inventoryStatus) === 1 && quantityTotal > 0) ||
                    (parseInt(inventoryStatus) === 0 && quantityTotal === 0))
                    return product;
                return null;
            });
            data = data.filter((dataItem) => dataItem !== null);
        }
        if (_sort === 'price') {
            data.sort((data1, data2) => (_order === 'asc' ? data1 : data2).productItems.sort((productItem1, productItem2) => (_order === 'asc' ? productItem1 : productItem2).price -
                (_order === 'asc' ? productItem2 : productItem1).price)[0].price -
                (_order === 'asc' ? data2 : data1).productItems.sort((productItem1, productItem2) => (_order === 'asc' ? productItem1 : productItem2).price -
                    (_order === 'asc' ? productItem2 : productItem1).price)[0].price);
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách sản phẩm thành công',
            data,
            pagination: {
                _limit,
                _page,
                _total: productRes[1],
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
        const product = yield Product_1.Product.findOne({
            where: { id, deleted: 0 },
            relations: {
                category: true,
                productTags: { tag: true },
                productItems: {
                    inventory: true,
                    productConfigurations: {
                        variationOption: true,
                    },
                    productImages: true,
                },
                productConnects: { connect: true },
            },
        });
        if (!product) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Sản phẩm không tồn tại!',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy sản phẩm thành công',
            data: product,
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
const addAny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            for (let i = 0; i < data.length; i++) {
                const _a = data[i], { items, connectIds, tagIds } = _a, others = __rest(_a, ["items", "connectIds", "tagIds"]);
                const { slug, categoryId } = others;
                const category = yield Category_1.Category.findOneBy({ id: categoryId });
                if (!category) {
                    return res.status(400).json({
                        code: 400,
                        success: false,
                        message: 'Thêm danh sách sản phẩm thất bại!',
                    });
                }
                const product = yield Product_1.Product.findOneBy({ slug });
                if (product) {
                    return res.status(400).json({
                        code: 400,
                        success: false,
                        message: 'Sản phẩm đã tồn tại',
                        errors: [{ field: 'slug', message: 'Sản phẩm đã tồn tại' }],
                    });
                }
                const insertedProduct = yield transactionalEntityManager.insert(Product_1.Product, others);
                if (connectIds.length > 0) {
                    let productConnectData = [];
                    for (let i = 0; i < connectIds.length; i++) {
                        const product = yield Product_1.Product.findOneBy({ id: connectIds[i] });
                        if (!product) {
                            return res.status(400).json({
                                code: 400,
                                success: false,
                                message: 'Thêm danh sách sản phẩm thất bại!',
                            });
                        }
                        productConnectData.push({
                            productId: insertedProduct.raw.insertId,
                            connectId: connectIds[i],
                        });
                    }
                    yield transactionalEntityManager.insert(ProductConnect_1.ProductConnect, productConnectData);
                }
                if (tagIds.length > 0) {
                    let tagData = [];
                    for (let i = 0; i < tagIds.length; i++) {
                        const tag = yield Tag_1.Tag.findOneBy({ id: tagIds[i] });
                        if (!tag) {
                            return res.status(400).json({
                                code: 400,
                                success: false,
                                message: 'Thêm danh sách sản phẩm thất bại!',
                            });
                        }
                        tagData.push({
                            productId: insertedProduct.raw.insertId,
                            tagId: tagIds[i],
                        });
                    }
                    yield transactionalEntityManager.insert(ProductTag_1.ProductTag, tagData);
                }
                for (let i = 0; i < items.length; i++) {
                    const _b = items[i], { idx, library, inventory } = _b, itemOthers = __rest(_b, ["idx", "library", "inventory"]);
                    const insertedInventory = yield transactionalEntityManager.insert(Inventory_1.Inventory, inventory);
                    const insertedProductItem = yield transactionalEntityManager.insert(ProductItem_1.ProductItem, Object.assign(Object.assign({}, itemOthers), { productId: insertedProduct.raw.insertId, inventoryId: insertedInventory.raw.insertId }));
                    const variationOptionIds = idx.split('-');
                    let productConfigurationData = [];
                    for (let j = 0; j < variationOptionIds.length; j++) {
                        productConfigurationData.push({
                            productItemId: insertedProductItem.raw.insertId,
                            variationOptionId: parseInt(variationOptionIds[j]),
                        });
                    }
                    yield transactionalEntityManager.insert(ProductConfiguration_1.ProductConfiguration, productConfigurationData);
                    let productImageData = [];
                    for (let j = 0; j < library.length; j++) {
                        productImageData.push({
                            productItemId: insertedProductItem.raw.insertId,
                            imageUrl: library[j],
                        });
                    }
                    yield transactionalEntityManager.insert(ProductImage_1.ProductImage, productImageData);
                }
            }
            return;
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
    const { items, connectIds, tagIds } = data, others = __rest(data, ["items", "connectIds", "tagIds"]);
    const { slug } = others;
    try {
        const product = yield Product_1.Product.findOneBy({ slug });
        if (product) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Sản phẩm đã tồn tại',
                errors: [{ field: 'slug', message: 'Sản phẩm đã tồn tại' }],
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const insertedProduct = yield transactionalEntityManager.insert(Product_1.Product, others);
            if (connectIds.length > 0) {
                let productConnectData = [];
                for (let i = 0; i < connectIds.length; i++) {
                    productConnectData.push({
                        productId: insertedProduct.raw.insertId,
                        connectId: connectIds[i],
                    });
                }
                yield transactionalEntityManager.insert(ProductConnect_1.ProductConnect, productConnectData);
            }
            if (tagIds.length > 0) {
                let tagData = [];
                for (let i = 0; i < tagIds.length; i++) {
                    tagData.push({
                        productId: insertedProduct.raw.insertId,
                        tagId: tagIds[i],
                    });
                }
                yield transactionalEntityManager.insert(ProductTag_1.ProductTag, tagData);
            }
            for (let i = 0; i < items.length; i++) {
                const _c = items[i], { idx, library, inventory } = _c, itemOthers = __rest(_c, ["idx", "library", "inventory"]);
                const insertedInventory = yield transactionalEntityManager.insert(Inventory_1.Inventory, inventory);
                const insertedProductItem = yield transactionalEntityManager.insert(ProductItem_1.ProductItem, Object.assign(Object.assign({}, itemOthers), { productId: insertedProduct.raw.insertId, inventoryId: insertedInventory.raw.insertId }));
                const variationOptionIds = idx.split('-');
                let productConfigurationData = [];
                for (let j = 0; j < variationOptionIds.length; j++) {
                    productConfigurationData.push({
                        productItemId: insertedProductItem.raw.insertId,
                        variationOptionId: parseInt(variationOptionIds[j]),
                    });
                }
                yield transactionalEntityManager.insert(ProductConfiguration_1.ProductConfiguration, productConfigurationData);
                let productImageData = [];
                for (let j = 0; j < library.length; j++) {
                    productImageData.push({
                        productItemId: insertedProductItem.raw.insertId,
                        imageUrl: library[j],
                    });
                }
                yield transactionalEntityManager.insert(ProductImage_1.ProductImage, productImageData);
            }
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm sản phẩm thành công',
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
    const data = req.body;
    const { items, connectIds, tagIds } = data, others = __rest(data, ["items", "connectIds", "tagIds"]);
    console.log(data);
    try {
        const product = yield Product_1.Product.findOneBy({ id });
        if (!product) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Sản phẩm không tồn tại',
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.update(Product_1.Product, id, others);
            if (connectIds.length > 0) {
                let productConnectData = [];
                for (let i = 0; i < connectIds.length; i++) {
                    productConnectData.push({
                        productId: id,
                        connectId: connectIds[i],
                    });
                }
                yield transactionalEntityManager.delete(ProductConnect_1.ProductConnect, { productId: id });
                yield transactionalEntityManager.insert(ProductConnect_1.ProductConnect, productConnectData);
            }
            if (tagIds.length > 0) {
                let tagData = [];
                for (let i = 0; i < tagIds.length; i++) {
                    tagData.push({
                        productId: id,
                        tagId: tagIds[i],
                    });
                }
                yield transactionalEntityManager.delete(ProductTag_1.ProductTag, { productId: id });
                yield transactionalEntityManager.insert(ProductTag_1.ProductTag, tagData);
            }
            const productItems = yield ProductItem_1.ProductItem.findBy({ productId: id });
            const productItemIds = productItems.map((productItem) => productItem.id);
            yield transactionalEntityManager.delete(ProductConfiguration_1.ProductConfiguration, { productItemId: (0, typeorm_1.In)(productItemIds) });
            yield transactionalEntityManager.delete(ProductImage_1.ProductImage, { productItemId: (0, typeorm_1.In)(productItemIds) });
            const inventoryIds = productItems.map((productItem) => productItem.inventoryId);
            yield transactionalEntityManager.delete(ProductItem_1.ProductItem, { productId: id });
            yield transactionalEntityManager.delete(Inventory_1.Inventory, { id: (0, typeorm_1.In)(inventoryIds) });
            for (let i = 0; i < items.length; i++) {
                const _d = items[i], { idx, library, inventory } = _d, itemOthers = __rest(_d, ["idx", "library", "inventory"]);
                const insertedInventory = yield transactionalEntityManager.insert(Inventory_1.Inventory, inventory);
                const insertedProductItem = yield transactionalEntityManager.insert(ProductItem_1.ProductItem, Object.assign(Object.assign({}, itemOthers), { productId: id, inventoryId: insertedInventory.raw.insertId }));
                const variationOptionIds = idx.split('-');
                let productConfigurationData = [];
                for (let j = 0; j < variationOptionIds.length; j++) {
                    productConfigurationData.push({
                        productItemId: insertedProductItem.raw.insertId,
                        variationOptionId: parseInt(variationOptionIds[j]),
                    });
                }
                yield transactionalEntityManager.insert(ProductConfiguration_1.ProductConfiguration, productConfigurationData);
                let productImageData = [];
                for (let j = 0; j < library.length; j++) {
                    productImageData.push({
                        productItemId: insertedProductItem.raw.insertId,
                        imageUrl: library[j],
                    });
                }
                yield transactionalEntityManager.insert(ProductImage_1.ProductImage, productImageData);
            }
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
exports.updateOne = updateOne;
const changeActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    try {
        const product = yield Product_1.Product.findOneBy({ id });
        if (!product) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Sản phẩm không tồn tại',
            });
        }
        yield Product_1.Product.update(id, data);
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
exports.changeActive = changeActive;
const removeAny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    try {
        for (let i = 0; i < ids.length; i++) {
            const product = yield Product_1.Product.findOneBy({ id: ids[i] });
            if (!product) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Sản phẩm không tồn tại',
                });
            }
        }
        yield Product_1.Product.update(ids, { deleted: 1 });
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
        const product = yield Product_1.Product.findOneBy({ id });
        if (!product) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Sản phẩm không tồn tại',
            });
        }
        yield Product_1.Product.update(id, { deleted: 1 });
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
//# sourceMappingURL=productController.js.map