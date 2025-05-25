"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const type_graphql_1 = require("type-graphql");
const UserResolver_1 = require("./resolvers/UserResolver");
const database_1 = require("./config/database");
async function bootstrap() {
    // Initialize TypeORM
    await database_1.AppDataSource.initialize();
    // Create Express app
    const app = (0, express_1.default)();
    // Create GraphQL schema
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [UserResolver_1.UserResolver],
        validate: false,
    });
    // Create Apollo Server
    const server = new server_1.ApolloServer({
        schema,
    });
    // Start Apollo Server
    await server.start();
    // Apply middleware
    app.use("/graphql", (0, cors_1.default)(), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server));
    // Start server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
}
bootstrap().catch(console.error);
//# sourceMappingURL=index.js.map