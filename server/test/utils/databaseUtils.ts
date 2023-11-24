import * as fs from "fs";
import { query } from "../../src/database";

/**
 * Executes the SQL commands of the given script
 * @param script The path to the script to execute
 */
export const executeScript = async (script: string) => {
  try {
    // Read all sql commands of the given file
    const sql = fs.readFileSync(script, "utf8");

    // Executes all commands at once (only possible if database allows multiple statements)
    await query(sql, []);
  } catch (error) {
    console.error(`> ERROR: Failed to execute script: ${error}`);
  }
};
