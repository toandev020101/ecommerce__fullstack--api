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
const reviewSchema_1 = __importDefault(require("../validations/reviewSchema"));
const reviewController = __importStar(require("../controllers/reviewController"));
const router = express_1.default.Router();
router.get('/pagination/:productId', reviewController.getPaginationByProductId);
router.get('/pagination', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/review/pagination', 'get'), reviewController.getPagination);
router.get('/product/:productId', reviewController.getListByProductId);
router.get('/order-line/:orderLinedId', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/review/order-line/:orderLinedId', 'get'), reviewController.getOneByOrderLinedId);
router.get('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/review/:id', 'get'), reviewController.getOneById);
router.post('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/review', 'post'), (0, validateYup_1.default)(reviewSchema_1.default), reviewController.addOne);
router.patch('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/review/:id', 'patch'), reviewController.changeStatus);
router.put('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/review/:id', 'put'), (0, validateYup_1.default)(reviewSchema_1.default), reviewController.updateOne);
router.delete('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/review', 'delete'), reviewController.removeAny);
router.delete('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/review/:id', 'delete'), reviewController.removeOne);
exports.default = router;
//# sourceMappingURL=reviewRoute.js.map