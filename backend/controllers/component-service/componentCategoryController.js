import { CreateComponentCategoryUseCase } from "../../application/usecases/component/CreateComponentCategoryUseCase.js";
import { PrismaClient } from "@prisma/client";
import { PrismaComponentCategoryRepository } from "../../repositories/component/PrismaComponentCategoryRepository.js";

const prisma = new PrismaClient();
const componentCategoryRepository = new PrismaComponentCategoryRepository(
  prisma
);

/**
 * Tüm bileşen kategorilerini getirir
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAllComponentCategories = async (req, res) => {
  try {
    const categories = await componentCategoryRepository.getAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Kategori listesi getirme hatası:", error);
    res.status(500).json({ error: "Kategoriler getirilirken bir hata oluştu" });
  }
};

/**
 * Belirli bir bileşen kategorisini getirir
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getComponentCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await componentCategoryRepository.getById(id);

    if (!category) {
      return res.status(404).json({ error: "Kategori bulunamadı" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Kategori getirme hatası:", error);
    res.status(500).json({ error: "Kategori getirilirken bir hata oluştu" });
  }
};

/**
 * Bileşen kategorisi oluşturur
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createComponentCategory = async (req, res) => {
  try {
    const { name, description, icon, slug } = req.body;

    // Gerekli alanları kontrol et
    if (!name || !slug) {
      return res.status(400).json({ error: "Ad ve slug alanları zorunludur" });
    }

    const createComponentCategoryUseCase = new CreateComponentCategoryUseCase(
      componentCategoryRepository
    );

    const category = await createComponentCategoryUseCase.execute(
      name,
      description,
      icon,
      slug
    );

    res.status(201).json(category);
  } catch (error) {
    console.error("Kategori oluşturma hatası:", error);

    // Eğer hata slug çakışmasından kaynaklanıyorsa
    if (error.message.includes("slug")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Kategori oluşturulurken bir hata oluştu" });
  }
};

/**
 * Bileşen kategorisini günceller
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateComponentCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, slug } = req.body;

    // Kategori var mı kontrol et
    const existingCategory = await componentCategoryRepository.getById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Kategori bulunamadı" });
    }

    // Slug değiştiyse ve yeni slug başka bir kategoride kullanılıyorsa kontrol et
    if (slug && slug !== existingCategory.slug) {
      const categoryWithSlug = await componentCategoryRepository.getBySlug(
        slug
      );
      if (categoryWithSlug && categoryWithSlug.id !== id) {
        return res
          .status(400)
          .json({ error: `'${slug}' slug'ı zaten kullanımda` });
      }
    }

    // Güncelleme için yeni bir nesne oluştur
    const updatedCategory = {
      ...existingCategory,
      name: name || existingCategory.name,
      description:
        description !== undefined ? description : existingCategory.description,
      icon: icon !== undefined ? icon : existingCategory.icon,
      slug: slug || existingCategory.slug,
    };

    const result = await componentCategoryRepository.update(updatedCategory);
    res.status(200).json(result);
  } catch (error) {
    console.error("Kategori güncelleme hatası:", error);
    res.status(500).json({ error: "Kategori güncellenirken bir hata oluştu" });
  }
};

/**
 * Bileşen kategorisini siler
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteComponentCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Kategori var mı kontrol et
    const existingCategory = await componentCategoryRepository.getById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Kategori bulunamadı" });
    }

    const result = await componentCategoryRepository.delete(id);

    if (result) {
      res.status(200).json({ message: "Kategori başarıyla silindi" });
    } else {
      res.status(500).json({ error: "Kategori silinirken bir hata oluştu" });
    }
  } catch (error) {
    console.error("Kategori silme hatası:", error);
    res.status(500).json({ error: "Kategori silinirken bir hata oluştu" });
  }
};
