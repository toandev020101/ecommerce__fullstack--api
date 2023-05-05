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
exports.removeOne = exports.removeAny = exports.updateOne = exports.addOne = exports.getOneById = exports.getPagination = exports.getAll = exports.getListByCategorySlugPublic = void 0;
const typeorm_1 = require("typeorm");
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const Variation_1 = require("../models/Variation");
const VariationOption_1 = require("./../models/VariationOption");
const Category_1 = require("../models/Category");
const VariationCategory_1 = require("../models/VariationCategory");
const getListByCategorySlugPublic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categorySlug } = req.query;
    try {
        const category = yield Category_1.Category.findOneBy({ slug: categorySlug });
        if (!category) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Danh mục không tồn tại !',
            });
        }
        const variations = yield Variation_1.Variation.find({
            where: { variationCategories: { category: { slug: categorySlug } } },
            relations: { variationOptions: true },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả thuộc tính thành công',
            data: variations,
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
exports.getListByCategorySlugPublic = getListByCategorySlugPublic;
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const variations = yield Variation_1.Variation.find({ relations: { variationOptions: true } });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả thuộc tính thành công',
            data: variations,
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
const getPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order, searchTerm } = req.query;
    try {
        const variationRes = yield Variation_1.Variation.findAndCount({
            select: {
                id: true,
                name: true,
                slug: true,
                variationOptions: {
                    id: true,
                    value: true,
                },
            },
            where: [{ name: (0, typeorm_1.Like)(`%${searchTerm}%`) }, { slug: (0, typeorm_1.Like)(`%${searchTerm}%`) }],
            skip: _page * _limit,
            take: _limit,
            order: { [_sort]: _order },
            relations: {
                variationOptions: true,
                variationCategories: { category: true },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách thuộc tính thành công',
            data: variationRes[0],
            pagination: {
                _limit,
                _page,
                _total: variationRes[1],
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
        const variation = yield Variation_1.Variation.findOneBy({ id });
        if (!variation) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Thuộc tính không tồn tại!',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy thuộc tính thành công',
            data: variation,
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
    const data = req.body;
    const { categoryIds } = data, others = __rest(data, ["categoryIds"]);
    const { slug } = others;
    try {
        const variation = yield Variation_1.Variation.findOneBy({ slug });
        if (variation) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Thuộc tính đã tồn tại',
                errors: [{ field: 'slug', message: 'Thuộc tính đã tồn tại' }],
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const insertedVariation = yield transactionalEntityManager.insert(Variation_1.Variation, others);
            if (categoryIds.length > 0) {
                let variationCategoryData = [];
                for (let i = 0; i < categoryIds.length; i++) {
                    const category = yield Category_1.Category.findOneBy({ id: categoryIds[i] });
                    if (!category) {
                        return res.status(400).json({
                            code: 400,
                            success: false,
                            message: 'Thêm thuộc tính thất bại!',
                        });
                    }
                    variationCategoryData.push({
                        variationId: insertedVariation.raw.insertId,
                        categoryId: categoryIds[i],
                    });
                }
                yield transactionalEntityManager.insert(VariationCategory_1.VariationCategory, variationCategoryData);
            }
            return;
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm thuộc tính thành công',
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
    const _a = req.body, { categoryIds } = _a, others = __rest(_a, ["categoryIds"]);
    try {
        const variation = yield Variation_1.Variation.findOneBy({ id });
        if (!variation) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Thuộc tính không tồn tại',
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.update(Variation_1.Variation, id, others);
            if (categoryIds.length > 0) {
                let variationCategoryData = [];
                for (let i = 0; i < categoryIds.length; i++) {
                    const category = yield Category_1.Category.findOneBy({ id: categoryIds[i] });
                    if (!category) {
                        return res.status(400).json({
                            code: 400,
                            success: false,
                            message: 'Cập nhật thuộc tính thất bại!',
                        });
                    }
                    variationCategoryData.push({
                        variationId: id,
                        categoryId: categoryIds[i],
                    });
                }
                yield transactionalEntityManager.delete(VariationCategory_1.VariationCategory, { variationId: id });
                yield transactionalEntityManager.insert(VariationCategory_1.VariationCategory, variationCategoryData);
            }
            return;
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật thuộc tính thành công',
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
const removeAny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    try {
        for (let i = 0; i < ids.length; i++) {
            const variation = yield Variation_1.Variation.findOneBy({ id: ids[i] });
            if (!variation) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Thuộc tính không tồn tại',
                });
            }
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(VariationOption_1.VariationOption, { variationId: ids });
            yield transactionalEntityManager.delete(Variation_1.Variation, ids);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa danh sách thuộc tính thành công',
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
        const variation = yield Variation_1.Variation.findOneBy({ id });
        if (!variation) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Thuộc tính không tồn tại',
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(VariationOption_1.VariationOption, { variationId: id });
            yield transactionalEntityManager.delete(Variation_1.Variation, id);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa thuộc tính thành công',
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
//# sourceMappingURL=variationController.js.map