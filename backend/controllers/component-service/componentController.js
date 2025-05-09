import { CreateComponentUseCase } from "../../application/usecases/component/CreateComponentUseCase.js";
import { PrismaClient } from "@prisma/client";
import { PrismaComponentRepository } from "../../repositories/component/PrismaComponentRepository.js";
import { PrismaComponentCategoryRepository } from "../../repositories/component/PrismaComponentCategoryRepository.js";
import { componentSchemas } from "../../data/componentSchemas/index.js";

const prisma = new PrismaClient();
const componentRepository = new PrismaComponentRepository(prisma);
const componentCategoryRepository = new PrismaComponentCategoryRepository(
  prisma
);

/**
 * Tüm bileşenleri getirir
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAllComponents = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const components = await prisma.component.findMany({
      include: {
        versions: true,
      },
    });

    res.status(200).json(components);
  } catch (error) {
    console.error("Bileşen listesi getirme hatası:", error);
    res.status(500).json({ error: "Bileşenler getirilirken bir hata oluştu" });
  }
};

/**
 * Belirli bir bileşeni getirir
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getComponentById = async (req, res) => {
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
    console.error("Bileşen getirme hatası:", error);
    res.status(500).json({ error: "Bileşen getirilirken bir hata oluştu" });
  }
};

/**
 * Bileşen oluşturur
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createComponent = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { name, description, tags, category } = req.body;

    const component = await prisma.component.create({
      data: {
        name,
        description,
        tags: tags || [],
        category,
      },
    });

    res.status(201).json(component);
  } catch (error) {
    console.error("Bileşen oluşturma hatası:", error);
    res.status(500).json({ error: "Bileşen oluşturulurken bir hata oluştu" });
  }
};

/**
 * Bileşeni günceller
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateComponent = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const { name, description, tags, category } = req.body;

    // Bileşen var mı kontrol et
    const existingComponent = await prisma.component.findUnique({
      where: { id },
    });

    if (!existingComponent) {
      return res.status(404).json({ error: "Bileşen bulunamadı" });
    }

    const updatedComponent = await prisma.component.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingComponent.name,
        description:
          description !== undefined
            ? description
            : existingComponent.description,
        tags: tags !== undefined ? tags : existingComponent.tags,
        category:
          category !== undefined ? category : existingComponent.category,
      },
    });

    res.status(200).json(updatedComponent);
  } catch (error) {
    console.error("Bileşen güncelleme hatası:", error);
    res.status(500).json({ error: "Bileşen güncellenirken bir hata oluştu" });
  }
};

/**
 * Bileşeni siler
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteComponent = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;

    // Bileşen var mı kontrol et
    const existingComponent = await prisma.component.findUnique({
      where: { id },
      include: { versions: true },
    });

    if (!existingComponent) {
      return res.status(404).json({ error: "Bileşen bulunamadı" });
    }

    // Önce tüm bileşen versiyonlarını sil
    if (existingComponent.versions && existingComponent.versions.length > 0) {
      await prisma.componentVersion.deleteMany({
        where: { componentId: id },
      });
    }

    // Bileşeni sil
    await prisma.component.delete({
      where: { id },
    });

    res.status(200).json({ message: "Bileşen başarıyla silindi" });
  } catch (error) {
    console.error("Bileşen silme hatası:", error);
    res.status(500).json({ error: "Bileşen silinirken bir hata oluştu" });
  }
};
