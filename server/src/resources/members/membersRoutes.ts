/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
import authenticationMiddleware from "../../middleware/authentication";
import { checkDepartmentAccess, restrictRoutes, restrictRoutesSelfOrPermission } from "../../middleware/authorization";
import { catchAsync } from "../../middleware/errorHandling";
import * as membersController from "./membersController";

const router = express.Router();

/**
 * Holds all permission IDs
 * (Can be used if a route should only be accessed if it has at least one of all possible permissions)
 */
const ALL_PERMISSIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 20, 21, 22, 23, 24, 100];

/**
 * =======>>> ALL routes after this point are accessible for logged in users only <<<=======
 */
router.use(authenticationMiddleware);

//  =======>>> Get routes <<<=======
router.get("/", catchAsync(membersController.retrieveMemberList));
router.get("/current-directors", membersController.retrieveCurrentDirectors);
router.get("/departments", membersController.retrieveDepartments);
router.get("/department-members", catchAsync(membersController.retrieveMembersOfDepartments));
router.get("/directors", membersController.retrieveDirectors);
router.get("/edv-skills", membersController.retrieveEDVSkills);
router.get("/languages", membersController.retrieveLanguages);
router.get("/permissions", restrictRoutes(ALL_PERMISSIONS, false), membersController.retrievePermissions);
router.get(
  "/permissions-of-members",
  restrictRoutes(ALL_PERMISSIONS, false),
  membersController.retrievePermissionsOfMembers
);
router.get("/:id", catchAsync(membersController.retrieveMember));
router.get("/:id/permissions", membersController.retrievePermissionsByMemberId);

//  =======>>> Post routes <<<=======
router.post("/", restrictRoutes([1]), membersController.createMember);
router.post("/permissions", restrictRoutes(ALL_PERMISSIONS, false), membersController.createPermission);

//  =======>>> Patch routes <<<=======
router.patch("/departments/:id", checkDepartmentAccess, membersController.updateDepartmentInfo);
router.patch("/:id", restrictRoutesSelfOrPermission([1]), membersController.updateMember);

//  =======>>> Delete routes <<<=======
router.delete("/permissions", restrictRoutes(ALL_PERMISSIONS, false), membersController.deletePermission);
router.delete("/:id", restrictRoutes([1], false), membersController.deleteMember);

export default router;