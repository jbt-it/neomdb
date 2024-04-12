/**
 * Start server and connect to external services
 */
import * as dotenv from "dotenv";
import * as http from "http";
dotenv.config();

import app from "./app";
import logger from "./logger";
import { AppDataSource } from "./datasource";

const server = http.createServer(app);

AppDataSource.initialize()
  .then(() => {
    server.listen(process.env.PORT, () => {
      logger.info("Listening on port " + process.env.PORT + " | Environment: " + process.env.NODE_ENV);
    });
  })
  .catch((error) => console.log(error));
