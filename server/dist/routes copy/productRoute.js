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
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middlewares/checkAuth");
const checkPermission_1 = require("../middlewares/checkPermission");
const validateYup_1 = __importDefault(require("../middlewares/validateYup"));
const yup = __importStar(require("yup"));
const productSchema_1 = __importDefault(require("../validations/productSchema"));
const productController = __importStar(require("../controllers/productController"));
const router = express_1.default.Router();
router.get('/pagination/public', productController.getPaginationByCategorySlugPublic);
router.get('/pagination', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/product/pagination', 'get'), productController.getPagination);
router.get('/search', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/product/search', 'get'), productController.getListBySearchTerm);
router.get('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/product', 'get'), productController.getAll);
router.get('/:slug/public', productController.getOneBySlugPublic);
router.get('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/product/:id', 'get'), productController.getOneById);
router.post('/any', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/product/any', 'post'), (0, validateYup_1.default)(yup.array().of(productSchema_1.default)), productController.addAny);
router.post('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/product', 'post'), (0, validateYup_1.default)(productSchema_1.default), productController.addOne);
router.put('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/product/:id', 'put'), (0, validateYup_1.default)(productSchema_1.default), productController.updateOne);
router.patch('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/product/:id', 'patch'), productController.changeAttribute);
router.delete('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/product', 'delete'), productController.removeAny);
router.delete('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/product/:id', 'delete'), productController.removeOne);
exports.default = router;
//# sourceMappingURL=productRoute.js.map