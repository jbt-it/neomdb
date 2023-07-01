import fs = require("fs");
import { PoolConnection } from "mysql2";
import dotenv = require("dotenv");
dotenv.config();
import { commit, connectionQuery, startTransaction } from "../database"; // import your database module

/**
 * Reads the SQL commands from a file
 * @param file The file to read
 * @returns A list of SQL commands
 */
const readCommands = (file: string) => {
  // Read the SQL commands
  const sql = fs.readFileSync(file, "utf8");

  // Split the commands into separate queries
  const commands = sql
    .split(";")
    .map((cmd) => cmd.trim())
    .filter(Boolean);

  return commands;
};

/**
 * Clears the database
 */
export const clearDatabase = async () => {
  try {
    const commands = readCommands("./src/db-scripts/clear-db-commands.sql");

    // Start a transaction
    const connection = (await startTransaction()) as PoolConnection;

    // Execute each command
    await connectionQuery(connection, "SET FOREIGN_KEY_CHECKS = 0", []);
    for (const cmd of commands) {
      await connectionQuery(connection, cmd, []);
    }
    await connectionQuery(connection, "SET FOREIGN_KEY_CHECKS = 1", []);

    // Commit the transaction
    await commit(connection);
  } catch (error) {
    console.error(`> Failed to clear database: ${error}`);
  }
};

/**
 * Executes the SQL commands
 */
export const executeSqlCommands = async () => {
  try {
    const commands = readCommands("./src/db-scripts/fill-db-commands.sql");

    // Start a transaction
    const connection = (await startTransaction()) as PoolConnection;

    // Execute each command
    for (const cmd of commands) {
      await connectionQuery(connection, cmd, []);
    }

    // Commit the transaction
    await commit(connection);
  } catch (error) {
    console.error(`> Failed to execute SQL commands: ${error}`);
  }
};

(async () => {
  try {
    console.log("------------------CLEAR DATABASE------------------");
    await clearDatabase();
    console.log("> Database cleared!");
    console.log("------------------FILL DATABASE------------------");
    await executeSqlCommands();
    console.log("> Database filled!");
  } catch (error) {
    console.error("Failed to execute SQL commands:", error);
  }
})();
