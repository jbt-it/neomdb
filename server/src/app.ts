import express = require("express");
import dotenv = require("dotenv");
dotenv.config();
const app = express();

app.set("port", process.env.PORT);

app.use(express.urlencoded());
app.use(express.json());

/**
 * Enable CORS for all incoming requests
 */
app.all("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

/**
 * Handle login request and respond with entered data
 */
app.post("/login", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

export default app;