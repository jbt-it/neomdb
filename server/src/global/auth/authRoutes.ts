/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
import { catchAsync } from "../../middleware/errorHandling";
import authenticationMiddleware from "../../middleware/authentication";
import * as authController from "./authController";

const router = express.Router();

router.post("/login", catchAsync(authController.login));

/**
 * =======>>> ALL routes after this point are accessible for loged in users only <<<=======
 */
router.use(authenticationMiddleware);
router.get("/user-data", catchAsync(authController.retrieveUserData));
router.post("/logout", authController.logout);

export default router;
