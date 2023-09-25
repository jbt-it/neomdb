/**
 * Start server and connect to external services
 */
import dotenv = require("dotenv");
import http = require("http");
dotenv.config();

import app from "./app";

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log("Listening on port " + process.env.PORT);
});
