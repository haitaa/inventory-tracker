import express from "express";
import mediaRoutes from "./mediaRoutes.js";

const router = express.Router();

// Ana medya rotaları
router.use("/", mediaRoutes);

export default router;
