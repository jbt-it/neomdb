import { DataSource } from "typeorm";

const isTest = process.env.NODE_ENV === "test";

/**
 * Data source that connects to the database.
 */
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: isTest ? "test" : "develop",
  password: "passw0rd",
  database: isTest ? "mdb_test" : "mdb",
  entities: [__dirname + "/typeOrm/entities/*.ts"],
  synchronize: isTest,
  logging: false,
});
