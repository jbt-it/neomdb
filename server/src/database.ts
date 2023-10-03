/**
 * Wrapper for the MySQL connections
 */
import { QueryResult, TransactionTask } from "types/databaseTypes";
import mysql = require("mysql2");
import fs = require("fs");

let dbPassword = null;
try {
  dbPassword = fs.readFileSync(process.env.DB_PASSWORD_PROD_FILE, "utf8");
} catch (err) {
  console.error(`Error trying to read database password from ${process.env.DB_PASSWORD_PROD_FILE}: ${err}`);
}

let dbPort = null;
try {
  dbPort = parseInt(process.env.DB_PORT_PROD) || parseInt(process.env.DB_PORT);
} catch (err) {
  console.error(`Error trying to parse database port ${process.env.DB_PORT_PROD} to int: ${err}`);
}

/**
 * Config for the MySQL database
 */
const databaseConfig = {
  host: process.env.DB_HOST_PROD || process.env.DB_HOST_DEV,
  port: dbPort,
  user: process.env.DB_USER,
  password: dbPassword || process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 50,
};

const pool: mysql.Pool = mysql.createPool(databaseConfig);

/**
 * Acquires connection from pool, executes query, releaeses connection and
 * returns promise
 * @param sql Query string
 * @param args Array with query arguments
 * @param connection (optional) The connection to the database (used for transactions)
 */
export const query = (sql: string, args: (string | number | boolean)[], connection?: mysql.PoolConnection) => {
  const executor = connection || pool;
  return new Promise<QueryResult>((resolve, reject) => {
    executor.query(sql, args, (queryError: any, result: QueryResult) => {
      if (queryError) {
        return reject(queryError);
      }
      return resolve(result);
    });
  });
};

/**
 * Acquires connection from pool and returns promise
 *
 * Only use this function if you need to execute multiple queries in a transaction
 */
export const getConnection = (): Promise<mysql.PoolConnection> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      else resolve(connection);
    });
  });
};

/**
 * Begins a transaction
 * @param connection The connection to the database
 */
export const beginTransaction = (connection: mysql.PoolConnection): Promise<void> => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

/**
 * Commits a transaction
 * @param connection The connection to the database
 */
export const commit = (connection: mysql.PoolConnection): Promise<void> => {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

/**
 * Rolls back a transaction
 * @param connection The connection to the database
 */
export const rollback = (connection: mysql.PoolConnection): Promise<void> => {
  return new Promise((resolve, reject) => {
    connection.rollback(() => {
      resolve();
    });
  });
};

/**
 * Executes a sequence of repository functions (tasks) within a single transaction
 * If any of the tasks fails, the entire transaction is rolled back
 * If all tasks succeed, the transaction is committed
 *
 * @param {TransactionTask[]} tasks - An array of tasks to be executed in sequence
 * Each task object contains the function to be executed and its corresponding arguments
 *
 * @returns {Promise<any[]>} - Resolves with an array of results from each executed function
 *
 * @throws Error if one of the tasks fails or if there are issues with the transaction
 *
 * @example
 *
 * ```typescript
 * // Using the function in a service:
 * try {
 *   const results = await executeInTransaction([
 *     {
 *       func: this.membersRepository.updateDepartmentByID(this.membersRepository),
 *       args: [departmentID, linkOrganigramm, linkZielvorstellung]
 *     },
 *     {
 *       func: this.membersRepository.someOtherFunction(this.membersRepository),
 *       args: [otherArg1, otherArg2]
 *     }
 *   ]);
 *
 *   console.log(results); // Array of results from the executed functions.
 * } catch (error) {
 *   console.error('Transaction failed:', error);
 * }
 * ```
 */
export const executeInTransaction = async (tasks: TransactionTask[]): Promise<any[]> => {
  const connection = await getConnection();
  try {
    await beginTransaction(connection);

    const results: any[] = [];
    for (const task of tasks) {
      results.push(await task.func(...task.args, connection));
    }

    await commit(connection);

    return results;
  } catch (error) {
    await rollback(connection);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Creates a list of promises
 * @param queryList A list of queries
 * @param connection The connection for creating promises executing connectionQuery
 * @returns A list of promises
 */
const createPromises = (queryList: string[], connection: mysql.PoolConnection) => {
  const promises = [];
  queryList.map((singleQuery) => {
    promises.push(query(singleQuery, [], connection));
  });
  return promises;
};

/**
 * Executes multiple queries by iterating through them
 * Should only be used in combination with startTransaction
 * @param connection The connection to the database (required!)
 * @param queries Array with query strings
 * @returns Promise
 */
export const executeMultipleQueries = (queries: string[], connection: mysql.PoolConnection) => {
  const promises = createPromises(queries, connection);
  return Promise.all(promises);
};

// ------------------ DEPRECATED ------------------ \\

/**
 * Retrieves a connection from the pool and starts a transaction
 * @deprecated Use getConnection and beginTransaction instead - This is only used for the db scripts
 * @returns A promise
 */
export const startTransaction = () => {
  // TODO: Remove this function!
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
 * @deprecated This is only used for the db scripts
 */
export const endConnection = (connection: mysql.PoolConnection) => {
  // TODO: Remove this function!
  connection.destroy();
};

/**
 * Executes query with the given connection
 *
 * ! Should only be used in combination with startTransaction
 * @param connection The connection to the database
 * @param sql Query string
 * @param args Array with query arguments
 * @returns A promise
 * @deprecated This is only used for the db scripts
 */
export const connectionQuery = (connection: mysql.PoolConnection, sql: string, args: (string | number)[]) => {
  // TODO: Remove this function!
  return new Promise<QueryResult>((resolve, reject) => {
    connection.query(sql, args, (queryError: any, result: QueryResult) => {
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
