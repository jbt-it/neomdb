import cors = require("cors");

/**
 * Implements the CORS middleware for allowing other sites to access the express web server
 */
const corsMiddleware = cors({ origin: process.env.ORIGIN, credentials: true });

export default corsMiddleware;
