"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkPermission_1 = require("./../middlewares/checkPermission");
const checkAuth_1 = require("./../middlewares/checkAuth");
const express_1 = __importDefault(require("express"));
const mediaController = __importStar(require("../controllers/mediaController"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, './uploads');
    },
    filename: function (_req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});
const fileFilter = function (_req, file, cb) {
    if (file.mimetype.startsWith('image/') | file.mimetype.startsWith('video/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed!'), false);
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
router.get('/pagination/user', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/media/pagination/user', 'get'), mediaController.getPaginationAndUser);
router.get('/date', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/media/date', 'get'), mediaController.getAllDate);
router.post('/any', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/media/any', 'post'), upload.array('files'), mediaController.addAny);
router.post('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/media', 'post'), upload.single('file'), mediaController.addOne);
router.delete('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/media', 'delete'), mediaController.removeAny);
exports.default = router;
//# sourceMappingURL=mediaRoute.js.map