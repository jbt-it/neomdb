/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
const router = express.Router();

import * as traineeController from "./traineesController";
import authenticationMiddleware from "../../middleware/authentication";
import { restrictRoutes } from "../../middleware/authorization";

/**
 * =======>>> ALL routes after this point are accessible for logged in users only <<<=======
 */
router.use(authenticationMiddleware);

//  =======>>> Get routes <<<=======
router.get("/generations/:id/trainee-choices", restrictRoutes([14], false), traineeController.retrieveTraineeChoice);
router.get("/generations/trainee-generations", restrictRoutes([14], false), traineeController.retrieveGenerations);
router.get("/generations/:id/mentors", restrictRoutes([14], false), traineeController.getMentorsOfGeneration);
router.get(
  "/generations/:id/internal-projects",
  restrictRoutes([14], false),
  traineeController.getInternalProjectsOfGeneration
);
//  =======>>> Post routes <<<=======
router.post("/generations/:id/add-mentor/:member_id", restrictRoutes([14], false), traineeController.addMentor);
//  =======>>> Patch routes <<<=======
router.patch("/generations/:id/set-deadline", restrictRoutes([14], false), traineeController.setVotingDeadline);
router.patch("/:id/assignment", restrictRoutes([14], false), traineeController.setTraineeAssignment);
//  =======>>> Delete routes <<<=======

export default router;
