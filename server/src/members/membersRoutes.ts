/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
const router = express.Router();

import * as usersController from "./membersController";

router.post("/login", usersController.replyCredentials);

module.exports = router;