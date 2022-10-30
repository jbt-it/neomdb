/**
 * Start server and connect to external services
 */
import https = require("https");
import fs = require("fs");
import dotenv = require("dotenv");
dotenv.config();

import app from "./app";

/**
 * Config to enable https requests to the backend
 */
const serverConfig = {
  key: fs.readFileSync(process.env.PATH_TO_KEY),
  cert: fs.readFileSync(process.env.PATH_TO_CERT),
};

const server = https.createServer(serverConfig, app);

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log("Listening on port " + process.env.PORT);
});
