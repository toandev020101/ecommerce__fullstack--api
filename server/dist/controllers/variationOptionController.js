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
exports.removeOne = exports.removeAny = exports.updateOne = exports.addOne = exports.getOneById = exports.getPaginationByVariationId = exports.getListBySearchTermAndVariationId = exports.getListByVariationId = void 0;
const ProductConfiguration_1 = require("./../models/ProductConfiguration");
const VariationOption_1 = require("./../models/VariationOption");
const typeorm_1 = require("typeorm");
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const getListByVariationId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { variationId } = req.params;
    try {
        const variationOptions = yield VariationOption_1.VariationOption.findBy({ variationId });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách chủng loại thành công',
            data: variationOptions,
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
exports.getListByVariationId = getListByVariationId;
const getListBySearchTermAndVariationId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { variationId } = req.params;
    const { searchTerm } = req.query;
    try {
        const variationOptions = yield VariationOption_1.VariationOption.findBy({
            variationId,
            value: (0, typeorm_1.Like)(`%${searchTerm.toLowerCase()}%`),
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách chủng loại thành công',
            data: variationOptions,
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
exports.getListBySearchTermAndVariationId = getListBySearchTermAndVariationId;
const getPaginationByVariationId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { variationId } = req.params;
    const { _limit, _page, _sort, _order, searchTerm } = req.query;
    try {
        const variationOptionRes = yield VariationOption_1.VariationOption.findAndCount({
            select: {
                id: true,
                value: true,
                slug: true,
            },
            where: [
                { variationId, value: (0, typeorm_1.Like)(`%${searchTerm.toLowerCase()}%`) },
                { variationId, slug: (0, typeorm_1.Like)(`%${searchTerm.toLowerCase()}%`) },
            ],
            skip: _page * _limit,
            take: _limit,
            order: { [_sort]: _order },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách chủng loại thành công',
            data: variationOptionRes[0],
            pagination: {
                _limit,
                _page,
                _total: variationOptionRes[1],
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
exports.getPaginationByVariationId = getPaginationByVariationId;
const getOneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const variationOption = yield VariationOption_1.VariationOption.findOneBy({ id });
        if (!variationOption) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Chủng loại không tồn tại!',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy chủng loại thành công',
            data: variationOption,
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
    const { slug } = data;
    try {
        const variation = yield VariationOption_1.VariationOption.findOneBy({ slug });
        if (variation) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Chủng loại đã tồn tại',
                errors: [{ field: 'slug', message: 'Chủng loại đã tồn tại' }],
            });
        }
        yield VariationOption_1.VariationOption.insert(data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm chủng loại thành công',
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
    try {
        const variationOption = yield VariationOption_1.VariationOption.findOneBy({ id });
        if (!variationOption) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Chủng loại không tồn tại',
            });
        }
        yield VariationOption_1.VariationOption.update(id, data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật chủng loại thành công',
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
            const variationOption = yield VariationOption_1.VariationOption.findOneBy({ id: ids[i] });
            if (!variationOption) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Chủng loại không tồn tại',
                });
            }
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(ProductConfiguration_1.ProductConfiguration, { variationOptionId: ids });
            yield transactionalEntityManager.delete(VariationOption_1.VariationOption, ids);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa danh sách chủng loại thành công',
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
        const variationOption = yield VariationOption_1.VariationOption.findOneBy({ id });
        if (!variationOption) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Chủng loại không tồn tại',
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(ProductConfiguration_1.ProductConfiguration, { variationOptionId: id });
            yield transactionalEntityManager.delete(VariationOption_1.VariationOption, id);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa chủng loại thành công',
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
//# sourceMappingURL=variationOptionController.js.map