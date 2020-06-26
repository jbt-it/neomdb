/**
 * Wrapper for the MySQL connections
 */
import mysql = require("mysql");

/**
 * Config for the MySQL database with default values for testing
 */
const databaseConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "develop",
  password: process.env.DB_PASSWORD || "passw0rd",
  database: process.env.DB_NAME || "mdb",
  connectionLimit: 50
};

const pool: mysql.Pool = mysql.createPool(databaseConfig);

/**
 * Aquires connection from pool, executes query, releaeses connection and
 * returns promise
 * @param sql Query string
 * @param args Array with query arguments
 */
export const query = (sql: string, args: (string | number)[]) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, args, (queryError: mysql.MysqlError, result: (string | number)[]) => {
        if (queryError) {
          return reject(queryError);
        }
        return resolve(result);
    });
  });
};