import express from "express";
import {
  getCurrentUser,
  verifyToken,
} from "../../controllers/user-service/userController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const userRouter = express.Router();

// Get current logged-in user
userRouter.get("/me", requireAuth, verifyToken, getCurrentUser);

export default userRouter;
