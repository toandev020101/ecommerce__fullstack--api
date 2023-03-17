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
exports.removeAny = exports.addAny = exports.getAllDate = exports.getPaginationAndUser = void 0;
const file_1 = require("./../utils/file");
const AppDataSource_1 = __importDefault(require("../AppDataSource"));
const Media_1 = require("./../models/Media");
const typeorm_1 = require("typeorm");
const getPaginationAndUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _limit, _page, _sort, _order, type, date, searchTerm } = req.query;
    try {
        const userRepository = AppDataSource_1.default.getRepository(Media_1.Media);
        const queryBuilder = userRepository.createQueryBuilder('media');
        queryBuilder.select([
            'media.id',
            'media.fileUrl',
            'media.name',
            'media.mimetype',
            'media.size',
            'media.path',
            'media.createdAt',
            'user.id',
            'user.username',
        ]);
        queryBuilder.leftJoin('media.user', 'user');
        if (type && type !== '') {
            queryBuilder.andWhere(`media.type = ${type}`);
        }
        if (date && date !== '') {
            const newDate = new Date(date);
            queryBuilder.andWhere(`MONTH(media.createdAt) = ${newDate.getMonth() + 1} AND YEAR(media.createdAt) = ${newDate.getFullYear()}`);
        }
        if (searchTerm && searchTerm !== '') {
            queryBuilder.andWhere(`media.name like '%${searchTerm}%'`);
        }
        if (_limit && _page) {
            queryBuilder.take((_page + 1) * _limit);
        }
        if (_sort && _order) {
            queryBuilder.orderBy(`media.${_sort}`, _order.toUpperCase());
        }
        const medias = yield queryBuilder.getMany();
        const total = yield queryBuilder.getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy danh sách file thành công',
            data: medias,
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
exports.getPaginationAndUser = getPaginationAndUser;
const getAllDate = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medias = yield Media_1.Media.find({ select: { createdAt: true } });
        let dates = [];
        for (let i = 0; i < medias.length; i++) {
            dates.push(medias[i].createdAt);
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Lấy tất cả ngày thành công',
            data: dates,
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
exports.getAllDate = getAllDate;
const addAny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: `Thêm danh sách file media thất bại`,
        });
    }
    let medias = [];
    for (let i = 0; i < files.length; i++) {
        medias.push({
            fileUrl: `http://localhost:4000/${files[i].filename}`,
            name: files[i].filename,
            mimetype: files[i].mimetype,
            size: `${Math.floor(files[i].size / 1024)} kb`,
            type: files[i].mimetype.split('/')[0] === 'image' ? 0 : 1,
            path: files[i].path,
            userId: req.userId,
        });
    }
    try {
        yield Media_1.Media.insert(medias);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Thêm danh sách file media thành công',
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
const removeAny = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    try {
        for (let i = 0; i < ids.length; i++) {
            const media = yield Media_1.Media.findOneBy({ id: ids[i] });
            if (!media) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: 'File media không tồn tại',
                });
            }
        }
        const medias = yield Media_1.Media.findBy({ id: (0, typeorm_1.In)(ids) });
        yield Media_1.Media.delete(ids);
        for (let i = 0; i < medias.length; i++) {
            (0, file_1.removeFile)(medias[i].path);
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Xóa file media thành công',
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
//# sourceMappingURL=mediaController.js.map