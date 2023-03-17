"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFile = exports.saveFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const saveFile = (base64, name) => {
    const dataFile = base64.split(';')[0];
    const suffix = dataFile.split('/')[1];
    const pathFile = `/images/${Date.now()}_${name}.${suffix}`;
    const pathLocal = `../../../client/public/${pathFile}`;
    const buffer = Buffer.from(base64.split(',')[1], 'base64');
    try {
        fs_1.default.writeFileSync(path_1.default.join(__dirname, pathLocal), buffer);
    }
    catch (error) {
        console.error(error);
    }
    return pathFile;
};
exports.saveFile = saveFile;
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