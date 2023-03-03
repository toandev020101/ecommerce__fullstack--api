"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Role_1 = require("./models/Role");
const User_1 = require("./models/User");
const AppDataSource = new typeorm_1.DataSource({
    type: (process.env.DB_TYPE || 'postgres'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    synchronize: true,
    logging: false,
    entities: [User_1.User, Role_1.Role],
});
exports.default = AppDataSource;
//# sourceMappingURL=AppDataSource.js.map