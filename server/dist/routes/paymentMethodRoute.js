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
const paymentMethodController = __importStar(require("../controllers/paymentMethodController"));
const checkAuth_1 = require("../middlewares/checkAuth");
const checkPermission_1 = require("../middlewares/checkPermission");
const paymentMethodSchema_1 = __importDefault(require("../validations/paymentMethodSchema"));
const validateYup_1 = __importDefault(require("../middlewares/validateYup"));
const router = express_1.default.Router();
router.get('/pagination', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/payment-method/pagination', 'get'), paymentMethodController.getPagination);
router.get('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/payment-method', 'get'), paymentMethodController.getAll);
router.post('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/payment-method', 'post'), (0, validateYup_1.default)(paymentMethodSchema_1.default), paymentMethodController.addOne);
router.put('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/payment-method/:id', 'put'), (0, validateYup_1.default)(paymentMethodSchema_1.default), paymentMethodController.updateOne);
router.delete('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/payment-method', 'delete'), paymentMethodController.removeAny);
router.delete('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/payment-method/:id', 'delete'), paymentMethodController.removeOne);
exports.default = router;
//# sourceMappingURL=paymentMethodRoute.js.map