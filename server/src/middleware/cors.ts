import cors from "cors";

/**
 * Implements the CORS middleware for allowing other sites to access the express web server
 */
const corsMiddleware = cors({
  // If the production origin is set (by docker-compose), use it, otherwise use the development origin
  origin: process.env.ORIGIN_PROD || process.env.ORIGIN,
  credentials: true,
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
