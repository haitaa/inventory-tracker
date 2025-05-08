import { IComponentRepository } from "../../domain/component/interfaces/IComponentRepository.js";
import { Component } from "../../domain/component/Component.js";

/**
 * Component repository implementasyonu (Prisma)
 */
export class PrismaComponentRepository extends IComponentRepository {
  /**
   * @param {import('@prisma/client').PrismaClient} prisma
   */
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  /**
   * @param {string} id
   * @returns {Promise<Component>}
   */
  async getById(id) {
    const component = await this.prisma.component.findUnique({
      where: { id: BigInt(id) },
    });

    if (!component) {
      return null;
    }

    return this.mapToDomain(component);
  }

  /**
   * @param {string} categoryId
   * @returns {Promise<Component[]>}
   */
  async getByCategoryId(categoryId) {
    const components = await this.prisma.component.findMany({
      where: { categoryId: BigInt(categoryId) },
      orderBy: { name: "asc" },
    });

    return components.map(this.mapToDomain);
  }

  /**
   * @param {string} type
   * @returns {Promise<Component[]>}
   */
  async getByType(type) {
    const components = await this.prisma.component.findMany({
      where: { type },
      orderBy: { name: "asc" },
    });

    return components.map(this.mapToDomain);
  }

  /**
   * @param {boolean} isGlobal
   * @returns {Promise<Component[]>}
   */
  async getByGlobalStatus(isGlobal) {
    const components = await this.prisma.component.findMany({
      where: { isGlobal },
      orderBy: { name: "asc" },
    });

    return components.map(this.mapToDomain);
  }

  /**
   * @returns {Promise<Component[]>}
   */
  async getActive() {
    const components = await this.prisma.component.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    return components.map(this.mapToDomain);
  }

  /**
   * @param {Component} component
   * @returns {Promise<Component>}
   */
  async create(component) {
    const createdComponent = await this.prisma.component.create({
      data: {
        name: component.name,
        description: component.description,
        categoryId: BigInt(component.categoryId),
        type: component.type,
        thumbnail: component.thumbnail,
        schema: component.schema,
        defaultProps: component.defaultProps,
        restrictions: component.restrictions,
        isGlobal: component.isGlobal,
        isActive: component.isActive,
      },
    });

    return this.mapToDomain(createdComponent);
  }

  /**
   * @param {Component} component
   * @returns {Promise<Component>}
   */
  async update(component) {
    const updatedComponent = await this.prisma.component.update({
      where: { id: BigInt(component.id) },
      data: {
        name: component.name,
        description: component.description,
        categoryId: BigInt(component.categoryId),
        type: component.type,
        thumbnail: component.thumbnail,
        schema: component.schema,
        defaultProps: component.defaultProps,
        restrictions: component.restrictions,
        isGlobal: component.isGlobal,
        isActive: component.isActive,
      },
    });

    return this.mapToDomain(updatedComponent);
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      await this.prisma.component.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      console.error("Component silme hatası:", error);
      return false;
    }
  }

  /**
   * Veritabanı modelini domain modeline dönüştürür
   * @param {*} dbModel
   * @returns {Component}
   */
  mapToDomain(dbModel) {
    return new Component(
      dbModel.id.toString(),
      dbModel.name,
      dbModel.description,
      dbModel.categoryId.toString(),
      dbModel.type,
      dbModel.thumbnail,
      dbModel.schema,
      dbModel.defaultProps,
      dbModel.restrictions,
      dbModel.isGlobal,
      dbModel.isActive,
      dbModel.createdAt,
      dbModel.updatedAt
    );
  }
}
