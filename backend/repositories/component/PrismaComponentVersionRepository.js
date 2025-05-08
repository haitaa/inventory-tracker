import { IComponentVersionRepository } from "../../domain/component/interfaces/IComponentVersionRepository.js";
import { ComponentVersion } from "../../domain/component/ComponentVersion.js";
import { compareVersions } from "../../utils/versionUtils.js";

/**
 * ComponentVersion repository implementasyonu (Prisma)
 */
export class PrismaComponentVersionRepository extends IComponentVersionRepository {
  /**
   * @param {import('@prisma/client').PrismaClient} prisma
   */
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  /**
   * @param {string} id
   * @returns {Promise<ComponentVersion>}
   */
  async getById(id) {
    const version = await this.prisma.componentVersion.findUnique({
      where: { id: BigInt(id) },
    });

    if (!version) {
      return null;
    }

    return this.mapToDomain(version);
  }

  /**
   * @param {string} componentId
   * @returns {Promise<ComponentVersion[]>}
   */
  async getByComponentId(componentId) {
    const versions = await this.prisma.componentVersion.findMany({
      where: { componentId: BigInt(componentId) },
      orderBy: { createdAt: "desc" },
    });

    return versions.map(this.mapToDomain);
  }

  /**
   * @param {string} componentId
   * @param {string} version
   * @returns {Promise<ComponentVersion>}
   */
  async getByComponentIdAndVersion(componentId, version) {
    const componentVersion = await this.prisma.componentVersion.findFirst({
      where: {
        componentId: BigInt(componentId),
        version: version,
      },
    });

    if (!componentVersion) {
      return null;
    }

    return this.mapToDomain(componentVersion);
  }

  /**
   * @param {string} componentId
   * @returns {Promise<ComponentVersion>}
   */
  async getLatestVersion(componentId) {
    const versions = await this.prisma.componentVersion.findMany({
      where: { componentId: BigInt(componentId) },
      orderBy: { createdAt: "desc" },
    });

    if (!versions.length) {
      return null;
    }

    // En son versiyonu bul (semantik versiyonlama)
    let latestVersion = versions[0];
    for (const version of versions) {
      if (compareVersions(version.version, latestVersion.version) > 0) {
        latestVersion = version;
      }
    }

    return this.mapToDomain(latestVersion);
  }

  /**
   * @param {string} componentId
   * @returns {Promise<ComponentVersion[]>}
   */
  async getActiveVersions(componentId) {
    const versions = await this.prisma.componentVersion.findMany({
      where: {
        componentId: BigInt(componentId),
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return versions.map(this.mapToDomain);
  }

  /**
   * @param {ComponentVersion} version
   * @returns {Promise<ComponentVersion>}
   */
  async create(version) {
    const createdVersion = await this.prisma.componentVersion.create({
      data: {
        componentId: BigInt(version.componentId),
        version: version.version,
        template: version.template,
        script: version.script,
        style: version.style,
        isActive: version.isActive,
      },
    });

    return this.mapToDomain(createdVersion);
  }

  /**
   * @param {ComponentVersion} version
   * @returns {Promise<ComponentVersion>}
   */
  async update(version) {
    const updatedVersion = await this.prisma.componentVersion.update({
      where: { id: BigInt(version.id) },
      data: {
        version: version.version,
        template: version.template,
        script: version.script,
        style: version.style,
        isActive: version.isActive,
      },
    });

    return this.mapToDomain(updatedVersion);
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      await this.prisma.componentVersion.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      console.error("ComponentVersion silme hatası:", error);
      return false;
    }
  }

  /**
   * Veritabanı modelini domain modeline dönüştürür
   * @param {*} dbModel
   * @returns {ComponentVersion}
   */
  mapToDomain(dbModel) {
    return new ComponentVersion(
      dbModel.id.toString(),
      dbModel.componentId.toString(),
      dbModel.version,
      dbModel.template,
      dbModel.script,
      dbModel.style,
      dbModel.isActive,
      dbModel.createdAt,
      dbModel.updatedAt
    );
  }
}
