import { IPageSectionRepository } from "../../domain/component/interfaces/IPageSectionRepository.js";
import { PageSection } from "../../domain/component/PageSection.js";

/**
 * PageSection repository implementasyonu (Prisma)
 */
export class PrismaPageSectionRepository extends IPageSectionRepository {
  /**
   * @param {import('@prisma/client').PrismaClient} prisma
   */
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  /**
   * @param {string} id
   * @returns {Promise<PageSection>}
   */
  async getById(id) {
    const section = await this.prisma.pageSection.findUnique({
      where: { id: BigInt(id) },
    });

    if (!section) {
      return null;
    }

    return this.mapToDomain(section);
  }

  /**
   * @param {string} pageId
   * @returns {Promise<PageSection[]>}
   */
  async getByPageId(pageId) {
    const sections = await this.prisma.pageSection.findMany({
      where: { pageId: BigInt(pageId) },
      orderBy: { order: "asc" },
    });

    return sections.map(this.mapToDomain);
  }

  /**
   * @param {string} pageId
   * @returns {Promise<PageSection[]>}
   */
  async getRootSections(pageId) {
    const sections = await this.prisma.pageSection.findMany({
      where: {
        pageId: BigInt(pageId),
        parentSectionId: null,
      },
      orderBy: { order: "asc" },
    });

    return sections.map(this.mapToDomain);
  }

  /**
   * @param {string} parentSectionId
   * @returns {Promise<PageSection[]>}
   */
  async getChildSections(parentSectionId) {
    const sections = await this.prisma.pageSection.findMany({
      where: { parentSectionId: BigInt(parentSectionId) },
      orderBy: { order: "asc" },
    });

    return sections.map(this.mapToDomain);
  }

  /**
   * @param {PageSection} section
   * @returns {Promise<PageSection>}
   */
  async create(section) {
    const data = {
      pageId: BigInt(section.pageId),
      componentVersionId: BigInt(section.componentVersionId),
      name: section.name,
      props: section.props,
      order: section.order,
      containerSettings: section.containerSettings || {},
      styleOverrides: section.styleOverrides || {},
      isVisible: section.isVisible,
    };

    if (section.parentSectionId) {
      data.parentSectionId = BigInt(section.parentSectionId);
    }

    const createdSection = await this.prisma.pageSection.create({
      data,
    });

    return this.mapToDomain(createdSection);
  }

  /**
   * @param {PageSection} section
   * @returns {Promise<PageSection>}
   */
  async update(section) {
    const data = {
      componentVersionId: BigInt(section.componentVersionId),
      name: section.name,
      props: section.props,
      order: section.order,
      containerSettings: section.containerSettings || {},
      styleOverrides: section.styleOverrides || {},
      isVisible: section.isVisible,
    };

    if (section.parentSectionId) {
      data.parentSectionId = BigInt(section.parentSectionId);
    } else {
      data.parentSectionId = null;
    }

    const updatedSection = await this.prisma.pageSection.update({
      where: { id: BigInt(section.id) },
      data,
    });

    return this.mapToDomain(updatedSection);
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      // Önce bu bölüme bağlı tüm alt bölümleri getir
      const childSections = await this.getChildSections(id);

      // Alt bölümleri de sil (recursive)
      for (const child of childSections) {
        await this.delete(child.id);
      }

      // Bu bölümü sil
      await this.prisma.pageSection.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      console.error("PageSection silme hatası:", error);
      return false;
    }
  }

  /**
   * Sayfadaki bölüm sırasını günceller
   * @param {string} pageId
   * @param {Array<string>} sectionIds - Sıralanmış bölüm ID'leri
   * @returns {Promise<boolean>}
   */
  async updateOrder(pageId, sectionIds) {
    try {
      // Her bölümün sırasını güncelle
      for (let i = 0; i < sectionIds.length; i++) {
        await this.prisma.pageSection.update({
          where: { id: BigInt(sectionIds[i]) },
          data: { order: i },
        });
      }
      return true;
    } catch (error) {
      console.error("Bölüm sıralaması güncelleme hatası:", error);
      return false;
    }
  }

  /**
   * Veritabanı modelini domain modeline dönüştürür
   * @param {*} dbModel
   * @returns {PageSection}
   */
  mapToDomain(dbModel) {
    return new PageSection(
      dbModel.id.toString(),
      dbModel.pageId.toString(),
      dbModel.componentVersionId.toString(),
      dbModel.name,
      dbModel.props,
      dbModel.order,
      dbModel.parentSectionId ? dbModel.parentSectionId.toString() : null,
      dbModel.containerSettings,
      dbModel.styleOverrides,
      dbModel.isVisible,
      dbModel.createdAt,
      dbModel.updatedAt
    );
  }
}
