import { Router } from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerOrders,
} from "../../controllers/customer-service/customerController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

/**
 * Müşteri yönetimi için router modülü
 * Tüm endpoint'ler /api/customers altında çalışır
 */
const customerRouter = Router();

// Tüm rotalar authentication gerektiriyor
customerRouter.use(requireAuth);

/**
 * Müşteri CRUD işlemleri
 */

// Yeni müşteri oluşturma - POST /api/customers
customerRouter.post("/", createCustomer);

// Tüm müşterileri getirme - GET /api/customers
customerRouter.get("/", getCustomers);

// ID'ye göre müşteri getirme - GET /api/customers/:id
customerRouter.get("/:id", getCustomerById);

// Müşteriyi güncelleme - PUT /api/customers/:id
customerRouter.put("/:id", updateCustomer);

// Müşteriyi silme - DELETE /api/customers/:id
customerRouter.delete("/:id", deleteCustomer);

/**
 * Müşteri ile ilgili ek işlemler
 */

// Müşterinin siparişlerini getirme - GET /api/customers/:id/orders
customerRouter.get("/:id/orders", getCustomerOrders);

export default customerRouter;
