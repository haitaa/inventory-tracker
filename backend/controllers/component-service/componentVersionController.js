import { CreateComponentVersionUseCase } from "../../application/usecases/component/CreateComponentVersionUseCase.js";
import { PrismaClient } from "@prisma/client";
import { PrismaComponentVersionRepository } from "../../repositories/component/PrismaComponentVersionRepository.js";
import { PrismaComponentRepository } from "../../repositories/component/PrismaComponentRepository.js";
import { isValidVersion, incrementVersion } from "../../utils/versionUtils.js";

const prisma = new PrismaClient();
const componentVersionRepository = new PrismaComponentVersionRepository(prisma);
const componentRepository = new PrismaComponentRepository(prisma);

/**
 * Bir bileşenin tüm versiyonlarını getirir
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getComponentVersions = async (req, res) => {
  try {
    const { componentId } = req.params;
    const { onlyActive } = req.query;

    // Bileşen var mı kontrol et
    const component = await componentRepository.getById(componentId);
    if (!component) {
      return res.status(404).json({ error: "Bileşen bulunamadı" });
    }

    let versions;
    if (onlyActive === "true") {
      versions = await componentVersionRepository.getActiveVersions(
        componentId
      );
    } else {
      versions = await componentVersionRepository.getByComponentId(componentId);
    }

    res.status(200).json(versions);
  } catch (error) {
    console.error("Bileşen versiyonları getirme hatası:", error);
    res
      .status(500)
      .json({ error: "Bileşen versiyonları getirilirken bir hata oluştu" });
  }
};

/**
 * Belirli bir bileşen versiyonunu getirir
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getComponentVersionById = async (req, res) => {
  try {
    const { id } = req.params;
    const version = await componentVersionRepository.getById(id);

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
 * Bir bileşenin en son versiyonunu getirir
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getLatestComponentVersion = async (req, res) => {
  try {
    const { componentId } = req.params;
    const version = await componentVersionRepository.getLatestVersion(
      componentId
    );

    if (!version) {
      return res.status(404).json({ error: "Bileşen versiyonu bulunamadı" });
    }

    res.status(200).json(version);
  } catch (error) {
    console.error("En son bileşen versiyonu getirme hatası:", error);
    res
      .status(500)
      .json({ error: "En son bileşen versiyonu getirilirken bir hata oluştu" });
  }
};

/**
 * Yeni bir bileşen versiyonu oluşturur
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createComponentVersion = async (req, res) => {
  try {
    const { componentId } = req.params;
    const { version, template, script, style } = req.body;

    // Bileşen var mı kontrol et
    const component = await componentRepository.getById(componentId);
    if (!component) {
      return res.status(404).json({ error: "Bileşen bulunamadı" });
    }

    // Versiyon belirtilmemiş ise otomatik oluştur
    let newVersion = version;
    if (!newVersion) {
      const latestVersion = await componentVersionRepository.getLatestVersion(
        componentId
      );
      if (latestVersion) {
        newVersion = incrementVersion(latestVersion.version, "patch");
      } else {
        newVersion = "1.0.0"; // İlk versiyon
      }
    } else if (!isValidVersion(newVersion)) {
      return res.status(400).json({
        error:
          "Geçersiz versiyon formatı. Semantik versiyonlama kullanın (ör: 1.0.0)",
      });
    }

    // Template zorunlu
    if (!template) {
      return res.status(400).json({
        error: "Template alanı zorunludur",
      });
    }

    const createComponentVersionUseCase = new CreateComponentVersionUseCase(
      componentVersionRepository,
      componentRepository
    );

    const componentVersion = await createComponentVersionUseCase.execute(
      componentId,
      newVersion,
      template,
      script || "",
      style || ""
    );

    res.status(201).json(componentVersion);
  } catch (error) {
    console.error("Bileşen versiyonu oluşturma hatası:", error);

    // Versiyon çakışma hatası
    if (error.message.includes("zaten mevcut")) {
      return res.status(400).json({ error: error.message });
    }

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
    const { id } = req.params;
    const { template, script, style, isActive } = req.body;

    // Versiyon var mı kontrol et
    const existingVersion = await componentVersionRepository.getById(id);
    if (!existingVersion) {
      return res.status(404).json({ error: "Bileşen versiyonu bulunamadı" });
    }

    // Güncelleme için yeni bir nesne oluştur
    const updatedVersion = {
      ...existingVersion,
      template: template || existingVersion.template,
      script: script !== undefined ? script : existingVersion.script,
      style: style !== undefined ? style : existingVersion.style,
      isActive: isActive !== undefined ? isActive : existingVersion.isActive,
    };

    const result = await componentVersionRepository.update(updatedVersion);
    res.status(200).json(result);
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
    const { id } = req.params;

    // Versiyon var mı kontrol et
    const existingVersion = await componentVersionRepository.getById(id);
    if (!existingVersion) {
      return res.status(404).json({ error: "Bileşen versiyonu bulunamadı" });
    }

    // Kullanımda olup olmadığını kontrol et (PageSection'larda kullanılıyor mu?)
    // TODO: İleride bu kontrolü ekleyin

    const result = await componentVersionRepository.delete(id);

    if (result) {
      res.status(200).json({ message: "Bileşen versiyonu başarıyla silindi" });
    } else {
      res
        .status(500)
        .json({ error: "Bileşen versiyonu silinirken bir hata oluştu" });
    }
  } catch (error) {
    console.error("Bileşen versiyonu silme hatası:", error);
    res
      .status(500)
      .json({ error: "Bileşen versiyonu silinirken bir hata oluştu" });
  }
};
