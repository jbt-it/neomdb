/**
 * Start server and connect to external services
 */
import app from "./app";
import dotenv = require("dotenv");
dotenv.config();

const server =  app.listen(process.env.PORT, () => {
  console.log("Listening on port " + process.env.PORT);
});