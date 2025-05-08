import { Router } from "express";
import {
  getWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseStocks,
  getWarehouseTransactions,
} from "../../controllers/inventory-service/warehouseController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const warehouseRouter = Router();

// Tüm depoları listele
warehouseRouter.get("/", requireAuth, getWarehouses);

// ID'ye göre depo detayı
warehouseRouter.get("/:id", requireAuth, getWarehouseById);

// Yeni depo oluştur
warehouseRouter.post("/", requireAuth, createWarehouse);

// Depo güncelle
warehouseRouter.put("/:id", requireAuth, updateWarehouse);

// Depo sil
warehouseRouter.delete("/:id", requireAuth, deleteWarehouse);

// Depodaki stokları getir
warehouseRouter.get("/:id/stocks", requireAuth, getWarehouseStocks);

// Depodaki işlemleri getir
warehouseRouter.get("/:id/transactions", requireAuth, getWarehouseTransactions);

export default warehouseRouter;
