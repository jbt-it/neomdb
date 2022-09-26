/**
 * Definition of the API routes and invocation of the correct handler function
 */
 import express = require("express");
 const router = express.Router();
 
 import * as authController from "../global/auth/authController";
 import * as traineesController from "./traineesController";
 

/**
 * =======>>> ALL routes after this point are accessible for logged in users only <<<=======
 */
 router.use(authController.protectRoutes);
 
 //  =======>>> Get routes <<<=======
 router.get("/", traineesController.retrieveCurrentTrainees);
 router.get("/currentIPs", traineesController.retrieveCurrentIPs);

 
 module.exports = router;