import cors = require("cors");

/**
 * Implements the CORS middleware for allowing other sites to access the express web server
 */
console.warn(process.env.IS_PRODUCTION ? process.env.ORIGIN_PROD : process.env.ORIGIN);
const corsMiddleware = cors({
  origin: process.env.IS_PRODUCTION ? process.env.ORIGIN_PROD : process.env.ORIGIN,
  credentials: true,
  // TODO: Check if these methods and headers are really needed
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Referer",
    "User-Agent",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Credentials",
  ],
});

export default corsMiddleware;
