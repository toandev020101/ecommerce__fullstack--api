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
const couponController = __importStar(require("../controllers/couponController"));
const checkAuth_1 = require("../middlewares/checkAuth");
const checkPermission_1 = require("../middlewares/checkPermission");
const validateYup_1 = __importDefault(require("../middlewares/validateYup"));
const couponSchema_1 = __importDefault(require("../validations/couponSchema"));
const router = express_1.default.Router();
router.get('', couponController.getAllPublic);
router.get('/pagination', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/coupon/pagination', 'get'), couponController.getPagination);
router.get('/:code', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/coupon/:code', 'get'), couponController.checkOne);
router.post('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/coupon', 'post'), (0, validateYup_1.default)(couponSchema_1.default), couponController.addOne);
router.put('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/coupon/:id', 'put'), (0, validateYup_1.default)(couponSchema_1.default), couponController.updateOne);
router.delete('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/coupon', 'delete'), couponController.removeAny);
router.delete('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/coupon/:id', 'delete'), couponController.removeOne);
exports.default = router;
//# sourceMappingURL=couponRoute.js.map