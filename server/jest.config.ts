// Configurations for Jest testing framework
import type { Config } from "jest";

import * as inspector from "node:inspector";

/**
 * Checks if the debugger is attached to the process
 * @returns true if the debugger is attached, false otherwise
 */
const isDebugging = () => {
  return typeof inspector.url() !== "undefined";
};

const config: Config = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  forceExit: true,
  testTimeout: isDebugging() ? 240000 : 20000, // Increase maximum timeout to 4 minutes if debugging is enabled
};

export default config;
