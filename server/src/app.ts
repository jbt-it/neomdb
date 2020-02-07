import express = require("express");
import dotenv = require("dotenv");
dotenv.config();
const app = express();


app.set("port", process.env.PORT);

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;