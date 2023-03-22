"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Media_1 = require("./models/Media");
const Permission_1 = require("./models/Permission");
const Role_1 = require("./models/Role");
const RolePermission_1 = require("./models/RolePermission");
const User_1 = require("./models/User");
const AppDataSource = new typeorm_1.DataSource({
    type: (process.env.DB_TYPE || 'postgres'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    synchronize: true,
    logging: false,
    entities: [User_1.User, Role_1.Role, Permission_1.Permission, RolePermission_1.RolePermission, Media_1.Media],
});
exports.default = AppDataSource;
//# sourceMappingURL=AppDataSource.js.map