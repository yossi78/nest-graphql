"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const City_1 = require("../entities/City");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "nest_graphql_db",
    synchronize: true,
    dropSchema: true,
    logging: true,
    entities: [User_1.User, City_1.City],
    subscribers: [],
    migrations: []
});
//# sourceMappingURL=database.js.map