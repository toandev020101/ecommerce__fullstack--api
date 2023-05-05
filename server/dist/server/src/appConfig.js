"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const appConfig = (app) => {
    app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
    app.use((0, cookie_parser_1.default)());
    app.use(body_parser_1.default.json({ limit: '10mb' }));
    app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: true }));
    app.use(express_1.default.static('./uploads'));
};
exports.default = appConfig;
//# sourceMappingURL=appConfig.js.map