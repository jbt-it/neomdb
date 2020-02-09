/**
 * Start server and connect to external services
 */
import app from "./app";

const server =  app.listen(app.get("port"), () => {
  console.log("Listening on port " + app.get("port"));
});