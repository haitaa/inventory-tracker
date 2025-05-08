/**
 * Mağaza teması repository arayüzü
 */
export class IStoreThemeRepository {
  /**
   * @param {string} id
   * @returns {Promise<import('../StoreTheme.js').StoreTheme>}
   */
  async getById(id) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} storeId
   * @returns {Promise<import('../StoreTheme.js').StoreTheme[]>}
   */
  async getByStoreId(storeId) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} storeId
   * @param {string} name
   * @returns {Promise<import('../StoreTheme.js').StoreTheme>}
   */
  async getByStoreIdAndName(storeId, name) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} storeId
   * @returns {Promise<import('../StoreTheme.js').StoreTheme>}
   */
  async getDefaultTheme(storeId) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../StoreTheme.js').StoreTheme} theme
   * @returns {Promise<import('../StoreTheme.js').StoreTheme>}
   */
  async create(theme) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../StoreTheme.js').StoreTheme} theme
   * @returns {Promise<import('../StoreTheme.js').StoreTheme>}
   */
  async update(theme) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error("Method not implemented");
  }

  /**
   * Varsayılan temayı ayarlar ve diğer temaları varsayılan olmaktan çıkarır
   * @param {string} storeId
   * @param {string} themeId
   * @returns {Promise<boolean>}
   */
  async setDefaultTheme(storeId, themeId) {
    throw new Error("Method not implemented");
  }
}
