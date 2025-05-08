import { CreatePageSectionUseCase } from "../../application/usecases/component/CreatePageSectionUseCase.js";
import { PrismaClient } from "@prisma/client";
import { PrismaPageSectionRepository } from "../../repositories/component/PrismaPageSectionRepository.js";
import { PrismaComponentVersionRepository } from "../../repositories/component/PrismaComponentVersionRepository.js";
import { PrismaStorePageRepository } from "../../repositories/store/PrismaStorePageRepository.js";

const prisma = new PrismaClient();
const pageSectionRepository = new PrismaPageSectionRepository(prisma);
const componentVersionRepository = new PrismaComponentVersionRepository(prisma);
const storePageRepository = new PrismaStorePageRepository(prisma);

/**
 * Bir sayfanın tüm bölümlerini getirir
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getPageSections = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { onlyRoot } = req.query;

    // Sayfa var mı kontrol et
    const page = await storePageRepository.getById(pageId);
    if (!page) {
      return res.status(404).json({ error: "Sayfa bulunamadı" });
    }

    let sections;
    if (onlyRoot === "true") {
      sections = await pageSectionRepository.getRootSections(pageId);
    } else {
      sections = await pageSectionRepository.getByPageId(pageId);
    }

    res.status(200).json(sections);
  } catch (error) {
    console.error("Sayfa bölümleri getirme hatası:", error);
    res
      .status(500)
      .json({ error: "Sayfa bölümleri getirilirken bir hata oluştu" });
  }
};

/**
 * Belirli bir bölümün alt bölümlerini getirir
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getChildSections = async (req, res) => {
  try {
    const { sectionId } = req.params;

    // Bölüm var mı kontrol et
    const section = await pageSectionRepository.getById(sectionId);
    if (!section) {
      return res.status(404).json({ error: "Bölüm bulunamadı" });
    }

    const childSections = await pageSectionRepository.getChildSections(
      sectionId
    );
    res.status(200).json(childSections);
  } catch (error) {
    console.error("Alt bölümler getirme hatası:", error);
    res
      .status(500)
      .json({ error: "Alt bölümler getirilirken bir hata oluştu" });
  }
};

/**
 * Belirli bir sayfa bölümünü getirir
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getPageSectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await pageSectionRepository.getById(id);

    if (!section) {
      return res.status(404).json({ error: "Sayfa bölümü bulunamadı" });
    }

    res.status(200).json(section);
  } catch (error) {
    console.error("Sayfa bölümü getirme hatası:", error);
    res
      .status(500)
      .json({ error: "Sayfa bölümü getirilirken bir hata oluştu" });
  }
};

/**
 * Yeni bir sayfa bölümü oluşturur
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createPageSection = async (req, res) => {
  try {
    const { pageId } = req.params;
    const {
      componentVersionId,
      name,
      props,
      order,
      parentSectionId,
      containerSettings,
      styleOverrides,
    } = req.body;

    // Gerekli alanları kontrol et
    if (!componentVersionId) {
      return res.status(400).json({
        error: "Bileşen versiyon ID alanı zorunludur",
      });
    }

    const createPageSectionUseCase = new CreatePageSectionUseCase(
      pageSectionRepository,
      componentVersionRepository,
      storePageRepository
    );

    const pageSection = await createPageSectionUseCase.execute(
      pageId,
      componentVersionId,
      name,
      props || {},
      order || 0,
      parentSectionId,
      containerSettings || {},
      styleOverrides || {}
    );

    res.status(201).json(pageSection);
  } catch (error) {
    console.error("Sayfa bölümü oluşturma hatası:", error);

    // Sayfa veya bileşen versiyonu bulunamadı hatası
    if (error.message.includes("bulunamadı")) {
      return res.status(404).json({ error: error.message });
    }

    res
      .status(500)
      .json({ error: "Sayfa bölümü oluşturulurken bir hata oluştu" });
  }
};

/**
 * Sayfa bölümünü günceller
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updatePageSection = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      componentVersionId,
      name,
      props,
      order,
      parentSectionId,
      containerSettings,
      styleOverrides,
      isVisible,
    } = req.body;

    // Bölüm var mı kontrol et
    const existingSection = await pageSectionRepository.getById(id);
    if (!existingSection) {
      return res.status(404).json({ error: "Sayfa bölümü bulunamadı" });
    }

    // Bileşen versiyonu değiştiyse varlığını kontrol et
    if (
      componentVersionId &&
      componentVersionId !== existingSection.componentVersionId
    ) {
      const version = await componentVersionRepository.getById(
        componentVersionId
      );
      if (!version) {
        return res
          .status(400)
          .json({ error: "Belirtilen bileşen versiyonu bulunamadı" });
      }
    }

    // Üst bölüm değiştiyse varlığını ve döngü oluşturmadığını kontrol et
    if (
      parentSectionId &&
      parentSectionId !== existingSection.parentSectionId
    ) {
      // Kendisine referans veriyorsa hata
      if (parentSectionId === id) {
        return res
          .status(400)
          .json({ error: "Bir bölüm kendisinin alt bölümü olamaz" });
      }

      const parentSection = await pageSectionRepository.getById(
        parentSectionId
      );
      if (!parentSection) {
        return res
          .status(400)
          .json({ error: "Belirtilen üst bölüm bulunamadı" });
      }

      // Üst bölüm ile aynı sayfada olmalı
      if (parentSection.pageId !== existingSection.pageId) {
        return res
          .status(400)
          .json({ error: "Üst bölüm aynı sayfada olmalıdır" });
      }

      // TODO: Döngüsel bağlantı kontrolü ekleyin
    }

    // Güncelleme için yeni bir nesne oluştur
    const updatedSection = {
      ...existingSection,
      componentVersionId:
        componentVersionId || existingSection.componentVersionId,
      name: name !== undefined ? name : existingSection.name,
      props: props || existingSection.props,
      order: order !== undefined ? order : existingSection.order,
      parentSectionId:
        parentSectionId !== undefined
          ? parentSectionId
          : existingSection.parentSectionId,
      containerSettings: containerSettings || existingSection.containerSettings,
      styleOverrides: styleOverrides || existingSection.styleOverrides,
      isVisible:
        isVisible !== undefined ? isVisible : existingSection.isVisible,
    };

    const result = await pageSectionRepository.update(updatedSection);
    res.status(200).json(result);
  } catch (error) {
    console.error("Sayfa bölümü güncelleme hatası:", error);
    res
      .status(500)
      .json({ error: "Sayfa bölümü güncellenirken bir hata oluştu" });
  }
};

/**
 * Sayfa bölümünü siler
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deletePageSection = async (req, res) => {
  try {
    const { id } = req.params;

    // Bölüm var mı kontrol et
    const existingSection = await pageSectionRepository.getById(id);
    if (!existingSection) {
      return res.status(404).json({ error: "Sayfa bölümü bulunamadı" });
    }

    const result = await pageSectionRepository.delete(id);

    if (result) {
      res.status(200).json({ message: "Sayfa bölümü başarıyla silindi" });
    } else {
      res
        .status(500)
        .json({ error: "Sayfa bölümü silinirken bir hata oluştu" });
    }
  } catch (error) {
    console.error("Sayfa bölümü silme hatası:", error);
    res.status(500).json({ error: "Sayfa bölümü silinirken bir hata oluştu" });
  }
};

/**
 * Sayfadaki bölümlerin sırasını günceller
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateSectionOrder = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { sectionIds } = req.body;

    if (!Array.isArray(sectionIds) || sectionIds.length === 0) {
      return res
        .status(400)
        .json({ error: "Bölüm ID'leri geçerli bir dizi olmalıdır" });
    }

    // Tüm bölümlerin belirtilen sayfaya ait olduğunu kontrol et
    const sections = await pageSectionRepository.getByPageId(pageId);
    const pageSectionIds = sections.map((s) => s.id);

    // Gönderilen tüm ID'ler sayfaya ait mi?
    const allBelongToPage = sectionIds.every((id) =>
      pageSectionIds.includes(id)
    );
    if (!allBelongToPage) {
      return res
        .status(400)
        .json({ error: "Bazı bölümler bu sayfaya ait değil" });
    }

    const result = await pageSectionRepository.updateOrder(pageId, sectionIds);

    if (result) {
      res.status(200).json({ message: "Bölüm sırası başarıyla güncellendi" });
    } else {
      res
        .status(500)
        .json({ error: "Bölüm sırası güncellenirken bir hata oluştu" });
    }
  } catch (error) {
    console.error("Bölüm sırası güncelleme hatası:", error);
    res
      .status(500)
      .json({ error: "Bölüm sırası güncellenirken bir hata oluştu" });
  }
};
