import fs = require("fs");
import { PoolConnection } from "mysql2";
import dotenv = require("dotenv");
dotenv.config();
import { commit, connectionQuery, startTransaction } from "../database"; // import your database module

/**
 * Reads the SQL commands from a file
 * @param file The file to read
 * @param commandKeyword The SQL command keyword to split on
 * @returns A list of SQL commands
 */
const readCommands = (file: string, commandKeyword: string) => {
  // Read the SQL commands
  const sql = fs.readFileSync(file, "utf8");

  // Regex pattern that matches the exact command keyword but ignores the first match
  const regex = new RegExp(`\\s*(?=\\b${commandKeyword}\\b)`, "gi");

  // Split the commands into separate queries and prepend the command keyword to every command except the first one
  const commands = sql
    .split(regex)
    .map((cmd) => cmd.trim())
    .filter(Boolean);

  return commands;
};

/**
 * Clears the database
 */
export const clearDatabase = async () => {
  try {
    const commands = readCommands("./src/db-scripts/clear_db_commands.sql", "TRUNCATE");

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
    console.error(`> ERROR: Failed to clear database: ${error}`);
  }
};

/**
 * Executes the SQL commands
 */
export const executeSqlCommands = async () => {
  try {
    const commands = readCommands("./src/db-scripts/fill_db_commands.sql", "INSERT");

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
    console.error(`> ERROR: Failed to execute SQL commands: ${error}`);
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
