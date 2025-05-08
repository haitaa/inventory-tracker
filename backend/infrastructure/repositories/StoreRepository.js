import { IStoreRepository } from "../../domain/store/interfaces/IStoreRepository.js";
import { Store } from "../../domain/store/Store.js";
import { PrismaClient } from "@prisma/client";

/**
 * Store Repository implementasyonu
 */
export class StoreRepository extends IStoreRepository {
  /**
   * @param {PrismaClient} prisma
   */
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  /**
   * Veritabanı kayıtlarını domain modele dönüştürür
   * @param {object} storeData
   * @returns {Store}
   */
  mapToDomain(storeData) {
    return new Store(
      storeData.id.toString(),
      storeData.userId.toString(),
      storeData.name,
      storeData.description,
      storeData.logo,
      storeData.favicon,
      storeData.subdomain,
      storeData.domain,
      storeData.templateId.toString(),
      storeData.customization,
      storeData.settings,
      storeData.isActive,
      storeData.isPublished,
      storeData.createdAt,
      storeData.updatedAt
    );
  }

  /**
   * Domain modeli veritabanı modeline dönüştürür
   * @param {Store} store
   * @returns {object}
   */
  mapToDatabase(store) {
    return {
      id: store.id ? BigInt(store.id) : undefined,
      userId: BigInt(store.userId),
      name: store.name,
      description: store.description,
      logo: store.logo,
      favicon: store.favicon,
      subdomain: store.subdomain,
      domain: store.domain,
      templateId: BigInt(store.templateId),
      customization: store.customization,
      settings: store.settings,
      isActive: store.isActive,
      isPublished: store.isPublished,
    };
  }

  /**
   * @param {string} id
   * @returns {Promise<Store>}
   */
  async getById(id) {
    const storeData = await this.prisma.store.findUnique({
      where: { id: BigInt(id) },
    });

    if (!storeData) {
      return null;
    }

    return this.mapToDomain(storeData);
  }

  /**
   * @param {string} userId
   * @returns {Promise<Store[]>}
   */
  async getByUserId(userId) {
    const stores = await this.prisma.store.findMany({
      where: { userId: BigInt(userId) },
    });

    return stores.map((store) => this.mapToDomain(store));
  }

  /**
   * @param {string} subdomain
   * @returns {Promise<Store>}
   */
  async getBySubdomain(subdomain) {
    const storeData = await this.prisma.store.findUnique({
      where: { subdomain },
    });

    if (!storeData) {
      return null;
    }

    return this.mapToDomain(storeData);
  }

  /**
   * @param {string} domain
   * @returns {Promise<Store>}
   */
  async getByDomain(domain) {
    const storeData = await this.prisma.store.findUnique({
      where: { domain },
    });

    if (!storeData) {
      return null;
    }

    return this.mapToDomain(storeData);
  }

  /**
   * @param {Store} store
   * @returns {Promise<Store>}
   */
  async create(store) {
    const data = this.mapToDatabase(store);
    delete data.id; // ID'yi kaldır, otomatik oluşturulacak

    const createdStore = await this.prisma.store.create({
      data,
    });

    return this.mapToDomain(createdStore);
  }

  /**
   * @param {Store} store
   * @returns {Promise<Store>}
   */
  async update(store) {
    const data = this.mapToDatabase(store);
    const storeId = BigInt(store.id);

    const updatedStore = await this.prisma.store.update({
      where: { id: storeId },
      data,
    });

    return this.mapToDomain(updatedStore);
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      await this.prisma.store.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      console.error("Store silme hatası:", error);
      return false;
    }
  }
}
