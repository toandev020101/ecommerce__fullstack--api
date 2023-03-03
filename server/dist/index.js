"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const AppDataSource_1 = __importDefault(require("./AppDataSource"));
const appConfig_1 = __importDefault(require("./appConfig"));
const appRouter_1 = __importDefault(require("./appRouter"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    AppDataSource_1.default.initialize()
        .then(() => console.log('DB connected'))
        .catch((error) => {
        console.log(error);
        process.exit(1);
    });
    const app = (0, express_1.default)();
    (0, appConfig_1.default)(app);
    (0, appRouter_1.default)(app);
    const PORT = process.env.PORT || 4001;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
main().catch((error) => console.log(error));
//# sourceMappingURL=index.js.map