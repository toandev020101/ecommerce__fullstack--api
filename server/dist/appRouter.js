"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const roleRoute_1 = __importDefault(require("./routes/roleRoute"));
const permissionRoute_1 = __importDefault(require("./routes/permissionRoute"));
const mediaRoute_1 = __importDefault(require("./routes/mediaRoute"));
const provinceRoute_1 = __importDefault(require("./routes/provinceRoute"));
const districtRoute_1 = __importDefault(require("./routes/districtRoute"));
const wardRoute_1 = __importDefault(require("./routes/wardRoute"));
const categoryRoute_1 = __importDefault(require("./routes/categoryRoute"));
const tagRoute_1 = __importDefault(require("./routes/tagRoute"));
const variationRoute_1 = __importDefault(require("./routes/variationRoute"));
const variationOptionRoute_1 = __importDefault(require("./routes/variationOptionRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const appRouter = (app) => {
    const apiRoute = '/api/v1';
    app.use(`${apiRoute}/auth`, authRoute_1.default);
    app.use(`${apiRoute}/user`, userRoute_1.default);
    app.use(`${apiRoute}/role`, roleRoute_1.default);
    app.use(`${apiRoute}/permission`, permissionRoute_1.default);
    app.use(`${apiRoute}/media`, mediaRoute_1.default);
    app.use(`${apiRoute}/province`, provinceRoute_1.default);
    app.use(`${apiRoute}/district`, districtRoute_1.default);
    app.use(`${apiRoute}/ward`, wardRoute_1.default);
    app.use(`${apiRoute}/product`, productRoute_1.default);
    app.use(`${apiRoute}/category`, categoryRoute_1.default);
    app.use(`${apiRoute}/tag`, tagRoute_1.default);
    app.use(`${apiRoute}/variation`, variationRoute_1.default);
    app.use(`${apiRoute}/variation-option`, variationOptionRoute_1.default);
};
exports.default = appRouter;
//# sourceMappingURL=appRouter.js.map