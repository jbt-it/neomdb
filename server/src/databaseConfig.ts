/**
 * Wrapper for the MySQL connections
 */
import * as fs from "fs";
import logger from "./logger";
import { PoolOptions } from "mysql2";

// Check if the environment is test
const isTest = process.env.NODE_ENV === "test";

// Read the database password from file if production
let dbPassword = null;
try {
  if (!isTest && process.env.IS_PRODUCTION) {
    dbPassword = fs.readFileSync(process.env.DB_PASSWORD_PROD_FILE, "utf8");
  }
} catch (err) {
  logger.error(`Error trying to read database password from ${process.env.DB_PASSWORD_PROD_FILE}: ${err}`);
}

// Parse the database port to int
let dbPort = null;
try {
  if (!isTest && process.env.IS_PRODUCTION) {
    dbPort = parseInt(process.env.DB_PORT_PROD);
  }
  dbPort = parseInt(process.env.DB_PORT);
} catch (err) {
  logger.error(`Error trying to parse database port ${process.env.DB_PORT_PROD} to int: ${err}`);
}

/**
 * Config for the MySQL test database
 */
const testDatabaseConfig: PoolOptions = {
  host: process.env.DB_TEST_HOST,
  user: process.env.DB_TEST_USER,
  password: process.env.DB_TEST_PASSWORD,
  database: process.env.DB_TEST_NAME,
  multipleStatements: true,
  connectionLimit: 200, // Increased limit to accomodate test-setup and connections during request testing
};

/**
 * Config for the MySQL development database
 * (same as production database)
 */
const devDatabaseConfig: PoolOptions = {
  host: process.env.DB_HOST_DEV,
  port: parseInt(process.env.DB_PORT) || parseInt(process.env.DB_PORT_PROD),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 50,
};

/**
 * Config for the MySQL production database
 * (same as development database)
 */
const prodDatabaseConfig: PoolOptions = {
  host: process.env.DB_HOST_PROD,
  port: dbPort,
  user: process.env.DB_USER,
  password: dbPassword || process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 50,
};

/**
 * Config for the MySQL database
 * (depending on the environment)
 */
const databaseConfig = isTest
  ? testDatabaseConfig
  : process.env.IS_PRODUCTION === "true"
  ? prodDatabaseConfig
  : devDatabaseConfig;

export default databaseConfig;
