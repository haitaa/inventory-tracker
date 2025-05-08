import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import storeRoutes from "./routes/storeRoutes.js";
import { StoreRepository } from "../infrastructure/repositories/StoreRepository.js";
import { StoreTemplateRepository } from "../infrastructure/repositories/StoreTemplateRepository.js";
import { StorePageRepository } from "../infrastructure/repositories/StorePageRepository.js";

// .env dosyasını yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();

// Middleware'leri ayarla
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Prisma istemcisini oluştur
const prisma = new PrismaClient();

// Repository örneklerini oluştur ve uygulama locals'a ekle
app.locals.prisma = prisma;
app.locals.storeRepository = new StoreRepository(prisma);
app.locals.storeTemplateRepository = new StoreTemplateRepository(prisma);
app.locals.storePageRepository = new StorePageRepository(prisma);

// API rotalarını ekle
app.use("/api", storeRoutes);

// Ana endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Mağaza Builder API",
    version: "1.0.0",
  });
});

// Kapatma işlemlerini yönet
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Veritabanı bağlantısı kapatıldı");
  process.exit(0);
});

// Modül olarak dışa aktar
export default app;
