/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
import authenticationMiddleware from "../../middleware/authentication";
import * as authController from "./authController";

const router = express.Router();

router.post("/login", authController.login);
router.post("/forgot-password", authController.sendPasswordResetLink);
router.patch("/reset-forgot-password", authController.resetPasswordWithKey);

/**
 * =======>>> ALL routes after this point are accessible for loged in users only <<<=======
 */
router.use(authenticationMiddleware);
router.get("/user-data", authController.retrieveUserData);
router.post("/logout", authController.logout);

export default router;
