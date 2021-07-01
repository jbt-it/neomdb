import express = require("express");
const router = express.Router();

import * as authController from "./authController";

router.post("/login", authController.login);

module.exports = router;