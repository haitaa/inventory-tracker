import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getPaymentMethods,
  processPayment,
  checkPaymentStatus,
  cancelPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// Tüm routelar için auth middleware kullan
router.use(requireAuth);

// Ödeme yöntemlerini getir
router.get("/methods", getPaymentMethods);

// Ödeme işlemi başlat
router.post("/process", processPayment);

// Ödeme durumunu kontrol et
router.get("/status/:id", checkPaymentStatus);

// Ödemeyi iptal et
router.post("/cancel/:id", cancelPayment);

export default router;
