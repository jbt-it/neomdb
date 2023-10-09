/**
 * Start server and connect to external services
 */
import dotenv = require("dotenv");
import http = require("http");
dotenv.config();

import app from "./app";

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  // TODO: Rework env variables (use NODE_ENV instead of IS_PRODUCTION)
  process.env.NODE_ENV = process.env.NODE_ENV || process.env.IS_PRODUCTION === "true" ? "production" : "development";
  console.info("Listening on port " + process.env.PORT + " | Environment: " + process.env.NODE_ENV);
});
