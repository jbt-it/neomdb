/*
 * Configure our API endpoint
 */
import express = require("express");
import dotenv = require("dotenv");
import cookieParser = require("cookie-parser");

import refererValidationMiddleware from "./middleware/refererValidation";
import corsMiddleware from "./middleware/cors";
import authRoutes from "./global/auth/authRoutes";
import membersRoutes from "./resources/members/membersRoutes";
import traineesRoutes from "./resources/trainees/traineesRoutes";
import { NotFoundError, UnautherizedError } from "types/Errors";

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
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("Error handler");
  switch (err.name) {
    case "UnauthorizedError":
      console.error(err);
      res.status(401).send(err.message);
      break;
    case "NotFoundError":
      console.error(err);
      res.status(404).send(err.message);
      break;
    case "UnauthenticatedError":
      console.error(err);
      res.status(401).send(err.message);
      break;
    default:
      console.error(err);
      res.status(500).send(err.message);
      break;
  }
});

export default app;
