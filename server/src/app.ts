/*
 * Configure our API endpoint
 */
import express = require("express");
import dotenv = require("dotenv");
import cookieParser = require("cookie-parser");

import authRoutes from "./auth/authRoutes";
import corsMiddleware from "./middleware/cors";
import errorHandler from "./middleware/errorHandling";
import membersRoutes from "./resources/members/membersRoutes";
import traineesRoutes from "./resources/trainees/traineesRoutes";

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
// app.use(refererValidationMiddleware); TODO: Currently deactivated for development puropose

/*
 * Use routes
 */
app.use("/auth", authRoutes);
app.use("/users", membersRoutes);
app.use("/trainees", traineesRoutes);

/*
 * Centralized Error handling
 */
app.use(errorHandler);

export default app;
