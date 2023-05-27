/*
 * Configure our API endpoint
 */
import express = require("express");
import dotenv = require("dotenv");
import cookieParser = require("cookie-parser");

import refererValidationMiddleware from "./middleware/refererValidation";
import corsMiddleware from "./middleware/cors";
import authRoutes from "./global/auth/authRoutes";
import membersRoutes from "./members/membersRoutes";

dotenv.config();
const app = express();

/*
 * Express configuration
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/*
 * Enable CORS middleware for all incoming requests
 */
app.use(corsMiddleware);

/*
 * Enables the cookie parser middleware
 */
app.use(cookieParser());

/*
 * Enables referer validation middleware
 */
app.use(refererValidationMiddleware);

/*
 * Use routes
 */
app.use("/auth", authRoutes);
app.use("/users", membersRoutes);

export default app;
