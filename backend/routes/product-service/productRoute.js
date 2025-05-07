import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
} from "../../controllers/product-service/productController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { productImageUpload } from "../../utils/multerConfig.js";
import express from "express";

const productRouter = Router();

// Statik dosya servis etmek için uploads klasörünü dışa aç
productRouter.use("/uploads", express.static("uploads"));

// Ürün CRUD işlemleri
productRouter.post(
  "/",
  requireAuth,
  productImageUpload.single("image"),
  createProduct
);
productRouter.get("/", requireAuth, getProducts);
productRouter.get("/:id", requireAuth, getProductById);
productRouter.put(
  "/:id",
  requireAuth,
  productImageUpload.single("image"),
  updateProduct
);
productRouter.delete("/:id", requireAuth, deleteProduct);

// Resim işlemleri
productRouter.post(
  "/:id/image",
  requireAuth,
  productImageUpload.single("image"),
  uploadProductImage
);
productRouter.delete("/:id/image", requireAuth, deleteProductImage);

export default productRouter;
