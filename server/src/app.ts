/**
 * Configure our API endpoint
 */
import express = require("express");
import dotenv = require("dotenv");
import cors = require("cors");
import cookieParser = require("cookie-parser");

import authRoutes from "./global/auth/authRoutes";
import membersRoutes from "./members/membersRoutes";
import traineesRoutes from "./trainees/traineesRoutes";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/**
 * Enable CORS for all incoming requests
 */
app.use(cors({ origin: process.env.ORIGIN }));

/**
 * Enables the cookie parser middleware
 */
app.use(cookieParser());

/**
 * Use routes
 */
app.use("/auth", authRoutes);
app.use("/users", membersRoutes);
app.use("/trainees", traineesRoutes);

export default app;
