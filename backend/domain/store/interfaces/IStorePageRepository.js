/**
 * Mağaza sayfası repository arayüzü
 */
export class IStorePageRepository {
  /**
   * @param {string} id
   * @returns {Promise<import('../StorePage.js').StorePage>}
   */
  async getById(id) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} storeId
   * @returns {Promise<import('../StorePage.js').StorePage[]>}
   */
  async getByStoreId(storeId) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} storeId
   * @param {string} slug
   * @returns {Promise<import('../StorePage.js').StorePage>}
   */
  async getByStoreIdAndSlug(storeId, slug) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} storeId
   * @returns {Promise<import('../StorePage.js').StorePage>}
   */
  async getHomepageByStoreId(storeId) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../StorePage.js').StorePage} page
   * @returns {Promise<import('../StorePage.js').StorePage>}
   */
  async create(page) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../StorePage.js').StorePage} page
   * @returns {Promise<import('../StorePage.js').StorePage>}
   */
  async update(page) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error("Method not implemented");
  }
}
