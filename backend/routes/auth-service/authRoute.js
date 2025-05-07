import { Router } from "express";
import {
  signIn,
  signOut,
  signUp,
  getMe,
} from "../../controllers/auth-service/authController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);
authRouter.get("/me", requireAuth, getMe);

export default authRouter;
