import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const normalizeProduct = (product) => ({
  ...product,
  id: product.id.toString(),
  userId: product.userId ? product.userId.toString() : null,
});

const prisma = new PrismaClient();

// Resim URL'sini oluşturmak için yardımcı fonksiyon
const getImageUrl = (filename) => {
  return `/uploads/products/${filename}`;
};

export const createProduct = async (req, res, next) => {
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
    const { name, sku, price, cost_price, description, barcode } = req.body;

    const cleanSku = sku.trim();
    const existingSku = await prisma.product.findUnique({
      where: {
        sku: cleanSku,
      },
    });
    if (existingSku) {
      return res.status(409).json({ message: "Product already exists" });
    }

    const parsedPrice = parseFloat(price);
    const parsedCostPrice = cost_price ? parseFloat(cost_price) : null;

    // Resim kontrolü
    let imageUrl = null;
    if (req.file) {
      imageUrl = getImageUrl(req.file.filename);
    }

    const product = await prisma.product.create({
      data: {
        userId: userId,
        name: name,
        sku: cleanSku,
        price: parsedPrice,
        cost_price: parsedCostPrice,
        description: description,
        barcode: barcode,
        imageUrl: imageUrl,
      },
    });
    return res.status(201).json(normalizeProduct(product));
  } catch (error) {
    // Hata durumunda yüklenmiş dosyayı temizle
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Dosya silinirken hata:", unlinkError);
      }
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({ message: "Product already exists" });
    }
    return next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json(products.map(normalizeProduct));
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(normalizeProduct(product));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);
    const { name, sku, price, cost_price, description, barcode } = req.body;

    // Mevcut ürünü bul
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      // Yeni yüklenen dosyayı temizle
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return res.status(404).json({ message: "Product not found" });
    }

    // Resim kontrolü
    let imageUrl = existingProduct.imageUrl;
    if (req.file) {
      imageUrl = getImageUrl(req.file.filename);

      // Eski resmi sil (varsa)
      if (existingProduct.imageUrl) {
        try {
          const oldImagePath = path.join(
            process.cwd(),
            existingProduct.imageUrl.replace(/^\//, "")
          );
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error("Eski resim silinirken hata:", error);
        }
      }
    }

    const updated = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name,
        sku,
        price,
        cost_price,
        description,
        barcode,
        imageUrl,
      },
    });

    return res.status(200).json(normalizeProduct(updated));
  } catch (error) {
    // Hata durumunda yüklenmiş dosyayı temizle
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Dosya silinirken hata:", unlinkError);
      }
    }
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);

    // Ürünü bul
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ürünü sil
    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    // Ürün resmini sil (varsa)
    if (product.imageUrl) {
      try {
        const imagePath = path.join(
          process.cwd(),
          product.imageUrl.replace(/^\//, "")
        );
        await fs.unlink(imagePath);
      } catch (error) {
        console.error("Resim silinirken hata:", error);
      }
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Ürün resmi yükleme/güncelleme
export const uploadProductImage = async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);

    if (!req.file) {
      return res.status(400).json({ message: "Resim dosyası bulunamadı" });
    }

    // Ürünü bul
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      // Yüklenen dosyayı temizle
      await fs.unlink(req.file.path);
      return res.status(404).json({ message: "Product not found" });
    }

    // Eski resmi sil (varsa)
    if (existingProduct.imageUrl) {
      try {
        const oldImagePath = path.join(
          process.cwd(),
          existingProduct.imageUrl.replace(/^\//, "")
        );
        await fs.unlink(oldImagePath);
      } catch (error) {
        console.error("Eski resim silinirken hata:", error);
      }
    }

    // Yeni resim URL'sini kaydet
    const imageUrl = getImageUrl(req.file.filename);

    const updated = await prisma.product.update({
      where: { id },
      data: { imageUrl },
    });

    return res.status(200).json(normalizeProduct(updated));
  } catch (error) {
    // Hata durumunda yüklenmiş dosyayı temizle
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Dosya silinirken hata:", unlinkError);
      }
    }
    next(error);
  }
};

// Ürün resmini silme
export const deleteProductImage = async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);

    // Ürünü bul
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Resim var mı kontrol et
    if (!product.imageUrl) {
      return res.status(404).json({ message: "Product has no image" });
    }

    // Dosyayı sil
    try {
      const imagePath = path.join(
        process.cwd(),
        product.imageUrl.replace(/^\//, "")
      );
      await fs.unlink(imagePath);
    } catch (error) {
      console.error("Resim silinirken hata:", error);
    }

    // Veritabanında resim URL'sini sıfırla
    const updated = await prisma.product.update({
      where: { id },
      data: { imageUrl: null },
    });

    return res.status(200).json(normalizeProduct(updated));
  } catch (error) {
    next(error);
  }
};
