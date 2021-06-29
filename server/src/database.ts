/**
 * Wrapper for the MySQL connections
 */
import mysql = require("mysql");

/**
 * Config for the MySQL database
 */
const databaseConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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

/**
 * Executes multiple queries by iterating through them
 * @param queries Array with query strings
 * @returns promise
 */
export const executeMultipleQueries = (queries: string[]) => {
  return new Promise((resolve, reject) => {
    const results = [];
    queries.map(singleQuery => {
      query(singleQuery, [])
        .then(result => {
          results.push(result);
        })
        .catch(err => {
          return reject(err);
        });
    });
    return resolve(results);
  });
};