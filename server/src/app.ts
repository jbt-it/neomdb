/*
 * Configure our API endpoint
 */
import express = require("express");
import dotenv = require("dotenv");
import cookieParser = require("cookie-parser");

import refererValidationMiddleware from "./middleware/refererValidation";
import corsMiddleware from "./middleware/cors";
import routes from "./routes";

dotenv.config();
const app = express();

/*
 * Express configuration
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.IS_PRODUCTION) {
  // This trusts all requests coming from a proxy (in our case nginx)
  // TODO: Check if this is really needed and if it is, check there are no security issues
  app.set("trust proxy", 1);
  // This ensures that all requests are made via https, in theory this is not needed because
  // nginx already handles this
  app.use((req, res, next) => {
    console.log(req.header("x-forwarded-proto"));
    if (req.header("x-forwarded-proto") !== "https") {
      console.log("https"); // TODO: Add error handling
    }
    next();
  });
}

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
 * Use routes
 */
app.use("/api", routes);

export default app;
