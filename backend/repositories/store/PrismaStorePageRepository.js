import { IStorePageRepository } from "../../domain/store/interfaces/IStorePageRepository.js";
import { StorePage } from "../../domain/store/StorePage.js";

/**
 * StorePage repository implementasyonu (Prisma)
 */
export class PrismaStorePageRepository extends IStorePageRepository {
  /**
   * @param {import('@prisma/client').PrismaClient} prisma
   */
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  /**
   * @param {string} id
   * @returns {Promise<StorePage>}
   */
  async getById(id) {
    const page = await this.prisma.storePage.findUnique({
      where: { id: BigInt(id) },
    });

    if (!page) {
      return null;
    }

    return this.mapToDomain(page);
  }

  /**
   * @param {string} storeId
   * @returns {Promise<StorePage[]>}
   */
  async getByStoreId(storeId) {
    const pages = await this.prisma.storePage.findMany({
      where: { storeId: BigInt(storeId) },
      orderBy: { title: "asc" },
    });

    return pages.map(this.mapToDomain);
  }

  /**
   * @param {string} storeId
   * @param {string} slug
   * @returns {Promise<StorePage>}
   */
  async getByStoreIdAndSlug(storeId, slug) {
    const page = await this.prisma.storePage.findFirst({
      where: {
        storeId: BigInt(storeId),
        slug,
      },
    });

    if (!page) {
      return null;
    }

    return this.mapToDomain(page);
  }

  /**
   * @param {string} storeId
   * @returns {Promise<StorePage>}
   */
  async getHomePage(storeId) {
    const page = await this.prisma.storePage.findFirst({
      where: {
        storeId: BigInt(storeId),
        isHomepage: true,
      },
    });

    if (!page) {
      return null;
    }

    return this.mapToDomain(page);
  }

  /**
   * @param {StorePage} page
   * @returns {Promise<StorePage>}
   */
  async create(page) {
    const createdPage = await this.prisma.storePage.create({
      data: {
        storeId: BigInt(page.storeId),
        title: page.title,
        slug: page.slug,
        content: page.content || {},
        seo: page.seo || {},
        isHomepage: page.isHomepage,
        isPublished: page.isPublished,
      },
    });

    return this.mapToDomain(createdPage);
  }

  /**
   * @param {StorePage} page
   * @returns {Promise<StorePage>}
   */
  async update(page) {
    const updatedPage = await this.prisma.storePage.update({
      where: { id: BigInt(page.id) },
      data: {
        title: page.title,
        slug: page.slug,
        content: page.content || {},
        seo: page.seo || {},
        isHomepage: page.isHomepage,
        isPublished: page.isPublished,
      },
    });

    return this.mapToDomain(updatedPage);
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      // Sayfaya ait bölümleri silme işlemi burada değil, PageSectionRepository'de yapılmalı

      await this.prisma.storePage.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      console.error("StorePage silme hatası:", error);
      return false;
    }
  }

  /**
   * Anasayfa olarak işaretlenen sayfanın diğer sayfaları anasayfa olmaktan çıkarır
   * @param {string} storeId
   * @param {string} pageId
   * @returns {Promise<boolean>}
   */
  async setHomePage(storeId, pageId) {
    try {
      // Önce tüm sayfaları anasayfa olmaktan çıkar
      await this.prisma.storePage.updateMany({
        where: { storeId: BigInt(storeId) },
        data: { isHomepage: false },
      });

      // Seçilen sayfayı anasayfa yap
      await this.prisma.storePage.update({
        where: { id: BigInt(pageId) },
        data: { isHomepage: true },
      });

      return true;
    } catch (error) {
      console.error("Anasayfa ayarlama hatası:", error);
      return false;
    }
  }

  /**
   * Veritabanı modelini domain modeline dönüştürür
   * @param {*} dbModel
   * @returns {StorePage}
   */
  mapToDomain(dbModel) {
    return new StorePage(
      dbModel.id.toString(),
      dbModel.storeId.toString(),
      dbModel.title,
      dbModel.slug,
      dbModel.content,
      dbModel.seo,
      dbModel.isHomepage,
      dbModel.isPublished,
      dbModel.createdAt,
      dbModel.updatedAt
    );
  }
}
