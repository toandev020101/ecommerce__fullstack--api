"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const removeFile = (pathFile) => {
    const pathLocal = '../../' + pathFile;
    try {
        fs_1.default.unlinkSync(path_1.default.join(__dirname, pathLocal));
    }
    catch (error) {
        console.error(error);
    }
};
exports.removeFile = removeFile;
//# sourceMappingURL=file.js.map