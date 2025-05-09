import express from "express";
import { publishPage } from "../../controllers/storePageController.js";

const router = express.Router();

// Tüm mağaza sayfalarını getir
router.get("/", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const pages = await prisma.storePage.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.status(200).json(pages);
  } catch (error) {
    console.error("Sayfalar getirilirken hata:", error);
    res.status(500).json({ error: "Sayfalar yüklenirken bir hata oluştu" });
  }
});

// Belirli bir sayfayı getir
router.get("/:id", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const page = await prisma.storePage.findUnique({
      where: { id },
    });

    if (!page) {
      return res.status(404).json({ error: "Sayfa bulunamadı" });
    }

    res.status(200).json(page);
  } catch (error) {
    console.error("Sayfa getirilirken hata:", error);
    res.status(500).json({ error: "Sayfa yüklenirken bir hata oluştu" });
  }
});

// Sayfa bölümlerini getir
router.get("/:id/sections", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const sections = await prisma.pageSection.findMany({
      where: { pageId: id },
      include: {
        componentVersion: {
          include: {
            component: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    res.status(200).json(sections);
  } catch (error) {
    console.error("Sayfa bölümleri getirilirken hata:", error);
    res
      .status(500)
      .json({ error: "Sayfa bölümleri yüklenirken bir hata oluştu" });
  }
});

// Yeni sayfa oluştur
router.post("/", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { title, slug, metaTitle, metaDescription, isHomePage } = req.body;

    // Slug kontrolü
    const existingPage = await prisma.storePage.findFirst({
      where: { slug },
    });

    if (existingPage) {
      return res.status(400).json({ error: "Bu URL slug zaten kullanılıyor" });
    }

    const page = await prisma.storePage.create({
      data: {
        storeId: "1", // Gerçek uygulamada doğru mağaza ID'si gelecek
        title,
        slug,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || "",
        isHomePage: isHomePage || false,
        isPublished: false,
      },
    });

    res.status(201).json(page);
  } catch (error) {
    console.error("Sayfa oluşturulurken hata:", error);
    res.status(500).json({ error: "Sayfa oluşturulurken bir hata oluştu" });
  }
});

// Sayfa bilgilerini güncelle
router.put("/:id", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const { title, slug, metaTitle, metaDescription, isHomePage, isPublished } =
      req.body;

    // Slug değiştiyse ve başka bir sayfa bu slug'ı kullanıyorsa kontrol et
    if (slug) {
      const existingPage = await prisma.storePage.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (existingPage) {
        return res
          .status(400)
          .json({ error: "Bu URL slug zaten kullanılıyor" });
      }
    }

    const updatedPage = await prisma.storePage.update({
      where: { id },
      data: {
        title,
        slug,
        metaTitle,
        metaDescription,
        isHomePage,
        isPublished,
      },
    });

    res.status(200).json(updatedPage);
  } catch (error) {
    console.error("Sayfa güncellenirken hata:", error);
    res.status(500).json({ error: "Sayfa güncellenirken bir hata oluştu" });
  }
});

// Sayfayı sil
router.delete("/:id", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;

    // Önce sayfa bölümlerini sil
    await prisma.pageSection.deleteMany({
      where: { pageId: id },
    });

    // Sonra sayfayı sil
    await prisma.storePage.delete({
      where: { id },
    });

    res.status(200).json({ message: "Sayfa başarıyla silindi" });
  } catch (error) {
    console.error("Sayfa silinirken hata:", error);
    res.status(500).json({ error: "Sayfa silinirken bir hata oluştu" });
  }
});

// Sayfayı yayınla veya yayından kaldır
router.put("/:id/publish", publishPage);

// Bölümleri yeniden sırala
router.put("/:id/sections/reorder", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const { sectionIds } = req.body;

    if (!Array.isArray(sectionIds)) {
      return res.status(400).json({ error: "Bölüm ID'leri dizi olmalıdır" });
    }

    // Sıralama güncelleme işlemleri
    const updates = sectionIds.map((sectionId, index) => {
      return prisma.pageSection.update({
        where: { id: sectionId },
        data: { order: index + 1 },
      });
    });

    await prisma.$transaction(updates);

    res.status(200).json({ message: "Bölüm sıralaması güncellendi" });
  } catch (error) {
    console.error("Bölüm sıralaması güncellenirken hata:", error);
    res
      .status(500)
      .json({ error: "Bölüm sıralaması güncellenirken bir hata oluştu" });
  }
});

export default router;
