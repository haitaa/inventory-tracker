import { CreateComponentVersionUseCase } from "../../application/usecases/component/CreateComponentVersionUseCase.js";
import { PrismaClient } from "@prisma/client";
import { PrismaComponentVersionRepository } from "../../repositories/component/PrismaComponentVersionRepository.js";
import { PrismaComponentRepository } from "../../repositories/component/PrismaComponentRepository.js";
import { isValidVersion, incrementVersion } from "../../utils/versionUtils.js";

const prisma = new PrismaClient();
const componentVersionRepository = new PrismaComponentVersionRepository(prisma);
const componentRepository = new PrismaComponentRepository(prisma);

/**
 * Bileşenin tüm versiyonlarını getirir
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getComponentVersions = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { componentId } = req.params;

    const versions = await prisma.componentVersion.findMany({
      where: { componentId },
      include: {
        component: true,
      },
    });

    res.status(200).json(versions);
  } catch (error) {
    console.error("Bileşen versiyonları getirme hatası:", error);
    res
      .status(500)
      .json({ error: "Bileşen versiyonları getirilirken bir hata oluştu" });
  }
};

/**
 * Bileşenin en son versiyonunu getirir
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getLatestComponentVersion = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { componentId } = req.params;

    const versions = await prisma.componentVersion.findMany({
      where: { componentId },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
      include: {
        component: true,
      },
    });

    if (versions.length === 0) {
      return res.status(404).json({ error: "Bileşen versiyonu bulunamadı" });
    }

    res.status(200).json(versions[0]);
  } catch (error) {
    console.error("Bileşen en son versiyonu getirme hatası:", error);
    res
      .status(500)
      .json({ error: "Bileşen en son versiyonu getirilirken bir hata oluştu" });
  }
};

/**
 * Belirli bir bileşen versiyonunu getirir
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getComponentVersionById = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;

    const version = await prisma.componentVersion.findUnique({
      where: { id },
      include: {
        component: true,
      },
    });

    if (!version) {
      return res.status(404).json({ error: "Bileşen versiyonu bulunamadı" });
    }

    res.status(200).json(version);
  } catch (error) {
    console.error("Bileşen versiyonu getirme hatası:", error);
    res
      .status(500)
      .json({ error: "Bileşen versiyonu getirilirken bir hata oluştu" });
  }
};

/**
 * Yeni bir bileşen versiyonu oluşturur
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createComponentVersion = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { componentId } = req.params;
    const { version, code, schema, preview, isActive } = req.body;

    // Bileşen var mı kontrol et
    const component = await prisma.component.findUnique({
      where: { id: componentId },
    });

    if (!component) {
      return res.status(404).json({ error: "Bileşen bulunamadı" });
    }

    // Versiyon adı zaten var mı kontrol et
    const existingVersion = await prisma.componentVersion.findFirst({
      where: {
        componentId,
        version,
      },
    });

    if (existingVersion) {
      return res
        .status(400)
        .json({ error: "Bu versiyon adı zaten kullanılıyor" });
    }

    // Yeni versiyon oluştur
    const newVersion = await prisma.componentVersion.create({
      data: {
        componentId,
        version,
        code,
        schema,
        preview,
        isActive: isActive || false,
      },
    });

    res.status(201).json(newVersion);
  } catch (error) {
    console.error("Bileşen versiyonu oluşturma hatası:", error);
    res
      .status(500)
      .json({ error: "Bileşen versiyonu oluşturulurken bir hata oluştu" });
  }
};

/**
 * Bileşen versiyonunu günceller
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateComponentVersion = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const { version, code, schema, preview, isActive } = req.body;

    // Versiyon var mı kontrol et
    const existingVersion = await prisma.componentVersion.findUnique({
      where: { id },
    });

    if (!existingVersion) {
      return res.status(404).json({ error: "Bileşen versiyonu bulunamadı" });
    }

    // Eğer isActive true ise, diğer versiyonları false yap
    if (isActive) {
      await prisma.componentVersion.updateMany({
        where: {
          componentId: existingVersion.componentId,
          id: { not: id },
        },
        data: {
          isActive: false,
        },
      });
    }

    // Versiyonu güncelle
    const updatedVersion = await prisma.componentVersion.update({
      where: { id },
      data: {
        version: version !== undefined ? version : existingVersion.version,
        code: code !== undefined ? code : existingVersion.code,
        schema: schema !== undefined ? schema : existingVersion.schema,
        preview: preview !== undefined ? preview : existingVersion.preview,
        isActive: isActive !== undefined ? isActive : existingVersion.isActive,
      },
    });

    res.status(200).json(updatedVersion);
  } catch (error) {
    console.error("Bileşen versiyonu güncelleme hatası:", error);
    res
      .status(500)
      .json({ error: "Bileşen versiyonu güncellenirken bir hata oluştu" });
  }
};

/**
 * Bileşen versiyonunu siler
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteComponentVersion = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;

    // Versiyon var mı kontrol et
    const existingVersion = await prisma.componentVersion.findUnique({
      where: { id },
    });

    if (!existingVersion) {
      return res.status(404).json({ error: "Bileşen versiyonu bulunamadı" });
    }

    // Bu versiyonu kullanan sayfa bölümleri var mı kontrol et
    const usedInSections = await prisma.pageSection.findFirst({
      where: { componentVersionId: id },
    });

    if (usedInSections) {
      return res.status(400).json({
        error: "Bu bileşen versiyonu sayfalarda kullanıldığı için silinemez",
      });
    }

    // Versiyonu sil
    await prisma.componentVersion.delete({
      where: { id },
    });

    res.status(200).json({ message: "Bileşen versiyonu başarıyla silindi" });
  } catch (error) {
    console.error("Bileşen versiyonu silme hatası:", error);
    res
      .status(500)
      .json({ error: "Bileşen versiyonu silinirken bir hata oluştu" });
  }
};
