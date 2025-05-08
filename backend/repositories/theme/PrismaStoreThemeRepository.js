import { IStoreThemeRepository } from "../../domain/theme/interfaces/IStoreThemeRepository.js";
import { StoreTheme } from "../../domain/theme/StoreTheme.js";

/**
 * StoreTheme repository implementasyonu (Prisma)
 */
export class PrismaStoreThemeRepository extends IStoreThemeRepository {
  /**
   * @param {import('@prisma/client').PrismaClient} prisma
   */
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  /**
   * @param {string} id
   * @returns {Promise<StoreTheme>}
   */
  async getById(id) {
    const theme = await this.prisma.storeTheme.findUnique({
      where: { id: BigInt(id) },
    });

    if (!theme) {
      return null;
    }

    return this.mapToDomain(theme);
  }

  /**
   * @param {string} storeId
   * @returns {Promise<StoreTheme[]>}
   */
  async getByStoreId(storeId) {
    const themes = await this.prisma.storeTheme.findMany({
      where: { storeId: BigInt(storeId) },
      orderBy: { name: "asc" },
    });

    return themes.map(this.mapToDomain);
  }

  /**
   * @param {string} storeId
   * @param {string} name
   * @returns {Promise<StoreTheme>}
   */
  async getByStoreIdAndName(storeId, name) {
    const theme = await this.prisma.storeTheme.findFirst({
      where: {
        storeId: BigInt(storeId),
        name,
      },
    });

    if (!theme) {
      return null;
    }

    return this.mapToDomain(theme);
  }

  /**
   * @param {string} storeId
   * @returns {Promise<StoreTheme>}
   */
  async getDefaultTheme(storeId) {
    const theme = await this.prisma.storeTheme.findFirst({
      where: {
        storeId: BigInt(storeId),
        isDefault: true,
      },
    });

    if (!theme) {
      return null;
    }

    return this.mapToDomain(theme);
  }

  /**
   * @param {StoreTheme} theme
   * @returns {Promise<StoreTheme>}
   */
  async create(theme) {
    const createdTheme = await this.prisma.storeTheme.create({
      data: {
        storeId: BigInt(theme.storeId),
        name: theme.name,
        description: theme.description,
        isDefault: theme.isDefault,
        variables: theme.variables,
        settings: theme.settings,
      },
    });

    return this.mapToDomain(createdTheme);
  }

  /**
   * @param {StoreTheme} theme
   * @returns {Promise<StoreTheme>}
   */
  async update(theme) {
    const updatedTheme = await this.prisma.storeTheme.update({
      where: { id: BigInt(theme.id) },
      data: {
        name: theme.name,
        description: theme.description,
        isDefault: theme.isDefault,
        variables: theme.variables,
        settings: theme.settings,
      },
    });

    return this.mapToDomain(updatedTheme);
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      const theme = await this.getById(id);

      // Varsayılan temayı silmeye çalışıyorsa hata fırlat
      if (theme && theme.isDefault) {
        throw new Error("Varsayılan tema silinemez");
      }

      await this.prisma.storeTheme.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      console.error("StoreTheme silme hatası:", error);
      return false;
    }
  }

  /**
   * Varsayılan temayı ayarlar ve diğer temaları varsayılan olmaktan çıkarır
   * @param {string} storeId
   * @param {string} themeId
   * @returns {Promise<boolean>}
   */
  async setDefaultTheme(storeId, themeId) {
    try {
      // Önce tüm temaları varsayılan olmaktan çıkar
      await this.prisma.storeTheme.updateMany({
        where: { storeId: BigInt(storeId) },
        data: { isDefault: false },
      });

      // Seçilen temayı varsayılan yap
      await this.prisma.storeTheme.update({
        where: { id: BigInt(themeId) },
        data: { isDefault: true },
      });

      return true;
    } catch (error) {
      console.error("Varsayılan tema ayarlama hatası:", error);
      return false;
    }
  }

  /**
   * Veritabanı modelini domain modeline dönüştürür
   * @param {*} dbModel
   * @returns {StoreTheme}
   */
  mapToDomain(dbModel) {
    return new StoreTheme(
      dbModel.id.toString(),
      dbModel.storeId.toString(),
      dbModel.name,
      dbModel.description,
      dbModel.isDefault,
      dbModel.variables,
      dbModel.settings,
      dbModel.createdAt,
      dbModel.updatedAt
    );
  }
}
