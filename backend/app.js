import express from "express";
import cors from "cors";
import path from "path";
import { PORT, NODE_ENV } from "./config/env.js";
import productRouter from "./routes/product-service/productRoute.js";
import inventoryRouter from "./routes/inventory-service/inventoryRoute.js";
import warehouseRouter from "./routes/inventory-service/warehouseRoute.js";
import authRouter from "./routes/auth-service/authRoute.js";
import userRouter from "./routes/user-service/userRoute.js";
import fileImportRouter from "./routes/file-service/fileRoute.js";
import customerRouter from "./routes/customer-service/customerRoute.js";
import orderRouter from "./routes/order-service/orderRoute.js";
import paymentRouter from "./routes/paymentRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL'si
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Statik dosya servis etmek için uploads klasörünü dışa aç
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/files", fileImportRouter);
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/inventory", inventoryRouter);
app.use("/warehouses", warehouseRouter);
app.use("/user", userRouter);
app.use("/customers", customerRouter);
app.use("/orders", orderRouter);
app.use("/payments", paymentRouter);

// Hata işleme middleware'leri
app.use(notFound); // 404 hataları için
app.use(errorHandler); // Genel hata işleme

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ${NODE_ENV}`);
});
