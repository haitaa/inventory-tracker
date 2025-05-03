import { Router } from "express";
import {
    createTransaction,
    getTransactions,
    getTransactionById,
    deleteTransaction,
} from "../../controllers/inventory-service/inventoryController.js";
import {requireAuth} from "../../middleware/authMiddleware.js";

const inventoryRouter = Router();

inventoryRouter.post("/", requireAuth, createTransaction);
inventoryRouter.get("/", requireAuth, getTransactions);
inventoryRouter.get("/:id", requireAuth, getTransactionById);
inventoryRouter.delete("/:id", requireAuth, deleteTransaction);

export default inventoryRouter;