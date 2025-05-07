import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

/**
 * Yardımcı fonksiyon: BigInt ID değerlerini normal string'e dönüştürür
 * @param {object} product - Dönüştürülecek ürün nesnesi
 * @returns {object} - ID'leri string'e dönüştürülmüş ürün nesnesi
 */
const normalizeProduct = (product) => ({
  ...product,
  id: product.id.toString(),
  userId: product.userId ? product.userId.toString() : null,
});

const prisma = new PrismaClient();

/**
 * Yardımcı fonksiyon: Ürün resmi için URL oluşturur
 * @param {string} filename - Dosya adı
 * @returns {string} - Oluşturulan URL
 */
const getImageUrl = (filename) => {
  return `/uploads/products/${filename}`;
};

/**
 * Yeni ürün oluşturur.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Oluşturulan ürün bilgisi veya hata mesajı
 */
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

/**
 * Tüm ürünleri getirir.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Ürün listesi veya hata mesajı
 */
export const getProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json(products.map(normalizeProduct));
  } catch (error) {
    next(error);
  }
};

/**
 * ID'ye göre ürün getirir.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Ürün bilgisi veya hata mesajı
 */
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

/**
 * Ürün bilgilerini günceller. Sadece ürün sahibi güncelleyebilir.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Güncellenmiş ürün bilgisi veya hata mesajı
 */
export const updateProduct = async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);
    const userId = BigInt(req.userId);
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

    // Kullanıcının ürün sahibi olup olmadığını kontrol et
    if (existingProduct.userId !== userId) {
      // Yeni yüklenen dosyayı temizle
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return res
        .status(403)
        .json({ message: "Sadece ürün sahibi güncelleyebilir" });
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

/**
 * Ürünü siler. Sadece ürün sahibi silebilir.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Başarı durumu veya hata mesajı
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);
    const userId = BigInt(req.userId);

    // Ürünü bul
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Kullanıcının ürün sahibi olup olmadığını kontrol et
    if (product.userId !== userId) {
      return res.status(403).json({ message: "Sadece ürün sahibi silebilir" });
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

/**
 * Ürüne resim ekler veya mevcut resmi günceller. Sadece ürün sahibi ekleyebilir.
 * @param {Request} req - Express request nesnesi (resim dosyası req.file içinde bulunmalı)
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Güncellenmiş ürün bilgisi veya hata mesajı
 */
export const uploadProductImage = async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);
    const userId = BigInt(req.userId);

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

    // Kullanıcının ürün sahibi olup olmadığını kontrol et
    if (existingProduct.userId !== userId) {
      // Yüklenen dosyayı temizle
      await fs.unlink(req.file.path);
      return res
        .status(403)
        .json({ message: "Sadece ürün sahibi resim ekleyebilir" });
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

/**
 * Ürün resmini siler. Sadece ürün sahibi silebilir.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Güncellenmiş ürün bilgisi veya hata mesajı
 */
export const deleteProductImage = async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);
    const userId = BigInt(req.userId);

    // Ürünü bul
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Kullanıcının ürün sahibi olup olmadığını kontrol et
    if (product.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Sadece ürün sahibi resim silebilir" });
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

/**
 * Ürün istatistiklerini getirir. Giriş yapmış kullanıcının sadece kendi ürünlerinin sayısını döndürür.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Ürün istatistikleri veya hata mesajı
 */
export const getProductStats = async (req, res, next) => {
  try {
    // Kullanıcı kimliğini al
    const userId = req.userId ? BigInt(req.userId) : null;

    // Eğer kullanıcı girişi yapılmışsa sadece o kullanıcının ürünlerini say
    const totalProducts = await prisma.product.count({
      where: userId
        ? {
            userId: userId,
          }
        : undefined,
    });

    return res.status(200).json({
      totalProducts,
    });
  } catch (error) {
    next(error);
  }
};
