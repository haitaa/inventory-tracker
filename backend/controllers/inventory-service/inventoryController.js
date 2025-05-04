import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const normalizeTransaction = (transaction) => ({
  ...transaction,
  id: transaction.id.toString(),
  productId: transaction.productId.toString(),
  warehouseId: transaction.warehouseId.toString(),
  userId: transaction.userId.toString(),
  createdAt:
    transaction.createdAt instanceof Date
      ? transaction.createdAt.toISOString()
      : transaction.createdAt,
});

const normalizeStock = (stock) => ({
  ...stock,
  id: stock.id.toString(),
  productId: stock.productId.toString(),
  userId: stock.userId.toString(),
  warehouseId: stock.warehouseId.toString(),
});

export const createTransaction = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId, warehouseId, type, quantity } = req.body;
    const prodId = BigInt(productId);
    const whId = BigInt(warehouseId);
    const productExists = await prisma.product.findUnique({
      where: {
        id: prodId,
      },
    });
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }
    const warehouseExists = await prisma.warehouse.findUnique({
      where: {
        id: whId,
      },
    });
    if (!warehouseExists) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    const [transaction, stock] = await prisma.$transaction([
      prisma.inventoryTransaction.create({
        data: {
          userId: userId,
          productId,
          warehouseId,
          type,
          quantity,
        },
      }),
      prisma.stock.upsert({
        where: {
          productId_warehouseId: { productId, warehouseId },
        },
        update: {
          quantity: {
            increment: type === "IN" ? quantity : -quantity,
          },
          version: { increment: 1 },
        },
        create: {
          productId,
          warehouseId,
          userId,
          quantity: type === "IN" ? quantity : -quantity,
        },
      }),
    ]);

    return res.status(201).json({
      transaction: normalizeTransaction(transaction),
      updatedStock: normalizeStock(stock),
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return res
          .status(400)
          .json({ error: "Invalid productId or warehouseId" });
      }
      if (error.code === "P2025") {
        return res.status(400).json({ error: "Invalid quantity" });
      }
    }
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await prisma.inventoryTransaction.findMany();
    if (!transactions) {
      return res.status(404).json({ message: "Transactions not found" });
    }
    return res.json(transactions.map(normalizeTransaction));
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);
    const transaction = await prisma.inventoryTransaction.findUnique({
      where: {
        id: id,
      },
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    return res.json(normalizeTransaction(transaction));
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);
    await prisma.inventoryTransaction.delete({
      where: {
        id: id,
      },
    });
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getInventoryTransactionsByProductId = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(req.params);
    const userId = BigInt(req.userId);
    const productId = BigInt(req.params.productId);

    const transactions = await prisma.inventoryTransaction.findMany({
      where: {
        productId: productId,
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(transactions.map(normalizeTransaction));
  } catch (error) {
    next(error);
  }
};
