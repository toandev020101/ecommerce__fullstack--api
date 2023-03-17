"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const roleRoute_1 = __importDefault(require("./routes/roleRoute"));
const mediaRoute_1 = __importDefault(require("./routes/mediaRoute"));
const appRouter = (app) => {
    app.use('/api/v1/auth', authRoute_1.default);
    app.use('/api/v1/user', userRoute_1.default);
    app.use('/api/v1/role', roleRoute_1.default);
    app.use('/api/v1/media', mediaRoute_1.default);
};
exports.default = appRouter;
//# sourceMappingURL=appRouter.js.map