// File containing the winston logger configuration

import { createLogger, format, transports } from "winston";

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
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorizes the output to the console
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      ),
    }),
  ],
});

export default logger;
