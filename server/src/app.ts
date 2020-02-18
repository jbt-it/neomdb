/**
 * Configure our API endpoint
 */
import express = require("express");
import dotenv = require("dotenv");
import cors = require("cors");

import membersRoutes = require("./members/membersRoutes");

dotenv.config();
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());



/**
 * Enable CORS for all incoming requests
 */
app.use(cors({origin: process.env.ORIGIN}));

/**
 * Use routes
 */
app.use("/users", membersRoutes);

export default app;