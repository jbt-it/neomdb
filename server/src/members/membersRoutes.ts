/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
const router = express.Router();

import * as authController from "../global/authController";
import * as usersController from "./membersController";

router.post("/login", usersController.replyCredentials);

/**
 * =======>>> ALL routes after this point are accessible for loged in users only <<<=======
 */
router.use(authController.protectRoutes);

router.get("/", usersController.retrieveMemberList);

/**
 * =======>>> ALL routes after this point are restricted to certain roles <<<=======
 */
router.use(authController.restrictRoutes([1]));
router.post("/", usersController.createNewMember);

module.exports = router;