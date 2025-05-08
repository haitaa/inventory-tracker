import { IStoreTemplateRepository } from "../../domain/store/interfaces/IStoreTemplateRepository.js";
import { StoreTemplate } from "../../domain/store/StoreTemplate.js";
import { PrismaClient } from "@prisma/client";

/**
 * StoreTemplate Repository implementasyonu
 */
export class StoreTemplateRepository extends IStoreTemplateRepository {
  /**
   * @param {PrismaClient} prisma
   */
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  /**
   * Veritabanı kayıtlarını domain modele dönüştürür
   * @param {object} templateData
   * @returns {StoreTemplate}
   */
  mapToDomain(templateData) {
    return new StoreTemplate(
      templateData.id.toString(),
      templateData.name,
      templateData.description,
      templateData.thumbnail,
      templateData.type,
      templateData.defaultPages,
      templateData.components,
      templateData.isActive,
      templateData.createdAt,
      templateData.updatedAt
    );
  }

  /**
   * Domain modeli veritabanı modeline dönüştürür
   * @param {StoreTemplate} template
   * @returns {object}
   */
  mapToDatabase(template) {
    return {
      id: template.id ? BigInt(template.id) : undefined,
      name: template.name,
      description: template.description,
      thumbnail: template.thumbnail,
      type: template.type,
      defaultPages: template.defaultPages,
      components: template.components,
      isActive: template.isActive,
    };
  }

  /**
   * @param {string} id
   * @returns {Promise<StoreTemplate>}
   */
  async getById(id) {
    const templateData = await this.prisma.storeTemplate.findUnique({
      where: { id: BigInt(id) },
    });

    if (!templateData) {
      return null;
    }

    return this.mapToDomain(templateData);
  }

  /**
   * @returns {Promise<StoreTemplate[]>}
   */
  async getAll() {
    const templates = await this.prisma.storeTemplate.findMany();
    return templates.map((template) => this.mapToDomain(template));
  }

  /**
   * @returns {Promise<StoreTemplate[]>}
   */
  async getActive() {
    const templates = await this.prisma.storeTemplate.findMany({
      where: { isActive: true },
    });
    return templates.map((template) => this.mapToDomain(template));
  }

  /**
   * @param {string} type
   * @returns {Promise<StoreTemplate[]>}
   */
  async getByType(type) {
    const templates = await this.prisma.storeTemplate.findMany({
      where: { type },
    });
    return templates.map((template) => this.mapToDomain(template));
  }

  /**
   * @param {StoreTemplate} template
   * @returns {Promise<StoreTemplate>}
   */
  async create(template) {
    const data = this.mapToDatabase(template);
    delete data.id; // ID'yi kaldır, otomatik oluşturulacak

    const createdTemplate = await this.prisma.storeTemplate.create({
      data,
    });

    return this.mapToDomain(createdTemplate);
  }

  /**
   * @param {StoreTemplate} template
   * @returns {Promise<StoreTemplate>}
   */
  async update(template) {
    const data = this.mapToDatabase(template);
    const templateId = BigInt(template.id);

    const updatedTemplate = await this.prisma.storeTemplate.update({
      where: { id: templateId },
      data,
    });

    return this.mapToDomain(updatedTemplate);
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      await this.prisma.storeTemplate.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      console.error("StoreTemplate silme hatası:", error);
      return false;
    }
  }
}
