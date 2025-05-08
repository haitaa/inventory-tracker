import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Veri normalizasyonu için yardımcı fonksiyon
 */
const normalizeWarehouse = (warehouse) => ({
  ...warehouse,
  id: warehouse.id.toString(),
});

/**
 * Tüm depoları listeler
 */
export const getWarehouses = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);

    // Kullanıcıya ait tüm depoları bul
    const warehouses = await prisma.warehouse.findMany({
      where: {
        Stock: {
          some: {
            userId,
          },
        },
      },
    });

    return res.status(200).json(warehouses.map(normalizeWarehouse));
  } catch (error) {
    next(error);
  }
};

/**
 * ID'ye göre depo detayı getirir
 */
export const getWarehouseById = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);
    const warehouseId = BigInt(req.params.id);

    // İlgili depoyu bul
    const warehouse = await prisma.warehouse.findFirst({
      where: {
        id: warehouseId,
        Stock: {
          some: {
            userId,
          },
        },
      },
    });

    if (!warehouse) {
      return res.status(404).json({ message: "Depo bulunamadı" });
    }

    return res.status(200).json(normalizeWarehouse(warehouse));
  } catch (error) {
    next(error);
  }
};

/**
 * Yeni depo oluşturur
 */
export const createWarehouse = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);
    const {
      name,
      code,
      address,
      city,
      district,
      postalCode,
      country,
      phone,
      email,
      managerName,
      capacity,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Depo adı gereklidir" });
    }

    console.log("Gelen capacity değeri:", capacity);

    // Yeni depo oluştur
    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        code,
        address,
        city,
        district,
        postalCode,
        country,
        phone,
        email,
        managerName,
        capacity: capacity ? Number(capacity) : null,
        usedCapacity: 0,
      },
    });

    // Kullanıcı ile ilişkilendirmek için boş bir stok kaydı oluştur
    // Bu, kullanıcıya depoyu bağlamak için bir yöntem
    await prisma.stock.create({
      data: {
        warehouseId: warehouse.id,
        userId,
        productId: 1n, // Bu sadece ilişki için var, gerçek bir ürün olmayabilir
        quantity: 0,
      },
    });

    return res.status(201).json(normalizeWarehouse(warehouse));
  } catch (error) {
    console.error("Depo oluşturma hatası:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res
          .status(400)
          .json({ message: "Bu kod ile bir depo zaten var" });
      }
    }
    next(error);
  }
};

/**
 * Depo bilgilerini günceller
 */
export const updateWarehouse = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);
    const warehouseId = BigInt(req.params.id);
    const {
      name,
      code,
      address,
      city,
      district,
      postalCode,
      country,
      phone,
      email,
      managerName,
      capacity,
    } = req.body;

    // Önce deponun kullanıcıya ait olup olmadığını kontrol et
    const existingWarehouse = await prisma.warehouse.findFirst({
      where: {
        id: warehouseId,
        Stock: {
          some: {
            userId,
          },
        },
      },
    });

    if (!existingWarehouse) {
      return res.status(404).json({ message: "Depo bulunamadı" });
    }

    // Depoyu güncelle
    const updatedWarehouse = await prisma.warehouse.update({
      where: {
        id: warehouseId,
      },
      data: {
        name,
        code,
        address,
        city,
        district,
        postalCode,
        country,
        phone,
        email,
        managerName,
        capacity: capacity ? Number(capacity) : null,
      },
    });

    return res.status(200).json(normalizeWarehouse(updatedWarehouse));
  } catch (error) {
    console.error("Depo güncelleme hatası:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res
          .status(400)
          .json({ message: "Bu kod ile bir depo zaten var" });
      }
    }
    next(error);
  }
};

/**
 * Depo siler
 */
