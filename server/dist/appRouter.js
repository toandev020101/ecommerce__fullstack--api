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
const appRouter = (app) => {
    const apiRoute = '/api/v1';
    app.use(`${apiRoute}/auth`, authRoute_1.default);
    app.use(`${apiRoute}/user`, userRoute_1.default);
    app.use(`${apiRoute}/role`, roleRoute_1.default);
    app.use(`${apiRoute}/permission`, permissionRoute_1.default);
    app.use(`${apiRoute}/media`, mediaRoute_1.default);
};
exports.default = appRouter;
//# sourceMappingURL=appRouter.js.map