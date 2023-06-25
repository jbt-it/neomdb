/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
import authenticationMiddleware from "../middleware/authentication";
import { restrictRoutes, restrictRoutesSelfOrPermission } from "../middleware/authorization";
const router = express.Router();

import * as authController from "../global/auth/authController";
import * as traineesController from "./traineesController";

/**
 * =======>>> ALL routes after this point are accessible for logged in users only <<<=======
 */
router.use(authenticationMiddleware);

//  =======>>> Get routes <<<=======
router.get("/", traineesController.retrieveCurrentTrainees);
router.get("/current-ips", traineesController.retrieveCurrentIPs);
router.get("/current-ips/all-ips", traineesController.retrieveAllIPs);
router.get("/current-ips/all-trainees", traineesController.retrieveAllTrainees);

export default router;
//module.exports = router;
