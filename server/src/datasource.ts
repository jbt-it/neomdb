import { DataSource } from "typeorm";

/**
 * Data source that connects to the database.
 */
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "develop",
  password: "passw0rd",
  database: "mdb",
  entities: [__dirname + "/typeOrm/entities/*.ts"],
  synchronize: true,
  logging: false,
});
