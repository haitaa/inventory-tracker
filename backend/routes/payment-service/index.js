import express from "express";
import paymentRoutes from "./paymentRoutes.js";

const router = express.Router();

// Ana ödeme rotaları
router.use("/", paymentRoutes);

export default router;
