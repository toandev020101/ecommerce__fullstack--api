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
exports.removeOne = exports.removeAny = exports.changeAttribute = exports.updateOne = exports.addOne = exports.addAny = exports.getOneById = exports.getOneBySlugPublic = exports.getPagination = exports.getPaginationByCategorySlugPublic = exports.getListByIds = exports.getListBySearchTerm = exports.getAll = void 0;
const typeorm_1 = require("typeorm");
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const Category_1 = require("../models/Category");
const Inventory_1 = require("../models/Inventory");
const ProductConfiguration_1 = require("../models/ProductConfiguration");
const ProductConnect_1 = require("../models/ProductConnect");
const ProductImage_1 = require("../models/ProductImage");
const ProductItem_1 = require("../models/ProductItem");
const ProductTag_1 = require("../models/ProductTag");
const Tag_1 = require("../models/Tag");
const VariationOption_1 = require("../models/VariationOption");
const Product_1 = require("./../models/Product");
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.Product.find({
            where: { deleted: 0, productItems: { deleted: 0 } },
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
        const products = yield Product_1.Product.findBy({ name: (0, typeorm_1.Like)(`%${searchTerm}%`), deleted: 0, productItems: { deleted: 0 } });
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
const getListByIds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.query;
    try {
        const products = yield Product_1.Product.find({
            where: { id: (0, typeorm_1.In)(ids), deleted: 0, productItems: { deleted: 0 } },
            relations: {
                productItems: {
                    inventory: true,
                },
            },
        });
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
exports.getListByIds = getListByIds;
const getPaginationByCategorySlugPublic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order, categorySlug, price, categoryFilters, variationFilters, statusFilters } = req.query;
    try {
        const category = yield Category_1.Category.findOneBy({ slug: categorySlug });
        if (!category) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Danh mục không tồn tại !',
            });
        }
        const productRepository = AppDataSource_1.default.getRepository(Product_1.Product);
        const queryBuilder = productRepository.createQueryBuilder('product');
        queryBuilder
            .select([
            'product.id',
            'product.name',
            'product.slug',
            'product.imageUrl',
            'product.isHot',
            'product.isActive',
            'product.createdAt',
            'category.id',
            'category.name',
            'category.slug',
            'productItems.id',
            'productItems.productId',
            'productItems.inventoryId',
            'productItems.price',
            'productItems.discount',
            'productItems.discountStartDate',
            'productItems.discountEndDate',
            'inventory.id',
            'inventory.quantity',
            'productConfigurations.id',
            'productConfigurations.variationOptionId',
            'variationOption.id',
            'variationOption.value',
            'variationOption.variationId',
        ])
            .leftJoin('product.category', 'category')
            .leftJoin('product.productItems', 'productItems')
            .leftJoin('productItems.inventory', 'inventory')
            .leftJoin('productItems.productConfigurations', 'productConfigurations', 'productConfigurations.productItemId = productItems.id')
            .leftJoin('productConfigurations.variationOption', 'variationOption')
            .where('category.slug = :categorySlug', { categorySlug })
            .andWhere('product.deleted = :deleted', { deleted: 0 })
            .andWhere('product.isActive = :isActive', { isActive: 1 })
            .andWhere('productItems.deleted = :deleted', { deleted: 0 });
        if (categoryFilters) {
            let queryString = '(';
            categoryFilters.forEach((categoryFilter, index) => {
                queryString += `category.id = ${categoryFilter}`;
                if (index !== categoryFilters.length - 1) {
                    queryString += ' or ';
                }
            });
            queryString += ')';
            queryBuilder.andWhere(queryString);
        }
        if (statusFilters) {
            statusFilters.forEach((statusFilter) => {
                if (statusFilter === 'isHot') {
                    queryBuilder.andWhere('product.isHot = :isHot', { isHot: 1 });
                }
            });
        }
        if (_sort === 'price') {
            queryBuilder.orderBy('productItems.price', _order.toUpperCase());
        }
        else {
            queryBuilder.orderBy(`product.${_sort}`, _order.toUpperCase());
        }
        const products = yield queryBuilder.getRawMany();
        let data = [];
        products.forEach((product) => {
            const dataIndex = data.findIndex((dataItem) => dataItem.id === product.product_id);
            if (dataIndex === -1) {
                data.push({
                    id: product.product_id,
                    name: product.product_name,
                    slug: product.product_slug,
                    imageUrl: product.product_imageUrl,
                    isHot: product.product_isHot,
                    isActive: product.product_isActive,
                    createdAt: product.product_createdAt,
                    category: {
                        id: product.category_id,
                        name: product.category_name,
                        slug: product.category_slug,
                    },
                    productItems: [
                        {
                            id: product.productItems_id,
                            price: product.productItems_price,
                            discount: product.productItems_discount,
                            discountStartDate: product.productItems_discountStartDate,
                            discountEndDate: product.productItems_discountEndDate,
                            inventoryId: product.productItems_inventoryId,
                            productId: product.productItems_productId,
                            inventory: {
                                id: product.inventory_id,
                                quantity: product.inventory_quantity,
                            },
                            productConfigurations: [
                                {
                                    id: product.productConfigurations_id,
                                    variationOptionId: product.productConfigurations_variationOptionId,
                                    variationOption: {
                                        id: product.variationOption_id,
                                        value: product.variationOption_value,
                                        variationId: product.variationOption_variationId,
                                    },
                                },
                            ],
                        },
                    ],
                });
            }
            else {
                const productItemIndex = data[dataIndex].productItems.findIndex((productItem) => productItem.id === product.productItems_id);
                if (productItemIndex === -1) {
                    data[dataIndex].productItems.push({
                        id: product.productItems_id,
                        price: product.productItems_price,
                        discount: product.productItems_discount,
                        discountStartDate: product.productItems_discountStartDate,
                        discountEndDate: product.productItems_discountEndDate,
                        inventoryId: product.productItems_inventoryId,
                        productId: product.productItems_productId,
                        inventory: {
                            id: product.inventory_id,
                            quantity: product.inventory_quantity,
                        },
                        productConfigurations: [
                            {
                                id: product.productConfigurations_id,
                                variationOptionId: product.productConfigurations_variationOptionId,
                                variationOption: {
                                    id: product.variationOption_id,
                                    value: product.variationOption_value,
                                    variationId: product.variationOption_variationId,
                                },
                            },
                        ],
                    });
                }
                else {
                    data[dataIndex].productItems[data[dataIndex].productItems.length - 1].productConfigurations.push({
                        id: product.productConfigurations_id,
                        variationOptionId: product.productConfigurations_variationOptionId,
                        variationOption: {
                            id: product.variationOption_id,
                            value: product.variationOption_value,
                            variationId: product.variationOption_variationId,
                        },
                    });
                }
            }
        });
        if (price) {
            const currentDate = new Date();
            const newData = [];
            data.forEach((product) => {
                const priceArr = product.productItems.map((productItem) => {
                    const discountStartDate = new Date(productItem.discountStartDate);
                    const discountEndDate = new Date(productItem.discountEndDate);
                    if (discountStartDate <= currentDate && discountEndDate >= currentDate) {
                        return productItem.discount;
                    }
                    return productItem.price;
                });
                priceArr.sort((price1, price2) => price2 - price1);
                if (priceArr[0] >= price.priceFrom && priceArr[0] <= price.priceTo) {
                    newData.push(product);
                }
            });
            data = newData;
        }
        if (variationFilters) {
            const newData = [];
            data.forEach((product) => {
                product.productItems.forEach((productItem) => {
                    productItem.productConfigurations.forEach((productConfiguration) => {
                        variationFilters.forEach((variationFilter) => {
                            if (productConfiguration.variationOption.variationId === parseInt(variationFilter.id) &&
                                variationFilter.values.includes(productConfiguration.variationOptionId.toString())) {
                                const newDataIndex = newData.findIndex((productData) => productData.id === product.id);
                                if (newDataIndex === -1) {
                                    newData.push(product);
                                }
                            }
                        });
                    });
                });
            });
            data = newData;
        }
        if (statusFilters) {
            statusFilters.forEach((statusFilter) => {
                if (statusFilter === 'inStock') {
                    const dataFilter = data.map((product) => {
                        let quantityTotal = 0;
                        product.productItems.forEach((productItem) => {
                            quantityTotal += productItem.inventory.quantity;
                        });
                        if (quantityTotal > 0)
                            return product;
                        return null;
                    });
                    data = dataFilter.filter((dataItem) => dataItem !== null);
                }
            });
        }
        const dataPagination = [];
        data.forEach((dataItem, index) => {
            const skip = _page * _limit;
            if (index >= skip && dataPagination.length < _limit) {
                dataPagination.push(dataItem);
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách sản phẩm thành công',
            data: dataPagination,
            pagination: {
                _limit,
                _page,
                _total: data.length,
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
exports.getPaginationByCategorySlugPublic = getPaginationByCategorySlugPublic;
const getPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order, categoryId, inventoryStatus, isActive, searchTerm } = req.query;
    try {
        const productRepository = AppDataSource_1.default.getRepository(Product_1.Product);
        const queryBuilder = productRepository.createQueryBuilder('product');
        queryBuilder
            .select([
            'product.id',
            'product.name',
            'product.slug',
            'product.imageUrl',
            'product.isHot',
            'product.isActive',
            'category.id',
            'category.name',
            'category.slug',
            'productTags.id',
            'productTags.productId',
            'productTags.tagId',
            'tag.id',
            'tag.name',
            'productItems.id',
            'productItems.productId',
            'productItems.inventoryId',
            'productItems.price',
            'productItems.discount',
            'productItems.discountStartDate',
            'productItems.discountEndDate',
            'inventory.id',
            'inventory.quantity',
        ])
            .leftJoin('product.category', 'category')
            .leftJoin('product.productTags', 'productTags')
            .leftJoin('productTags.tag', 'tag')
            .leftJoin('product.productItems', 'productItems', 'productItems.productId = product.id')
            .leftJoin('productItems.inventory', 'inventory')
            .where('product.deleted = :deleted', { deleted: 0 })
            .andWhere('productItems.deleted = :deleted', { deleted: 0 });
        if (categoryId && categoryId !== '') {
            queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
        }
        if (isActive && isActive !== '') {
            queryBuilder.andWhere('product.isActive = :isActive', { isActive });
        }
        if (searchTerm && searchTerm !== '') {
            queryBuilder.andWhere('product.name like :searchTerm OR product.slug like :searchTerm', { searchTerm });
        }
        if (_sort === 'price') {
            queryBuilder.orderBy('productItems.price', _order.toUpperCase());
        }
        else {
            queryBuilder.orderBy(`product.${_sort}`, _order.toUpperCase());
        }
        const products = yield queryBuilder.getRawMany();
        let data = [];
        products.forEach((product) => {
            const dataIndex = data.findIndex((dataItem) => dataItem.id === product.product_id);
            if (dataIndex === -1) {
                data.push({
                    id: product.product_id,
                    name: product.product_name,
                    slug: product.product_slug,
                    imageUrl: product.product_imageUrl,
                    isHot: product.product_isHot,
                    isActive: product.product_isActive,
                    category: {
                        id: product.category_id,
                        name: product.category_name,
                        slug: product.category_slug,
                    },
                    productTags: product.productTags_tagId
                        ? [
                            {
                                id: product.productTags_id,
                                productId: product.productTags_productId,
                                tagId: product.productTags_tagId,
                                tag: {
                                    id: product.tag_id,
                                    name: product.tag_name,
                                },
                            },
                        ]
                        : [],
                    productItems: [
                        {
                            id: product.productItems_id,
                            price: product.productItems_price,
                            discount: product.productItems_discount,
                            discountStartDate: product.productItems_discountStartDate,
                            discountEndDate: product.productItems_discountEndDate,
                            inventoryId: product.productItems_inventoryId,
                            productId: product.productItems_productId,
                            inventory: {
                                id: product.inventory_id,
                                quantity: product.inventory_quantity,
                            },
                        },
                    ],
                });
            }
            else {
                if (product.productTags_tagId) {
                    const productTagIndex = data[dataIndex].productTags.findIndex((productTag) => productTag.tagId === product.productTags_tagId);
                    if (productTagIndex === -1) {
                        data[dataIndex].productTags.push({
                            id: product.productTags_id,
                            productId: product.productTags_productId,
                            tagId: product.productTags_tagId,
                            tag: {
                                id: product.tag_id,
                                name: product.tag_name,
                            },
                        });
                    }
                }
                const productItemIndex = data[dataIndex].productItems.findIndex((productItem) => productItem.id === product.productItems_id);
                if (productItemIndex === -1) {
                    data[dataIndex].productItems.push({
                        id: product.productItems_id,
                        price: product.productItems_price,
                        discount: product.productItems_discount,
                        discountStartDate: product.productItems_discountStartDate,
                        discountEndDate: product.productItems_discountEndDate,
                        inventoryId: product.productItems_inventoryId,
                        productId: product.productItems_productId,
                        inventory: {
                            id: product.inventory_id,
                            quantity: product.inventory_quantity,
                        },
                    });
                }
            }
        });
        if (inventoryStatus && inventoryStatus !== '') {
            const dataFilter = data.map((product) => {
                let quantityTotal = 0;
                product.productItems.forEach((productItem) => {
                    quantityTotal += productItem.inventory.quantity;
                });
                if ((parseInt(inventoryStatus) === 1 && quantityTotal > 0) ||
                    (parseInt(inventoryStatus) === 0 && quantityTotal === 0))
                    return product;
                return null;
            });
            data = dataFilter.filter((dataItem) => dataItem !== null);
        }
        const dataPagination = [];
        data.forEach((dataItem, index) => {
            const skip = _page * _limit;
            if (index >= skip && dataPagination.length < _limit) {
                dataPagination.push(dataItem);
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách sản phẩm thành công',
            data: dataPagination,
            pagination: {
                _limit,
                _page,
                _total: data.length,
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
const getOneBySlugPublic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    try {
        const product = yield Product_1.Product.findOne({
            where: { slug, deleted: 0, productItems: { deleted: 0 } },
            relations: {
                category: true,
                productTags: { tag: true },
                productItems: {
                    inventory: true,
                    productConfigurations: {
                        variationOption: {
                            variation: true,
                        },
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
exports.getOneBySlugPublic = getOneBySlugPublic;
const getOneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield Product_1.Product.findOne({
            where: { id, deleted: 0, productItems: { deleted: 0 } },
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
                        const variationOption = yield VariationOption_1.VariationOption.findOneBy({ id: parseInt(variationOptionIds[j]) });
                        if (!variationOption) {
                            return res.status(400).json({
                                code: 400,
                                success: false,
                                message: 'Thêm danh sách sản phẩm thất bại!',
                            });
                        }
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
                    const product = yield Product_1.Product.findOneBy({ id: connectIds[i] });
                    if (!product) {
                        return res.status(400).json({
                            code: 400,
                            success: false,
                            message: 'Thêm sản phẩm thất bại!',
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
                            message: 'Thêm sản phẩm thất bại!',
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
                const _c = items[i], { idx, library, inventory } = _c, itemOthers = __rest(_c, ["idx", "library", "inventory"]);
                const insertedInventory = yield transactionalEntityManager.insert(Inventory_1.Inventory, inventory);
                const insertedProductItem = yield transactionalEntityManager.insert(ProductItem_1.ProductItem, Object.assign(Object.assign({}, itemOthers), { productId: insertedProduct.raw.insertId, inventoryId: insertedInventory.raw.insertId }));
                const variationOptionIds = idx.split('-');
                let productConfigurationData = [];
                for (let j = 0; j < variationOptionIds.length; j++) {
                    const variationOption = yield VariationOption_1.VariationOption.findOneBy({ id: parseInt(variationOptionIds[j]) });
                    if (!variationOption) {
                        return res.status(400).json({
                            code: 400,
                            success: false,
                            message: 'Thêm sản phẩm thất bại!',
                        });
                    }
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
            return;
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
                    const product = yield Product_1.Product.findOneBy({ id: connectIds[i] });
                    if (!product) {
                        return res.status(400).json({
                            code: 400,
                            success: false,
                            message: 'Cập nhật sản phẩm thất bại!',
                        });
                    }
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
                    const tag = yield Tag_1.Tag.findOneBy({ id: tagIds[i] });
                    if (!tag) {
                        return res.status(400).json({
                            code: 400,
                            success: false,
                            message: 'Cập nhật sản phẩm thất bại!',
                        });
                    }
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
            productItemIds.forEach((productItemId) => __awaiter(void 0, void 0, void 0, function* () {
                yield transactionalEntityManager.update(ProductItem_1.ProductItem, productItemId, { deleted: 1 });
            }));
            for (let i = 0; i < items.length; i++) {
                const _d = items[i], { idx, library, inventory } = _d, itemOthers = __rest(_d, ["idx", "library", "inventory"]);
                const insertedInventory = yield transactionalEntityManager.insert(Inventory_1.Inventory, inventory);
                const insertedProductItem = yield transactionalEntityManager.insert(ProductItem_1.ProductItem, Object.assign(Object.assign({}, itemOthers), { productId: id, inventoryId: insertedInventory.raw.insertId }));
                const variationOptionIds = idx.split('-');
                let productConfigurationData = [];
                for (let j = 0; j < variationOptionIds.length; j++) {
                    const variationOption = yield VariationOption_1.VariationOption.findOneBy({ id: parseInt(variationOptionIds[j]) });
                    if (!variationOption) {
                        return res.status(400).json({
                            code: 400,
                            success: false,
                            message: 'Cập nhật sản phẩm thất bại!',
                        });
                    }
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
            return;
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
const changeAttribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.changeAttribute = changeAttribute;
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