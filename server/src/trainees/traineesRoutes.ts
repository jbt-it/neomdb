/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
const router = express.Router();

import * as authController from "../global/auth/authController";
import * as traineesController from "./traineesController";

/**
 * =======>>> ALL routes after this point are accessible for logged in users only <<<=======
 */
router.use(authController.protectRoutes);

//  =======>>> Get routes <<<=======

// Get a specific internal project
router.get("/ip/:id", traineesController.retrieveIP);
// Get all internal projects of one generation
router.get("/:generation-id/ip/", traineesController.retrieveAllIPsByGeneration);

//  =======>>> Patch routes <<<=======
router.patch("/ip/:id", traineesController.updateIP);

module.exports = router;
