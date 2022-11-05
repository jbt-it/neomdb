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
  connectionLimit: 50,
};

const pool: mysql.Pool = mysql.createPool(databaseConfig);

/**
 * Acquires connection from pool, executes query, releaeses connection and
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
 * Executes query with the given connection
 *
 * ! Should only be used in combination with startTransaction
 * @param connection The connection to the database
 * @param sql Query string
 * @param args Array with query arguments
 * @returns A promise
 */
export const connectionQuery = (connection: mysql.PoolConnection, sql: string, args: (string | number)[]) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, args, (queryError: mysql.MysqlError, result: (string | number)[]) => {
      if (queryError) {
        // If the query fails a rollback is automatically initiated
        rollback(connection)
          .then(() => {
            return reject(queryError);
          })
          .catch((err) => {
            return reject(`Error initiating rollback: ${err}`);
          });
      } else {
        return resolve(result);
      }
    });
  });
};

/**
 * Retrieves a connection from the pool and starts a transaction
 * @returns A promise
 */
export const startTransaction = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        return reject(error);
      }
      connection.beginTransaction((err) => {
        if (err) {
          return reject(err);
        }
        return resolve(connection);
      });
    });
  });
};

/**
 * Ends the connection to the database
 *
 * ! Should only be used in combination with startTransaction
 * @param connection The connection to the database
 */
export const endConnection = (connection: mysql.PoolConnection) => {
  connection.destroy();
};

/**
 * Commits all database actions of this connection and ends the transaction
 *
 * ! Should only be used in combination with startTransaction
 * @param connection The connection to the database
 * @returns A promise
 */
export const commit = (connection: mysql.PoolConnection) => {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) {
        return reject(err);
      }
      endConnection(connection);
      return resolve([]);
    });
  });
};

/**
 * Makes a rollback, undoing all database actions of this connection and ends the transaction
 *
 * ! Should only be used in combination with startTransaction
 * @param connection The connection to the database
 * @returns A promise
 */
const rollback = (connection: mysql.PoolConnection) => {
  return new Promise((resolve, reject) => {
    connection.rollback((err) => {
      if (err) {
        return reject(err);
      }
      return resolve([]);
    });
  });
};

/**
 * Creates a list of promises
 * @param queryList A list of queries
 * @param connection (optinal) The connection for creating promises executing connectionQuery
 * @returns A list of promises
 */
const createPromises = (queryList: string[], connection?: mysql.PoolConnection) => {
  const promises = [];
  if (connection) {
    queryList.map((singleQuery) => {
      promises.push(connectionQuery(connection, singleQuery, []));
    });
  } else {
    queryList.map((singleQuery) => {
      promises.push(query(singleQuery, []));
    });
  }
  return promises;
};

/**
 * Executes multiple queries by iterating through them
 * Should only be used in combination with startTransaction
 * @param queries Array with query strings
 * @returns Promise
 */
export const executeMultipleConnectionQueries = (connection: mysql.PoolConnection, queries: string[]) => {
  const promises = createPromises(queries, connection);
  return Promise.all(promises);
};
