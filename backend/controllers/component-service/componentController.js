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
    let components;
    const { categoryId, type, isGlobal, isActive } = req.query;

    if (categoryId) {
      components = await componentRepository.getByCategoryId(categoryId);
    } else if (type) {
      components = await componentRepository.getByType(type);
    } else if (isGlobal !== undefined) {
      components = await componentRepository.getByGlobalStatus(
        isGlobal === "true"
      );
    } else if (isActive !== undefined) {
      if (isActive === "true") {
        components = await componentRepository.getActive();
      } else {
        // Tüm bileşenleri getir ve filtreleme yap
        const allComponents = await componentRepository.getAll();
        components = allComponents.filter((c) => !c.isActive);
      }
    } else {
      // Default tüm bileşenleri getir
      components = await componentRepository.getAll();
    }

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
    const { id } = req.params;
    const component = await componentRepository.getById(id);

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
    const {
      name,
      description,
      categoryId,
      type,
      thumbnail,
      schema,
      defaultProps,
      restrictions,
      isGlobal,
    } = req.body;

    // Gerekli alanları kontrol et
    if (!name || !categoryId || !type) {
      return res.status(400).json({
        error: "Ad, kategori ID ve tip alanları zorunludur",
      });
    }

    // Eğer şema ve varsayılan özellikler gönderilmezse, hazır şemalardan al
    let componentSchema = schema;
    let componentDefaultProps = defaultProps;

    if (!schema && componentSchemas[type]) {
      componentSchema = componentSchemas[type].schema;
      componentDefaultProps = componentSchemas[type].defaultProps;
    }

    if (!componentSchema) {
      return res.status(400).json({
        error: "Bileşen şeması zorunludur",
      });
    }

    const createComponentUseCase = new CreateComponentUseCase(
      componentRepository,
      componentCategoryRepository
    );

    const component = await createComponentUseCase.execute(
      name,
      description,
      categoryId,
      type,
      thumbnail,
      componentSchema,
      componentDefaultProps,
      restrictions,
      isGlobal || false
    );

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
    const { id } = req.params;
    const {
      name,
      description,
      categoryId,
      type,
      thumbnail,
      schema,
      defaultProps,
      restrictions,
      isGlobal,
      isActive,
    } = req.body;

    // Bileşen var mı kontrol et
    const existingComponent = await componentRepository.getById(id);
    if (!existingComponent) {
      return res.status(404).json({ error: "Bileşen bulunamadı" });
    }

    // Kategori değiştiyse ve yeni kategori mevcutsa kontrol et
    if (categoryId && categoryId !== existingComponent.categoryId) {
      const category = await componentCategoryRepository.getById(categoryId);
      if (!category) {
        return res
          .status(400)
          .json({ error: "Belirtilen kategori bulunamadı" });
      }
    }

    // Güncelleme için yeni bir nesne oluştur
    const updatedComponent = {
      ...existingComponent,
      name: name || existingComponent.name,
      description:
        description !== undefined ? description : existingComponent.description,
      categoryId: categoryId || existingComponent.categoryId,
      type: type || existingComponent.type,
      thumbnail:
        thumbnail !== undefined ? thumbnail : existingComponent.thumbnail,
      schema: schema || existingComponent.schema,
      defaultProps: defaultProps || existingComponent.defaultProps,
      restrictions:
        restrictions !== undefined
          ? restrictions
          : existingComponent.restrictions,
      isGlobal: isGlobal !== undefined ? isGlobal : existingComponent.isGlobal,
      isActive: isActive !== undefined ? isActive : existingComponent.isActive,
    };

    const result = await componentRepository.update(updatedComponent);
    res.status(200).json(result);
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
    const { id } = req.params;

    // Bileşen var mı kontrol et
    const existingComponent = await componentRepository.getById(id);
    if (!existingComponent) {
      return res.status(404).json({ error: "Bileşen bulunamadı" });
    }

    const result = await componentRepository.delete(id);

    if (result) {
      res.status(200).json({ message: "Bileşen başarıyla silindi" });
    } else {
      res.status(500).json({ error: "Bileşen silinirken bir hata oluştu" });
    }
  } catch (error) {
    console.error("Bileşen silme hatası:", error);
    res.status(500).json({ error: "Bileşen silinirken bir hata oluştu" });
  }
};
