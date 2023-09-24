import mysql = require("mysql2");

/**
 * Custom type for the result of a query
 * It bundles the different possible results of a query together
 */
export type QueryResult =
  | mysql.ResultSetHeader
  | mysql.RowDataPacket[][]
  | mysql.RowDataPacket[]
  | mysql.ResultSetHeader[];

/**
 * Represents a repository function that executes a sql query
 * @property args - The arguments to pass to the repository function
 */
type RepoFunction = (...args: any[]) => Promise<unknown>;

/**
 * Represents a single unit of work or task to be executed within a transaction
 *
 * @property {RepoFunction} func - The repository function that should be executed
 * @property {any[]} args - The arguments to pass to the repository function
 */
export type TransactionTask = {
  func: RepoFunction;
  args: any[];
};
