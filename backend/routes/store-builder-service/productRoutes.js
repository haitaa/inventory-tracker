import express from "express";

const router = express.Router();

// Tüm ürünleri getir
router.get("/", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
      },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Ürünler getirilirken hata:", error);
    res.status(500).json({ error: "Ürünler yüklenirken bir hata oluştu" });
  }
});

// Belirli bir ürünü getir
router.get("/:id", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: BigInt(id) },
      include: {
        category: true,
        brand: true,
        additionalImages: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Ürün getirilirken hata:", error);
    res.status(500).json({ error: "Ürün yüklenirken bir hata oluştu" });
  }
});

// Ürün oluştur
router.post("/", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const {
      name,
      sku,
      price,
      categoryId,
      brandId,
      description,
      imageUrl,
      cost_price,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        price: parseFloat(price),
        cost_price: cost_price ? parseFloat(cost_price) : null,
        description,
        imageUrl,
        categoryId: categoryId ? BigInt(categoryId) : null,
        brandId: brandId ? BigInt(brandId) : null,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Ürün oluştururken hata:", error);
    res.status(500).json({ error: "Ürün oluşturulurken bir hata oluştu" });
  }
});

// Ürün güncelle
router.put("/:id", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const {
      name,
      sku,
      price,
      categoryId,
      brandId,
      description,
      imageUrl,
      cost_price,
    } = req.body;

    const product = await prisma.product.update({
      where: { id: BigInt(id) },
      data: {
        name,
        sku,
        price: price ? parseFloat(price) : undefined,
        cost_price: cost_price ? parseFloat(cost_price) : null,
        description,
        imageUrl,
        categoryId: categoryId ? BigInt(categoryId) : null,
        brandId: brandId ? BigInt(brandId) : null,
      },
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Ürün güncellenirken hata:", error);
    res.status(500).json({ error: "Ürün güncellenirken bir hata oluştu" });
  }
});

// Ürün sil
router.delete("/:id", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: BigInt(id) },
    });

    res.status(200).json({ message: "Ürün başarıyla silindi" });
  } catch (error) {
    console.error("Ürün silinirken hata:", error);
    res.status(500).json({ error: "Ürün silinirken bir hata oluştu" });
  }
});

export default router;
