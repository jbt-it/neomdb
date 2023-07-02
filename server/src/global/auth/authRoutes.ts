/**
 * Definition of the API routes and invocation of the correct handler function
 */
import express = require("express");
import authenticationMiddleware from "../../middleware/authentication";
import * as authController from "./authController";

const router = express.Router();

const catchAsync = (fn: Function) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("catchAsync");
    fn(req, res).catch((error: Error) => {
      console.log("Error :>");
      next(error);
    });
  };
};

router.post("/login", catchAsync(authController.login));

/**
 * =======>>> ALL routes after this point are accessible for loged in users only <<<=======
 */
router.use(authenticationMiddleware);
router.get("/user-data", authController.retrieveUserData);
router.post("/logout", authController.logout);

export default router;
