/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
const router = express.Router();

import authenticationMiddleware from "../../middleware/authentication";
import { restrictRoutes } from "../../middleware/authorization";
import * as traineesController from "./traineesController";
import { catchAsync } from "../../middleware/errorHandling";

/**
 * =======>>> ALL routes after this point are accessible for logged in users only <<<=======
 */
router.use(authenticationMiddleware);

//  =======>>> Get routes <<<=======

// Get a specific internal project
router.get("/ip/:id", catchAsync(traineesController.retrieveIP));
// Get team mails
router.get("/ip/:id/mails", catchAsync(traineesController.retrieveTeamMails));
router.get("/", traineesController.retrieveCurrentTrainees);
router.get("/ips/current", catchAsync(traineesController.retrieveCurrentIPs));
router.get("/ips/all", catchAsync(traineesController.retrieveAllIPs));
router.get(
  "/generations/:id/motivation",
  restrictRoutes([14], false),
  catchAsync(traineesController.retrieveTraineeMotivation)
);
router.get(
  "/generations/:id/trainee-choices",
  restrictRoutes([14], false),
  catchAsync(traineesController.retrieveTraineeChoices)
);
// router.get("/generations", restrictRoutes([14], false), catchAsync(traineesController.retrieveGenerations));
router.get("/generations", catchAsync(traineesController.retrieveGenerations));
router.get(
  "/generations/:id/mentors",
  restrictRoutes([14], false),
  catchAsync(traineesController.getMentorsOfGeneration)
);
router.get(
  "/generations/:id/internal-projects",
  restrictRoutes([14], false),
  catchAsync(traineesController.getInternalProjectsOfGeneration)
);
router.get(
  "/generations/:id/internal-projects-and-workshop-feedback",
  restrictRoutes([14], false),
  catchAsync(traineesController.retrieveIPMilestonesAndWorkshopFeedback)
);

//  =======>>> Patch routes <<<=======
router.put("/ip/:id", restrictRoutes([15], false), catchAsync(traineesController.updateIP));
router.post(
  "/generations/:id/set-deadline",
  restrictRoutes([14], false),
  catchAsync(traineesController.setVotingDeadline)
);
router.patch("/:id/assignment", restrictRoutes([14], false), catchAsync(traineesController.setTraineeAssignment));

//  =======>>> Post routes <<<=======
router.post(
  "/generations/:id/add-mentor/:member_id",
  restrictRoutes([14], false),
  catchAsync(traineesController.addMentor)
);

//  =======>>> Delete routes <<<=======

export default router;
