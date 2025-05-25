import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { json } from "body-parser";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user-resolver";
import { AppDataSource } from "./config/database";

async function bootstrap() {
  // Initialize TypeORM
  await AppDataSource.initialize();

  // Create Express app
  const app = express();

  // Create GraphQL schema
  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: false,
  });

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
  });

  // Start Apollo Server
  await server.start();

  // Apply middleware
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server),
  );

  // Start server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
}

bootstrap().catch(console.error);
