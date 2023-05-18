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
exports.removeOne = exports.removeAny = exports.changeActive = exports.updateOne = exports.addOne = exports.getOneAndParentById = exports.getPaginationAndParent = exports.getListBySearchTerm = exports.getListByParentSlugPublic = exports.getAll = exports.getAllPublic = void 0;
const typeorm_1 = require("typeorm");
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const Category_1 = require("./../models/Category");
const Product_1 = require("./../models/Product");
const getAllPublic = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.Category.find({ where: { isActive: 1, parentId: (0, typeorm_1.IsNull)() }, order: { level: 'ASC' } });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả danh mục thành công',
            data: categories,
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
exports.getAllPublic = getAllPublic;
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.Category.find();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả danh mục thành công',
            data: categories,
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
const getListByParentSlugPublic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { parentSlug } = req.query;
    try {
        const category = yield Category_1.Category.findOneBy({ slug: parentSlug });
        if (!category) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Danh mục không tồn tại !',
            });
        }
        const categories = yield Category_1.Category.find({
            where: { parent: { slug: parentSlug } },
            relations: { parent: true },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách danh mục thành công',
            data: categories,
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
exports.getListByParentSlugPublic = getListByParentSlugPublic;
const getListBySearchTerm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.query;
    try {
        const categories = yield Category_1.Category.findBy({ name: (0, typeorm_1.Like)(`%${searchTerm.toLowerCase()}%`) });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách danh mục thành công',
            data: categories,
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
const getPaginationAndParent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order, searchTerm } = req.query;
    try {
        const userRepository = AppDataSource_1.default.getRepository(Category_1.Category);
        const queryBuilder = userRepository.createQueryBuilder('category');
        queryBuilder.select([
            'category.id',
            'category.imageUrl',
            'category.name',
            'category.slug',
            'category.level',
            'category.isActive',
            'parent.id',
            'parent.name',
        ]);
        queryBuilder.leftJoin('category.parent', 'parent');
        if (searchTerm && searchTerm !== '') {
            queryBuilder
                .andWhere(`category.name like '%${searchTerm.toLowerCase()}%'`)
                .orWhere(`category.slug like '%${searchTerm.toLowerCase()}%'`);
        }
        if (_limit && _page) {
            queryBuilder.skip(_page * _limit);
            queryBuilder.take(_limit);
        }
        if (_sort && _order) {
            queryBuilder.orderBy(_sort === 'parentId' ? 'parent.name' : `category.${_sort}`, _order.toUpperCase());
        }
        const categories = yield queryBuilder.getMany();
        const total = yield queryBuilder.getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách danh mục thành công',
            data: categories,
            pagination: {
                _limit,
                _page,
                _total: total,
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
exports.getPaginationAndParent = getPaginationAndParent;
const getOneAndParentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const category = yield Category_1.Category.findOne({
            where: { id },
            relations: {
                categories: true,
            },
        });
        if (!category) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Danh mục không tồn tại!',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh mục thành công',
            data: category,
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
exports.getOneAndParentById = getOneAndParentById;
const addOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { slug } = data;
    try {
        const category = yield Category_1.Category.findOneBy({ slug });
        if (category) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Danh mục đã tồn tại',
                errors: [{ field: 'slug', message: 'Danh mục đã tồn tại' }],
            });
        }
        yield Category_1.Category.insert(data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm danh mục thành công',
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
        const category = yield Category_1.Category.findOneBy({ id });
        if (!category) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Danh mục không tồn tại',
            });
        }
        yield Category_1.Category.update(id, data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật danh mục thành công',
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
        const category = yield Category_1.Category.findOneBy({ id });
        if (!category) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Danh mục không tồn tại',
            });
        }
        yield Category_1.Category.update(id, data);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Cập nhật danh mục thành công',
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
            const category = yield Category_1.Category.findOneBy({ id: ids[i] });
            if (!category) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'Danh mục không tồn tại',
                });
            }
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const childs = yield Category_1.Category.findBy({ parentId: (0, typeorm_1.In)(ids) });
            const childIds = childs.map((child) => child.id);
            yield transactionalEntityManager.update(Product_1.Product, { categoryId: childIds }, { deleted: 1 });
            yield transactionalEntityManager.delete(Category_1.Category, { parentId: childIds });
            yield transactionalEntityManager.delete(Category_1.Category, ids);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa danh sách danh mục thành công',
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
        const category = yield Category_1.Category.findOneBy({ id });
        if (!category) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Danh mục không tồn tại',
            });
        }
        yield AppDataSource_1.default.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const childs = yield Category_1.Category.findBy({ parentId: id });
            const childIds = childs.map((child) => child.id);
            yield transactionalEntityManager.update(Product_1.Product, { categoryId: childIds }, { deleted: 1 });
            yield transactionalEntityManager.delete(Category_1.Category, { parentId: childIds });
            yield transactionalEntityManager.delete(Category_1.Category, id);
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa danh mục thành công',
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
//# sourceMappingURL=categoryController.js.map