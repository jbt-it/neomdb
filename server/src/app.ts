/*
 * Configure our API endpoint
 */
import express = require("express");
import dotenv = require("dotenv");
import cookieParser = require("cookie-parser");
import { RegisterRoutes } from "../build/routes";
import errorHandler from "./middleware/errorHandling";
// import refererValidationMiddleware from "./middleware/refererValidation";
import corsMiddleware from "./middleware/cors";
import routes from "./routes";

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
 * Routes Setup
 */
RegisterRoutes(app);

/*
 * Use routes
 */
app.use("/api", routes);

/*
 * Centralized Error handling
 */
app.use(errorHandler);

export default app;
