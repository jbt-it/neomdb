/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
const router = express.Router();

import * as authController from "../global/auth/authController";
import * as traineeController from "./traineeController";

/**
 * Holds all permission IDs
 * (Can be used if a route should only be accessed if it has at least one of all possible permissions)
 */
const ALL_PERMISSIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 20, 21, 22, 23, 24, 100];

/**
 * =======>>> ALL routes after this point are accessible for logged in users only <<<=======
 */
router.use(authController.protectRoutes);

//  =======>>> Get routes <<<=======
router.get("/trainee-wahl", authController.restrictRoutes([14], false), traineeController.retrieveTraineeChoice);
router.get("/trainee-generations", authController.restrictRoutes([14], false), traineeController.retrieveGenerations);
router.get(
  "/trainee-generations-mentor",
  authController.restrictRoutes([14], false),
  traineeController.getMentorsOfGeneration
);
router.get(
  "/internal-projects-of-generation",
  authController.restrictRoutes([14], false),
  traineeController.getInternalProjectsOfGeneration
);
//  =======>>> Post routes <<<=======
router.post("/trainee-add-mentor", authController.restrictRoutes([14], false), traineeController.addMentor);
//  =======>>> Patch routes <<<=======
router.patch(
  "/trainee-wahl-deadline-set",
  authController.restrictRoutes([14], false),
  traineeController.setVotingDeadline
);
router.patch("/trainee-assignment", authController.restrictRoutes([14], false), traineeController.setTraineeAssignment);
//  =======>>> Delete routes <<<=======

module.exports = router;
