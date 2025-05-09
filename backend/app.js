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
import componentRouter from "./routes/component-service/componentRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import dotenv from "dotenv";
import storeBuilderApi from "./api/server.js";

// Service modülleri
import mediaService from "./routes/media-service/index.js";
import paymentService from "./routes/payment-service/index.js";
import storeBuilderService from "./routes/store-builder-service/index.js";

// .env dosyasını yükle
dotenv.config();

const app = express();

// Prisma client'ı tüm uygulamada kullanılabilir hale getir
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
app.locals.prisma = prisma;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.use("/payments", paymentService);

// Store Builder API'yi /store-builder yoluna monte et
app.use("/store-builder", storeBuilderApi);

// API Rotaları
app.use("/api", storeBuilderService); // Store Builder API'si
app.use("/api/media", mediaService); // Medya API'si
app.use("/api/components", componentRouter); // Bileşen API'si

// Hata işleme middleware'leri
app.use(notFound); // 404 hataları için
app.use(errorHandler); // Genel hata işleme

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ${NODE_ENV}`);
});

// Kapatma işlemlerini yönet
process.on("SIGINT", () => {
  console.log("Uygulama kapatılıyor");
  // Prisma bağlantısını kapat
  prisma.$disconnect();
  process.exit(0);
});
