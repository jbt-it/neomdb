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

//  =======>>> Get routes <<<=======
router.get("/", membersController.retrieveMemberList);
router.get("/current-directors", membersController.retrieveCurrentDirectors);
router.get("/departments", membersController.retrieveDepartments);
router.get("/department-members", membersController.retrieveDepartmentMembers);
router.get("/directors", membersController.retrieveDirectors);
router.get("/edv-skills", membersController.retrieveEDVSkills);
router.get("/languages", membersController.retrieveLanguages);
router.get("/permissions", authController.restrictRoutes([1]), membersController.retrievePermissions);
router.get("/permissions-of-members", authController.restrictRoutes([1]), membersController.retrievePermissionsOfMembers);
router.get("/:id", membersController.retrieveMember);

//  =======>>> Post routes <<<=======
router.post("/", authController.restrictRoutes([1]), membersController.createMember);
router.post("/permissions", authController.restrictRoutes([1]), membersController.createPermission);

//  =======>>> Patch routes <<<=======
router.patch("/change-password", membersController.changePassword);
router.patch("/:id", authController.restrictRoutesSelfOrPermission([1]), membersController.updateMember);

//  =======>>> Delete routes <<<=======
router.delete("/permissions", authController.restrictRoutes([1]), membersController.deletePermission);

module.exports = router;