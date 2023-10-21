/*
 * Configure our API endpoint
 */
import express = require("express");
import dotenv = require("dotenv");
import cookieParser = require("cookie-parser");
import * as swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./middleware/errorHandling";
// import refererValidationMiddleware from "./middleware/refererValidation";
import corsMiddleware from "./middleware/cors";
import swagger from "./middleware/swagger";

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
// app.use(refererValidationMiddleware);

/*
 * Swagger UI Setup
 */
app.use("/docs", swaggerUi.serve, swagger);

/*
 * Routes Setup
 */
RegisterRoutes(app);

/*
 * Centralized Error handling
 */
app.use(errorHandler);

export default app;
