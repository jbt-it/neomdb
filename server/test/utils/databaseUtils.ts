import * as fs from "fs";
import { PoolConnection } from "mysql2";
import { commit, connectionQuery, startTransaction } from "../../src/database";

/**
 * The type of the script
 */
type ScriptType = "INSERT" | "TRUNCATE" | "CREATE";

/**
 * Reads the SQL commands from a file
 * @param file The file to read
 * @param commandKeywords An array of  SQL command keywords to split on
 * @returns A list of SQL commands
 */
const readCommands = (file: string, commandKeywords: string[]) => {
  // Read the SQL commands
  const sql = fs.readFileSync(file, "utf8");

  // Regex pattern that matches the exact command keyword but ignores the first match
  const regexStr = commandKeywords.map((keyword) => `\\b${keyword}\\b`).join("|");

  const regex = new RegExp(`\\s*(?=${regexStr})`, "gi");

  // Split the commands into separate queries and prepend the command keyword to every command except the first one
  const commands = sql
    .split(regex)
    .map((cmd) => cmd.trim())
    .filter(Boolean);

  return commands;
};

/**
 * Executes the SQL commands of the given script
 * @param script The path to the script to execute
 */
export const executeScript = async (script: string, type: ScriptType) => {
  try {
    let commands = null;
    if (type === "CREATE") {
      commands = readCommands(script, ["CREATE", "ALTER"]);
    } else {
      commands = readCommands(script, [type]);
    }

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
    console.error(`> ERROR: Failed to execute script: ${error}`);
  }
};
