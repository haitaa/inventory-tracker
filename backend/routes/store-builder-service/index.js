import express from "express";
import storeRoutes from "./storeRoutes.js";
import storePageRoutes from "./storePageRoutes.js";
import componentRoutes from "./componentRoutes.js";
import productRoutes from "./productRoutes.js";

const router = express.Router();

// Ana rotalar
router.use("/stores", storeRoutes);
router.use("/store-pages", storePageRoutes);
router.use("/components", componentRoutes);
router.use("/products", productRoutes);

// Komponent versiyonları için endpoint
router.use("/component-versions/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.method === "GET") {
      const prisma =
        req.app.locals.prisma ||
        new (await import("@prisma/client")).PrismaClient();

      const version = await prisma.componentVersion.findUnique({
        where: { id },
        include: {
          component: true,
        },
      });

      if (!version) {
        return res.status(404).json({ error: "Bileşen versiyonu bulunamadı" });
      }

      return res.status(200).json(version);
    }

    next();
  } catch (error) {
    console.error("Bileşen versiyonu getirilirken hata:", error);
    res
      .status(500)
      .json({ error: "Bileşen versiyonu yüklenirken bir hata oluştu" });
  }
});

// Sayfa bölümleri için POST endpoint (oluşturma)
router.post("/page-sections", async (req, res) => {
  try {
    const prisma =
      req.app.locals.prisma ||
      new (await import("@prisma/client")).PrismaClient();

    const {
      pageId,
      componentVersionId,
      name,
      props,
      order,
      parentSectionId,
      containerSettings,
      styleOverrides,
      isVisible,
    } = req.body;

    const section = await prisma.pageSection.create({
      data: {
        pageId,
        componentVersionId,
        name,
        props: props || {},
        order,
        parentSectionId,
        containerSettings: containerSettings || {},
        styleOverrides: styleOverrides || {},
        isVisible: isVisible !== undefined ? isVisible : true,
      },
    });

    return res.status(201).json(section);
  } catch (error) {
    console.error("Sayfa bölümü oluşturulurken hata:", error);
    res
      .status(500)
      .json({ error: "Sayfa bölümü oluşturulurken bir hata oluştu" });
  }
});

// Sayfa bölümleri için ID parametreli PUT endpoint (güncelleme)
router.put("/page-sections/:id", async (req, res) => {
  try {
    const prisma =
      req.app.locals.prisma ||
      new (await import("@prisma/client")).PrismaClient();

    const { id } = req.params;
    const {
      name,
      props,
      isVisible,
      parentSectionId,
      containerSettings,
      styleOverrides,
    } = req.body;

    const section = await prisma.pageSection.update({
      where: { id },
      data: {
        name,
        props: props !== undefined ? props : undefined,
        isVisible: isVisible !== undefined ? isVisible : undefined,
        parentSectionId,
        containerSettings:
          containerSettings !== undefined ? containerSettings : undefined,
        styleOverrides:
          styleOverrides !== undefined ? styleOverrides : undefined,
      },
    });

    return res.status(200).json(section);
  } catch (error) {
    console.error("Sayfa bölümü güncellenirken hata:", error);
    res
      .status(500)
      .json({ error: "Sayfa bölümü güncellenirken bir hata oluştu" });
  }
});

// Sayfa bölümleri için ID parametreli DELETE endpoint (silme)
router.delete("/page-sections/:id", async (req, res) => {
  try {
    const prisma =
      req.app.locals.prisma ||
      new (await import("@prisma/client")).PrismaClient();

    const { id } = req.params;

    await prisma.pageSection.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Bölüm başarıyla silindi" });
  } catch (error) {
    console.error("Sayfa bölümü silinirken hata:", error);
    res.status(500).json({ error: "Sayfa bölümü silinirken bir hata oluştu" });
  }
});

export default router;
