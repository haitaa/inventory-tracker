import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Tüm mağazaları getir
router.get("/", async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        template: true,
        user: true,
      },
    });
    res.status(200).json(stores);
  } catch (error) {
    console.error("Mağazalar getirilirken hata:", error);
    res.status(500).json({ error: "Mağazalar yüklenirken bir hata oluştu" });
  }
});

// Varsayılan mağazayı getir
router.get("/default", async (req, res) => {
  try {
    // Kullanıcının son aktif mağazasını veya varsayılan olarak işaretlenmiş bir mağazayı getir
    const store = await prisma.store.findFirst({
      where: {
        active: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        user: true,
      },
    });

    if (!store) {
      return res.status(404).json({ error: "Varsayılan mağaza bulunamadı" });
    }

    res.status(200).json(store);
  } catch (error) {
    console.error("Varsayılan mağaza getirilirken hata:", error);
    res
      .status(500)
      .json({ error: "Varsayılan mağaza yüklenirken bir hata oluştu" });
  }
});

// Belirli bir mağazayı getir
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        template: true,
        user: true,
        themes: true,
      },
    });

    if (!store) {
      return res.status(404).json({ error: "Mağaza bulunamadı" });
    }

    res.status(200).json(store);
  } catch (error) {
    console.error("Mağaza getirilirken hata:", error);
    res.status(500).json({ error: "Mağaza yüklenirken bir hata oluştu" });
  }
});

// Yeni mağaza oluştur
router.post("/", async (req, res) => {
  try {
    const { name, description, logo, subdomain, templateId, userId } = req.body;

    // Kullanıcı ID kontrolü
    if (!userId) {
      return res.status(400).json({ error: "Kullanıcı ID zorunludur" });
    }

    // Subdomain kontrolü
    if (subdomain) {
      const existingStore = await prisma.store.findFirst({
        where: { subdomain },
      });

      if (existingStore) {
        return res
          .status(400)
          .json({ error: "Bu subdomain zaten kullanılıyor" });
      }
    }

    const store = await prisma.store.create({
      data: {
        name,
        description,
        logo,
        subdomain,
        templateId,
        userId: BigInt(userId), // BigInt'e çevirme
        isActive: true,
        isPublished: false,
      },
    });

    res.status(201).json(store);
  } catch (error) {
    console.error("Mağaza oluşturulurken hata:", error);
    res.status(500).json({ error: "Mağaza oluşturulurken bir hata oluştu" });
  }
});

// Mağaza güncelle
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      logo,
      subdomain,
      domain,
      isActive,
      isPublished,
    } = req.body;

    // Subdomain değiştiyse kontrol et
    if (subdomain) {
      const existingStore = await prisma.store.findFirst({
        where: {
          subdomain,
          id: { not: id },
        },
      });

      if (existingStore) {
        return res
          .status(400)
          .json({ error: "Bu subdomain zaten kullanılıyor" });
      }
    }

    // Domain değiştiyse kontrol et
    if (domain) {
      const existingStore = await prisma.store.findFirst({
        where: {
          domain,
          id: { not: id },
        },
      });

      if (existingStore) {
        return res.status(400).json({ error: "Bu domain zaten kullanılıyor" });
      }
    }

    const store = await prisma.store.update({
      where: { id },
      data: {
        name,
        description,
        logo,
        subdomain,
        domain,
        isActive,
        isPublished,
      },
    });

    res.status(200).json(store);
  } catch (error) {
    console.error("Mağaza güncellenirken hata:", error);
    res.status(500).json({ error: "Mağaza güncellenirken bir hata oluştu" });
  }
});

// Mağaza teması oluştur
router.post("/:id/themes", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, variables, isDefault } = req.body;

    // Mağaza kontrolü
    const store = await prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      return res.status(404).json({ error: "Mağaza bulunamadı" });
    }

    // Tema adı kontrolü
    const existingTheme = await prisma.storeTheme.findFirst({
      where: {
        storeId: id,
        name,
      },
    });

    if (existingTheme) {
      return res.status(400).json({ error: "Bu tema adı zaten kullanılıyor" });
    }

    // Eğer bu tema varsayılan olacaksa, diğer temaları varsayılan olmaktan çıkar
    if (isDefault) {
      await prisma.storeTheme.updateMany({
        where: {
          storeId: id,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const theme = await prisma.storeTheme.create({
      data: {
        storeId: id,
        name,
        description,
        variables: variables || {},
        isDefault: isDefault || false,
      },
    });

    res.status(201).json(theme);
  } catch (error) {
    console.error("Tema oluşturulurken hata:", error);
    res.status(500).json({ error: "Tema oluşturulurken bir hata oluştu" });
  }
});

export default router;
