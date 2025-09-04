import express from "express";
import { getAllUsers } from "../controllers/user.controller.js";
// import { authenticate } from "../../_middleware/auth.middleware.js";

const router = express.Router();

// Get all users (for sending invitations)
router.get("/all-users", getAllUsers);

export default router;
