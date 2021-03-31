/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
const router = express.Router();

import * as authController from "../global/authController";
import * as membersController from "./membersController";

router.post("/login", membersController.login);

/**
 * =======>>> ALL routes after this point are accessible for loged in users only <<<=======
 */
router.use(authController.protectRoutes);
router.get("/", membersController.retrieveMemberList);
router.get("/directors", membersController.retrieveDirectors);
router.get("/department-members", membersController.retrieveDepartmentMembers);
router.get("/:id", membersController.retrieveMember);
router.patch("/:id", authController.restrictRoutesSelfOrPermission([1]), membersController.updateMember);

/**
 * =======>>> ALL routes after this point are restricted to certain roles <<<=======
 */
router.use(authController.restrictRoutes([1]));
router.post("/", membersController.createMember);
router.get("/permissions", membersController.retrievePermissionsList);
router.post("/permissions", membersController.createPermission);
router.delete("/permissions", membersController.deletePermission);

module.exports = router;