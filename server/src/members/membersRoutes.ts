/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
const router = express.Router();

import * as usersController from "./membersController";

router.post("/login", usersController.replyCredentials);

/**
 * =======>>> ALL routes after this point are accessible for loged in users only <<<=======
 */
router.use(authController.protectRoutes);

router.get("/", usersController.retrieveMemberList);
module.exports = router;