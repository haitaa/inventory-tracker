import express from "express";
import { StoreController } from "../controllers/StoreController.js";
import { CreateStoreUseCase } from "../../application/usecases/store/CreateStoreUseCase.js";
import { StoreRepository } from "../../infrastructure/repositories/StoreRepository.js";
import { StoreTemplateRepository } from "../../infrastructure/repositories/StoreTemplateRepository.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Repository örneklerini oluştur
const storeRepository = new StoreRepository(prisma);
const storeTemplateRepository = new StoreTemplateRepository(prisma);

// Use case örneklerini oluştur
const createStoreUseCase = new CreateStoreUseCase(
  storeRepository,
  storeTemplateRepository
);

// Controller örneklerini oluştur
const storeController = new StoreController(createStoreUseCase);

// Mağaza rotaları
router.post("/stores", authMiddleware, (req, res) =>
  storeController.createStore(req, res)
);
router.get("/stores", authMiddleware, (req, res) =>
  storeController.getUserStores(req, res)
);
router.get("/stores/:id", authMiddleware, (req, res) =>
  storeController.getStoreById(req, res)
);

export default router;
