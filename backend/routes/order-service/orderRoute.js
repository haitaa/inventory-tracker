import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  updateShippingInfo,
  cancelOrder,
  bulkUpdateOrderStatus,
} from "../../controllers/order-service/orderController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

/**
 * Sipariş yönetimi için router modülü
 * Tüm endpoint'ler /api/orders altında çalışır
 */
const orderRouter = Router();

// Tüm rotalar authentication gerektiriyor
orderRouter.use(requireAuth);

/**
 * Sipariş CRUD işlemleri
 */

// Yeni sipariş oluşturma - POST /api/orders
orderRouter.post("/", createOrder);

// Tüm siparişleri getirme - GET /api/orders
orderRouter.get("/", getOrders);

// ID'ye göre sipariş getirme - GET /api/orders/:id
orderRouter.get("/:id", getOrderById);

/**
 * Sipariş durumu işlemleri
 */

// Sipariş durumunu güncelleme - PATCH /api/orders/:id/status
orderRouter.patch("/:id/status", updateOrderStatus);

// Ödeme durumunu güncelleme - PATCH /api/orders/:id/payment
orderRouter.patch("/:id/payment", updatePaymentStatus);

// Kargo bilgilerini güncelleme - PATCH /api/orders/:id/shipping
orderRouter.patch("/:id/shipping", updateShippingInfo);

// Siparişi iptal etme - POST /api/orders/:id/cancel
orderRouter.post("/:id/cancel", cancelOrder);

// Toplu sipariş durumu güncelleme - PATCH /api/orders/bulk-status
orderRouter.patch("/bulk-status", bulkUpdateOrderStatus);

export default orderRouter;
