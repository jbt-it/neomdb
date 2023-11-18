/* eslint-disable no-console */
import { executeScript } from "./databaseUtils";

const initMemberScript = "./test/scripts/members/db_member_init.sql";
const clearMemberScript = "./test/scripts/members/db_member_clear.sql";
const fillMemberScript = "./test/scripts/members/db_member_fill.sql";

/**
 * Initializes the member database with data that is not changed during tests
 * (e.g. permissions)
 */
export const initMemberData = async () => {
  try {
    console.log("------------------INIT DATABASE------------------");
    await executeScript(initMemberScript, "INSERT");
    console.log("> Database initialized!");
  } catch (error) {
    console.error(`> ERROR: Failed to init member data: ${error}`);
  }
};

/**
 * Fills the member database with data that is changed during tests
 * (e.g. members)
 */
export const setupMemberData = async () => {
  try {
    console.log("------------------FILL DATABASE------------------");
    await executeScript(fillMemberScript, "INSERT");
    console.log("> Database filled!");
  } catch (error) {
    console.error(`> ERROR: Failed to setup member data: ${error}`);
  }
};

/**
 * Clears the member database
 */
export const clearMemberData = async () => {
  try {
    console.log("------------------CLEAR DATABASE------------------");
    await executeScript(clearMemberScript, "TRUNCATE");
    console.log("> Database cleared!");
  } catch (error) {
    console.error(`> ERROR: Failed to clear member data: ${error}`);
  }
};
