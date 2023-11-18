/**
 * Wrapper for the MySQL connections
 */
import fs = require("fs");

// Check if the environment is test
const isTest = process.env.NODE_ENV === "test";
// Check if the environment is development
const isDev = process.env.NODE_ENV === "development";

// Read the database password from file if production
let dbPassword = null;
try {
  if (!isTest && !isDev) {
    dbPassword = fs.readFileSync(process.env.DB_PASSWORD_PROD_FILE, "utf8");
  }
} catch (err) {
  console.error(`Error trying to read database password from ${process.env.DB_PASSWORD_PROD_FILE}: ${err}`);
}

// Parse the database port to int
let dbPort = null;
try {
  dbPort = parseInt(process.env.DB_PORT_PROD) || parseInt(process.env.DB_PORT);
} catch (err) {
  console.error(`Error trying to parse database port ${process.env.DB_PORT_PROD} to int: ${err}`);
}

/**
 * Config for the MySQL test database
 */
const testDatabaseConfig = {
  host: process.env.DB_TEST_HOST,
  user: process.env.DB_TEST_USER,
  password: process.env.DB_TEST_PASSWORD,
  database: process.env.DB_TEST_NAME,
  connectionLimit: 50,
};

/**
 * Config for the MySQL development database
 * (same as production database)
 */
const devDatabaseConfig = {
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
const prodDatabaseConfig = {
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
const databaseConfig = isTest ? testDatabaseConfig : isDev ? devDatabaseConfig : prodDatabaseConfig;

export default databaseConfig;
