/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
const router = express.Router();

import authenticationMiddleware from "../../middleware/authentication";
import { restrictRoutes } from "../../middleware/authorization";
import * as traineesController from "./traineesController";

/**
 * =======>>> ALL routes after this point are accessible for logged in users only <<<=======
 */
router.use(authenticationMiddleware);

//  =======>>> Get routes <<<=======

// Get a specific internal project
router.get("/ip/:id", traineesController.retrieveIP);
// Get team mails
router.get("/ip/:id/mails", traineesController.retrieveTeamMails);
router.get("/", traineesController.retrieveCurrentTrainees);
router.get("/current-ips", traineesController.retrieveCurrentIPs);
router.get("/all-ips", traineesController.retrieveAllIPs);
router.get("/all-trainees", traineesController.retrieveAllTraineesWithIPs);
router.get("/generations/:id/trainee-choices", restrictRoutes([14], false), traineesController.retrieveTraineeChoice);
router.get("/generations/trainee-generations", restrictRoutes([14], false), traineesController.retrieveGenerations);
router.get("/generations/:id/mentors", restrictRoutes([14], false), traineesController.getMentorsOfGeneration);
router.get(
  "/generations/:id/internal-projects",
  restrictRoutes([14], false),
  traineesController.getInternalProjectsOfGeneration
);

//  =======>>> Patch routes <<<=======
router.patch("/ip/:id", traineesController.updateIP);
router.patch("/generations/:id/set-deadline", restrictRoutes([14], false), traineesController.setVotingDeadline);
router.patch("/:id/assignment", restrictRoutes([14], false), traineesController.setTraineeAssignment);

//  =======>>> Post routes <<<=======
router.post("/generations/:id/add-mentor/:member_id", restrictRoutes([14], false), traineesController.addMentor);

//  =======>>> Delete routes <<<=======

export default router;
