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
exports.removeOne = exports.removeAny = exports.updateOne = exports.addOne = exports.getOneById = exports.getPagination = exports.getListBySearchTerm = exports.getAll = void 0;
const typeorm_1 = require("typeorm");
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const ProductTag_1 = require("./../models/ProductTag");
const Tag_1 = require("./../models/Tag");
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield Tag_1.Tag.find();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả từ khóa thành công',
            data: tags,
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
        const tags = yield Tag_1.Tag.findBy({ name: (0, typeorm_1.Like)(`%${searchTerm}%`) });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách từ khóa thành công',
            data: tags,
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
    const { _limit, _page, _sort, _order, searchTerm } = req.query;
    try {
        const tagRes = yield Tag_1.Tag.findAndCount({
            where: { name: (0, typeorm_1.Like)(`%${searchTerm}%`) },
            skip: _page * _limit,
            take: _limit,
            order: { [_sort]: _order },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách từ khóa thành công',
            data: tagRes[0],
            pagination: {
                _limit,
                _page,
                _total: tagRes[1],
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
        const tag = yield Tag_1.Tag.findOneBy({ id });
        if (!tag) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Từ khóa không tồn tại!',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy từ khóa thành công',
            data: tag,
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
        const tag = yield Tag_1.Tag.findOneBy({ slug });
        if (tag) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Từ khóa đã tồn tại',
                errors: [{ field: 'slug', message: 'Từ khóa đã tồn tại' }],
            });
        }
        yield Tag_1.Tag.insert(data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm từ khóa thành công',
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
        const tag = yield Tag_1.Tag.findOneBy({ id });
        if (!tag) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Từ khóa không tồn tại',
            });
        }
        yield Tag_1.Tag.update(id, data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật từ khóa thành công',
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
            const tag = yield Tag_1.Tag.findOneBy({ id: ids[i] });
            if (!tag) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Từ khóa không tồn tại',
                });
            }
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(ProductTag_1.ProductTag, { tagId: ids });
            yield transactionalEntityManager.delete(Tag_1.Tag, ids);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa danh sách từ khóa thành công',
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
        const tag = yield Tag_1.Tag.findOneBy({ id });
        if (!tag) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Từ khóa không tồn tại',
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionalEntityManager.delete(ProductTag_1.ProductTag, { tagId: id });
            yield transactionalEntityManager.delete(Tag_1.Tag, id);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa từ khóa thành công',
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
//# sourceMappingURL=tagController.js.map