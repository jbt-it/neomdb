/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
const router = express.Router();

import * as authController from "../global/authController";
import * as usersController from "./membersController";

router.post("/login", usersController.login);

/**
 * =======>>> ALL routes after this point are accessible for loged in users only <<<=======
 */
router.use(authController.protectRoutes);

router.get("/", usersController.retrieveMemberList);
router.get("/permissions", usersController.retrievePermissionsList);
router.post("/permissions", usersController.createPermission);
router.delete("/permissions", usersController.deletePermission);

module.exports = router;