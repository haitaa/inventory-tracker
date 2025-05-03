import { Router } from "express";
import {
    createProduct,
    getProductById,
    getProducts,
    updateProduct,
    deleteProduct
} from "../../controllers/product-service/productController.js";
import {requireAuth} from "../../middleware/authMiddleware.js";

const productRouter = Router();

productRouter.post("/", requireAuth, createProduct);
productRouter.get("/", requireAuth, getProducts);
productRouter.get("/:id", requireAuth, getProductById);
productRouter.put("/:id", requireAuth, updateProduct);
productRouter.delete("/:id", requireAuth, deleteProduct);

export default productRouter;