export const deleteWarehouse = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);
    const warehouseId = BigInt(req.params.id);

    // Önce deponun kullanıcıya ait olup olmadığını kontrol et
    const existingWarehouse = await prisma.warehouse.findFirst({
      where: {
        id: warehouseId,
        Stock: {
          some: {
            userId,
          },
        },
      },
    });

    if (!existingWarehouse) {
      return res.status(404).json({ message: "Depo bulunamadı" });
    }

    // Önce bu depoya bağlı tüm stok kayıtlarını sil
    await prisma.stock.deleteMany({
      where: {
        warehouseId,
      },
    });

    // Sonra bu depoya bağlı tüm envanter işlemlerini sil
    await prisma.inventoryTransaction.deleteMany({
      where: {
        warehouseId,
      },
    });

    // Son olarak depoyu sil
    await prisma.warehouse.delete({
      where: {
        id: warehouseId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Depodaki tüm stokları getirir
 */
export const getWarehouseStocks = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);
    const warehouseId = BigInt(req.params.id);

    // Önce deponun kullanıcıya ait olup olmadığını kontrol et
    const existingWarehouse = await prisma.warehouse.findFirst({
      where: {
        id: warehouseId,
        Stock: {
          some: {
            userId,
          },
        },
      },
    });

    if (!existingWarehouse) {
      return res.status(404).json({ message: "Depo bulunamadı" });
    }

    // Depodaki stokları getir
    const stocks = await prisma.stock.findMany({
      where: {
        warehouseId: warehouseId,
        userId: userId,
      },
      include: {
        product: true,
      },
      orderBy: {
        quantity: "desc",
      },
    });

    // Stok verilerini normalize et
    const normalizedStocks = stocks.map((stock) => ({
      ...stock,
      id: stock.id.toString(),
      productId: stock.productId.toString(),
      warehouseId: stock.warehouseId.toString(),
      userId: stock.userId.toString(),
      product: stock.product
        ? {
            ...stock.product,
            id: stock.product.id.toString(),
            userId: stock.product.userId
              ? stock.product.userId.toString()
              : null,
            categoryId: stock.product.categoryId
              ? stock.product.categoryId.toString()
              : null,
            brandId: stock.product.brandId
              ? stock.product.brandId.toString()
              : null,
            supplierId: stock.product.supplierId
              ? stock.product.supplierId.toString()
              : null,
          }
        : null,
    }));

    return res.status(200).json(normalizedStocks);
  } catch (error) {
    console.error("Depodaki stokları getirme hatası:", error);
    next(error);
  }
};

/**
 * Depodaki işlemleri getirir
 */
export const getWarehouseTransactions = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);
    const warehouseId = BigInt(req.params.id);

    // Önce deponun kullanıcıya ait olup olmadığını kontrol et
    const existingWarehouse = await prisma.warehouse.findFirst({
      where: {
        id: warehouseId,
        Stock: {
          some: {
            userId,
          },
        },
      },
    });

    if (!existingWarehouse) {
      return res.status(404).json({ message: "Depo bulunamadı" });
    }

    // Depodaki işlemleri getir
    const transactions = await prisma.inventoryTransaction.findMany({
      where: {
        warehouseId: warehouseId,
        userId: userId,
      },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Son 50 işlemi getir
    });

    // İşlem verilerini normalize et
    const normalizedTransactions = transactions.map((tx) => ({
      ...tx,
      id: tx.id.toString(),
      productId: tx.productId.toString(),
      warehouseId: tx.warehouseId.toString(),
      userId: tx.userId ? tx.userId.toString() : null,
      createdAt:
        tx.createdAt instanceof Date
          ? tx.createdAt.toISOString()
          : tx.createdAt,
      product: tx.product
        ? {
            ...tx.product,
            id: tx.product.id.toString(),
            userId: tx.product.userId ? tx.product.userId.toString() : null,
            categoryId: tx.product.categoryId
              ? tx.product.categoryId.toString()
              : null,
            brandId: tx.product.brandId ? tx.product.brandId.toString() : null,
            supplierId: tx.product.supplierId
              ? tx.product.supplierId.toString()
              : null,
          }
        : null,
      user: tx.user
        ? {
            ...tx.user,
            id: tx.user.id.toString(),
          }
        : null,
    }));

    return res.status(200).json(normalizedTransactions);
  } catch (error) {
    console.error("Depodaki işlemleri getirme hatası:", error);
    next(error);
  }
};
