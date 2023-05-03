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
const variationSchema_1 = __importDefault(require("../validations/variationSchema"));
const checkAuth_1 = require("../middlewares/checkAuth");
const checkPermission_1 = require("../middlewares/checkPermission");
const validateYup_1 = __importDefault(require("../middlewares/validateYup"));
const variationOptionController = __importStar(require("../controllers/variationOptionController"));
const router = express_1.default.Router();
router.get('/pagination/:variationId', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/variation-option/pagination/:variationId', 'get'), variationOptionController.getPaginationByVariationId);
router.get('/:variationId/search', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/variation-option/:variationId/search', 'get'), variationOptionController.getListBySearchTermAndVariationId);
router.get('/:variationId', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/variation-option/:variationId', 'get'), variationOptionController.getListByVariationId);
router.get('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/variation-option/:id', 'get'), variationOptionController.getOneById);
router.post('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/variation-option', 'post'), (0, validateYup_1.default)(variationSchema_1.default), variationOptionController.addOne);
router.put('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/variation-option/:id', 'put'), (0, validateYup_1.default)(variationSchema_1.default), variationOptionController.updateOne);
router.delete('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/variation-option', 'delete'), variationOptionController.removeAny);
router.delete('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/variation-option/:id', 'delete'), variationOptionController.removeOne);
exports.default = router;
//# sourceMappingURL=variationOptionRoute.js.map