import { IComponentCategoryRepository } from "../../domain/component/interfaces/IComponentCategoryRepository.js";
import { ComponentCategory } from "../../domain/component/ComponentCategory.js";

/**
 * ComponentCategory repository implementasyonu (Prisma)
 */
export class PrismaComponentCategoryRepository extends IComponentCategoryRepository {
  /**
   * @param {import('@prisma/client').PrismaClient} prisma
   */
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  /**
   * @param {string} id
   * @returns {Promise<ComponentCategory>}
   */
  async getById(id) {
    const category = await this.prisma.componentCategory.findUnique({
      where: { id: BigInt(id) },
    });

    if (!category) {
      return null;
    }

    return this.mapToDomain(category);
  }

  /**
   * @param {string} slug
   * @returns {Promise<ComponentCategory>}
   */
  async getBySlug(slug) {
    const category = await this.prisma.componentCategory.findUnique({
      where: { slug },
    });

    if (!category) {
      return null;
    }

    return this.mapToDomain(category);
  }

  /**
   * @returns {Promise<ComponentCategory[]>}
   */
  async getAll() {
    const categories = await this.prisma.componentCategory.findMany({
      orderBy: { name: "asc" },
    });

    return categories.map(this.mapToDomain);
  }

  /**
   * @param {ComponentCategory} category
   * @returns {Promise<ComponentCategory>}
   */
  async create(category) {
    const createdCategory = await this.prisma.componentCategory.create({
      data: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        slug: category.slug,
      },
    });

    return this.mapToDomain(createdCategory);
  }

  /**
   * @param {ComponentCategory} category
   * @returns {Promise<ComponentCategory>}
   */
  async update(category) {
    const updatedCategory = await this.prisma.componentCategory.update({
      where: { id: BigInt(category.id) },
      data: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        slug: category.slug,
      },
    });

    return this.mapToDomain(updatedCategory);
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      await this.prisma.componentCategory.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      console.error("ComponentCategory silme hatası:", error);
      return false;
    }
  }

  /**
   * Veritabanı modelini domain modeline dönüştürür
   * @param {*} dbModel
   * @returns {ComponentCategory}
   */
  mapToDomain(dbModel) {
    return new ComponentCategory(
      dbModel.id.toString(),
      dbModel.name,
      dbModel.description,
      dbModel.icon,
      dbModel.slug,
      dbModel.createdAt,
      dbModel.updatedAt
    );
  }
}
