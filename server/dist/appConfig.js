"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const appConfig = (app) => {
    app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(express_1.default.json());
};
exports.default = appConfig;
//# sourceMappingURL=appConfig.js.map