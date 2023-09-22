/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
import { catchAsync } from "../middleware/errorHandling";
import authenticationMiddleware from "../middleware/authentication";
import * as authController from "./authController";

const router = express.Router();

router.post("/login", catchAsync(authController.login));

/**
 * =======>>> ALL routes after this point are accessible for loged in users only <<<=======
 */
router.use(authenticationMiddleware);
router.post("/forgot-password", catchAsync(authController.sendPasswordResetLink));
router.patch("/reset-forgot-password", catchAsync(authController.resetPasswordWithKey));
router.patch("/change-password", catchAsync(authController.changePassword));
router.get("/user-data", catchAsync(authController.retrieveUserData));
router.post("/logout", authController.logout);

export default router;
