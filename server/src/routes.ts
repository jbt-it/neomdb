/*
 * Definition of the main API routes
 */
import express = require("express");
import authRoutes from "./auth/authRoutes";
import membersRoutes from "./resources/members/membersRoutes";
import traineesRoutes from "./resources/trainees/traineesRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", membersRoutes);
router.use("/trainees", traineesRoutes);

export default router;
