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
const checkAuth_1 = require("../middlewares/checkAuth");
const express_1 = __importDefault(require("express"));
const permissionController = __importStar(require("../controllers/permissionController"));
const validateYup_1 = __importDefault(require("../middlewares/validateYup"));
const permissionSchema_1 = __importDefault(require("../validations/permissionSchema"));
const router = express_1.default.Router();
router.get('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/permission', 'get'), permissionController.getAll);
router.get('/pagination/role', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/permission/pagination/role', 'get'), permissionController.getPaginationAndRole);
router.post('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/permission', 'post'), (0, validateYup_1.default)(permissionSchema_1.default), permissionController.addOne);
router.put('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/permission/:id', 'put'), (0, validateYup_1.default)(permissionSchema_1.default), permissionController.updateOne);
router.delete('', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/permission', 'delete'), permissionController.removeAny);
router.delete('/:id', checkAuth_1.checkAuth, (0, checkPermission_1.checkPermission)('/permission/:id', 'delete'), permissionController.removeOne);
exports.default = router;
//# sourceMappingURL=permissionRoute.js.map