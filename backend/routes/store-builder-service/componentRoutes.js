import express from "express";

const router = express.Router();

// Tüm bileşenleri getir
router.get("/", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const components = await prisma.component.findMany({
      include: {
        versions: true,
      },
    });
    res.status(200).json(components);
  } catch (error) {
    console.error("Bileşenler getirilirken hata:", error);
    res.status(500).json({ error: "Bileşenler yüklenirken bir hata oluştu" });
  }
});

// Belirli bir bileşeni getir
router.get("/:id", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const component = await prisma.component.findUnique({
      where: { id },
      include: {
        versions: true,
      },
    });

    if (!component) {
      return res.status(404).json({ error: "Bileşen bulunamadı" });
    }

    res.status(200).json(component);
  } catch (error) {
    console.error("Bileşen getirilirken hata:", error);
    res.status(500).json({ error: "Bileşen yüklenirken bir hata oluştu" });
  }
});

// Bileşen versiyonlarını getir
router.get("/:id/versions", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const versions = await prisma.componentVersion.findMany({
      where: { componentId: id },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(versions);
  } catch (error) {
    console.error("Bileşen versiyonları getirilirken hata:", error);
    res
      .status(500)
      .json({ error: "Bileşen versiyonları yüklenirken bir hata oluştu" });
  }
});

// Yeni bileşen oluştur
router.post("/", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { name, description, tags, category, schema } = req.body;

    const component = await prisma.component.create({
      data: {
        name,
        description,
        tags: tags || [],
        category,
        schema: schema || {},
      },
    });

    res.status(201).json(component);
  } catch (error) {
    console.error("Bileşen oluşturulurken hata:", error);
    res.status(500).json({ error: "Bileşen oluşturulurken bir hata oluştu" });
  }
});

// Bileşen güncelle
router.put("/:id", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const { name, description, tags, category, schema } = req.body;

    const component = await prisma.component.update({
      where: { id },
      data: {
        name,
        description,
        tags: tags !== undefined ? tags : undefined,
        category,
        schema: schema !== undefined ? schema : undefined,
      },
    });

    res.status(200).json(component);
  } catch (error) {
    console.error("Bileşen güncellenirken hata:", error);
    res.status(500).json({ error: "Bileşen güncellenirken bir hata oluştu" });
  }
});

// Bileşen sil
router.delete("/:id", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;

    // Önce bileşenin kullanımda olup olmadığını kontrol et
    const usageCount = await prisma.pageSection.count({
      where: {
        componentVersion: {
          componentId: id,
        },
      },
    });

    if (usageCount > 0) {
      return res.status(400).json({
        error:
          "Bu bileşen sayfalarda kullanılıyor. Silinmeden önce bileşeni kullanan tüm sayfaları düzenlemelisiniz.",
        usageCount,
      });
    }

    // Önce bileşen versiyonlarını sil
    await prisma.componentVersion.deleteMany({
      where: { componentId: id },
    });

    // Sonra bileşeni sil
    await prisma.component.delete({
      where: { id },
    });

    res.status(200).json({ message: "Bileşen başarıyla silindi" });
  } catch (error) {
    console.error("Bileşen silinirken hata:", error);
    res.status(500).json({ error: "Bileşen silinirken bir hata oluştu" });
  }
});

// Yeni bileşen versiyonu oluştur
router.post("/:id/versions", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const { version, code, schema, preview, isActive } = req.body;

    // Bileşenin var olup olmadığını kontrol et
    const component = await prisma.component.findUnique({
      where: { id },
    });

    if (!component) {
      return res.status(404).json({ error: "Bileşen bulunamadı" });
    }

    // Versiyon adının benzersiz olup olmadığını kontrol et
    const existingVersion = await prisma.componentVersion.findFirst({
      where: {
        componentId: id,
        version,
      },
    });

    if (existingVersion) {
      return res
        .status(400)
        .json({ error: "Bu versiyon adı zaten kullanılıyor" });
    }

    const componentVersion = await prisma.componentVersion.create({
      data: {
        componentId: id,
        version,
        code,
        schema,
        preview,
        isActive: isActive || false,
      },
    });

    res.status(201).json(componentVersion);
  } catch (error) {
    console.error("Bileşen versiyonu oluşturulurken hata:", error);
    res
      .status(500)
      .json({ error: "Bileşen versiyonu oluşturulurken bir hata oluştu" });
  }
});

export default router;
