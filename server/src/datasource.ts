import * as fs from "fs";
import { DataSource } from "typeorm";
import logger from "./logger";

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

/**
 * Constructs the database configuration object.
 * @returns The database configuration object.
 */
const getDbConfig = () => {
  // Read the database password from file if production
  let dbPassword = null;
  try {
    if (!isTest && isProduction) {
      dbPassword = fs.readFileSync(process.env.DB_PASSWORD_PROD_FILE, "utf8");
    } else {
      dbPassword = process.env.DB_PASSWORD;
    }
  } catch (err) {
    logger.error(`Error trying to read database password from ${process.env.DB_PASSWORD_PROD_FILE}: ${err}`);
  }

  // Parse the database port to int
  let dbPort = null;
  try {
    if (!isTest && isProduction) {
      dbPort = parseInt(process.env.DB_PORT_PROD);
    }
    dbPort = parseInt(process.env.DB_PORT);
  } catch (err) {
    logger.error(`Error trying to parse database port ${process.env.DB_PORT_PROD} to int: ${err}`);
  }

  let dbHost = null;
  let dbUsername = null;
  let dbName = null;
  let entities = [];
  let synchronize = false;
  let subscribers = [];
  if (isTest) {
    dbHost = process.env.DB_TEST_HOST;
    dbUsername = process.env.DB_TEST_USER;
    dbName = process.env.DB_TEST_NAME;
    entities = [__dirname + "/entities/*.ts"];
    subscribers = [__dirname + "/global/*.ts"];
    synchronize = true;
  } else if (isProduction) {
    dbHost = process.env.DB_HOST_PROD;
    dbUsername = process.env.DB_USER;
    dbName = process.env.DB_NAME;
    entities = [__dirname + "/entities/*.js"];
    subscribers = [__dirname + "/global/*.js"];
  } else {
    dbHost = process.env.DB_HOST_DEV;
    dbUsername = process.env.DB_USER;
    dbName = process.env.DB_NAME;
    entities = [__dirname + "/entities/*.ts"];
    subscribers = [__dirname + "/global/*.ts"];
  }

  return {
    port: dbPort,
    host: dbHost,
    username: dbUsername,
    password: dbPassword,
    database: dbName,
    entities,
    subscribers,
    synchronize,
  };
};

const dbConfig = getDbConfig();

/**
 * Data source that connects to the database.
 */
export const AppDataSource = new DataSource({
  type: "mysql",
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: dbConfig.entities,
  synchronize: dbConfig.synchronize,
  subscribers: dbConfig.subscribers,
  logging: false,
});
