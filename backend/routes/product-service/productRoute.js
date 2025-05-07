import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
  getProductStats,
} from "../../controllers/product-service/productController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { productImageUpload } from "../../utils/multerConfig.js";
import express from "express";

/**
 * Ürün yönetimi için router modülü
 * Tüm endpoint'ler /api/products altında çalışır
 */
const productRouter = Router();

/**
 * Statik dosyalar için servis ayarı
 * /api/products/uploads yolundan resimler sunulur
 */
productRouter.use("/uploads", express.static("uploads"));

/**
 * Ürün CRUD işlemleri
 * Her endpoint kimlik doğrulaması gerektirir (requireAuth middleware)
 */

// Yeni ürün oluşturma - POST /api/products
productRouter.post(
  "/",
  requireAuth,
  productImageUpload.single("image"),
  createProduct
);

// Tüm ürünleri getirme - GET /api/products
productRouter.get("/", requireAuth, getProducts);

/**
 * İstatistik endpoint'i
 * URL parametre içeren rotalardan önce tanımlanmalıdır, yoksa Express
 * 'stats' kelimesini bir ID parametresi olarak yorumlar
 */
productRouter.get("/stats", requireAuth, getProductStats);

/**
 * ID parametresi içeren rotalar
 * NOT: Bu rotaların sıralaması önemlidir - spesifik rotalardan sonra tanımlanmalıdır
 */

// ID'ye göre ürün getirme - GET /api/products/:id
productRouter.get("/:id", requireAuth, getProductById);

// Ürünü güncelleme - PUT /api/products/:id
productRouter.put(
  "/:id",
  requireAuth,
  productImageUpload.single("image"),
  updateProduct
);

// Ürünü silme - DELETE /api/products/:id
productRouter.delete("/:id", requireAuth, deleteProduct);

/**
 * Ürün resmi işlemleri
 * Bu endpoint'ler spesifik bir ürünün resmini yönetir
 */

// Ürüne resim yükleme - POST /api/products/:id/image
productRouter.post(
  "/:id/image",
  requireAuth,
  productImageUpload.single("image"),
  uploadProductImage
);

// Ürün resmini silme - DELETE /api/products/:id/image
productRouter.delete("/:id/image", requireAuth, deleteProductImage);

export default productRouter;
