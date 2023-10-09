// Configurations for Jest testing framework
import type { Config } from "jest";

const config: Config = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  forceExit: true,
  testTimeout: 30000,
};

export default config;
