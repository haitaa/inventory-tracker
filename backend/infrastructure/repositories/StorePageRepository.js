import { IStorePageRepository } from "../../domain/store/interfaces/IStorePageRepository.js";
import { StorePage } from "../../domain/store/StorePage.js";
import { PrismaClient } from "@prisma/client";

/**
 * StorePage Repository implementasyonu
 */
export class StorePageRepository extends IStorePageRepository {
  /**
   * @param {PrismaClient} prisma
   */
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  /**
   * Veritabanı kayıtlarını domain modele dönüştürür
   * @param {object} pageData
   * @returns {StorePage}
   */
  mapToDomain(pageData) {
    return new StorePage(
      pageData.id.toString(),
      pageData.storeId.toString(),
      pageData.title,
      pageData.slug,
      pageData.content,
      pageData.seo,
      pageData.isHomepage,
      pageData.isPublished,
      pageData.createdAt,
      pageData.updatedAt
    );
  }

  /**
   * Domain modeli veritabanı modeline dönüştürür
   * @param {StorePage} page
   * @returns {object}
   */
  mapToDatabase(page) {
    return {
      id: page.id ? BigInt(page.id) : undefined,
      storeId: BigInt(page.storeId),
      title: page.title,
      slug: page.slug,
      content: page.content,
      seo: page.seo,
      isHomepage: page.isHomepage,
      isPublished: page.isPublished,
    };
  }

  /**
   * @param {string} id
   * @returns {Promise<StorePage>}
   */
  async getById(id) {
    const pageData = await this.prisma.storePage.findUnique({
      where: { id: BigInt(id) },
    });

    if (!pageData) {
      return null;
    }

    return this.mapToDomain(pageData);
  }

  /**
   * @param {string} storeId
   * @returns {Promise<StorePage[]>}
   */
  async getByStoreId(storeId) {
    const pages = await this.prisma.storePage.findMany({
      where: { storeId: BigInt(storeId) },
    });

    return pages.map((page) => this.mapToDomain(page));
  }

  /**
   * @param {string} storeId
   * @param {string} slug
   * @returns {Promise<StorePage>}
   */
  async getByStoreIdAndSlug(storeId, slug) {
    const pageData = await this.prisma.storePage.findUnique({
      where: {
        storeId_slug: {
          storeId: BigInt(storeId),
          slug,
        },
      },
    });

    if (!pageData) {
      return null;
    }

    return this.mapToDomain(pageData);
  }

  /**
   * @param {string} storeId
   * @returns {Promise<StorePage>}
   */
  async getHomepageByStoreId(storeId) {
    const pageData = await this.prisma.storePage.findFirst({
      where: {
        storeId: BigInt(storeId),
        isHomepage: true,
      },
    });

    if (!pageData) {
      return null;
    }

    return this.mapToDomain(pageData);
  }

  /**
   * @param {StorePage} page
   * @returns {Promise<StorePage>}
   */
  async create(page) {
    const data = this.mapToDatabase(page);
    delete data.id; // ID'yi kaldır, otomatik oluşturulacak

    const createdPage = await this.prisma.storePage.create({
      data,
    });

    return this.mapToDomain(createdPage);
  }

  /**
   * @param {StorePage} page
   * @returns {Promise<StorePage>}
   */
  async update(page) {
    const data = this.mapToDatabase(page);
    const pageId = BigInt(page.id);

    const updatedPage = await this.prisma.storePage.update({
      where: { id: pageId },
      data,
    });

    return this.mapToDomain(updatedPage);
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      await this.prisma.storePage.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      console.error("StorePage silme hatası:", error);
      return false;
    }
  }
}
