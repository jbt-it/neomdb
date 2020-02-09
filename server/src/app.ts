/**
 * Configure our API endpoint
 */
import express = require("express");
import dotenv = require("dotenv");

import membersRoutes = require("./members/membersRoutes");

dotenv.config();
const app = express();

app.use(express.urlencoded({extended: false}));
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
 * Use routes
 */
app.use("/users", membersRoutes);

export default app;