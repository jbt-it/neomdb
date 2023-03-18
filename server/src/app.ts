/**
 * Configure our API endpoint
 */
import express = require("express");
import dotenv = require("dotenv");
import cors = require("cors");
import cookieParser = require("cookie-parser");

import authRoutes from "./global/auth/authRoutes";
import membersRoutes from "./members/membersRoutes";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/**
 * Enable CORS for all incoming requests
 */
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

app.use((req, res, next) => {
  next();
});

/**
 * Enables the cookie parser middleware
 */
app.use(cookieParser());

/**
 * Use routes
 */
app.use("/auth", authRoutes);
app.use("/users", membersRoutes);

export default app;
