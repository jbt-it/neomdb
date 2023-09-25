/*
 * Definition of the main API routes
 */
import express = require("express");
import authRoutes from "./global/auth/authRoutes";
import membersRoutes from "./members/membersRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", membersRoutes);

export default router;
