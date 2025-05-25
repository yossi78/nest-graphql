import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { City } from "../entities/City";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "nest_graphql_db",
  synchronize: true,
  dropSchema: true,
  logging: true,
  entities: [User, City],
  subscribers: [],
  migrations: []
}); 