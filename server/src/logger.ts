// File containing the winston logger configuration

import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logsPath = process.env.LOGS_PATH || "./logs"; // Path to the logs folder, defaults to logs if not set in .en

/**
 * Returns the transports to be used by the logger
 * @returns {transports[]} Array of transports
 */
const getTransports = () => {
  if (process.env.NODE_ENV === "production") {
    return [
      new transports.Console({
        format: format.combine(
          format.colorize(), // Colorizes the output to the console
          format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
          })
        ),
      }),
    ];
  }
  return [
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorizes the output to the console
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      ),
    }),
    new transports.File({
      filename: `${logsPath}/error.log`,
      level: "error",
    }),
    new transports.File({
      filename: `${logsPath}logs/combined.log`,
    }),
    // For log rotation
    new DailyRotateFile({
      filename: "application-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      maxSize: "20m",
      maxFiles: "14d",
      auditFile: `${logsPath}/audits/audit.json`, // Set your custom path here
    }),
  ];
};

const logger = createLogger({
  level: "info", // Minimum level to display
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }), // Display stack traces
    format.splat(), // Format string based on util.format()
    format.json() // Format the output as JSON
  ),
  transports: getTransports(),
});

export default logger;
