/**
 * Mağaza repository arayüzü
 */
export class IStoreRepository {
  /**
   * @param {string} id
   * @returns {Promise<import('../Store.js').Store>}
   */
  async getById(id) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} userId
   * @returns {Promise<import('../Store.js').Store[]>}
   */
  async getByUserId(userId) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} subdomain
   * @returns {Promise<import('../Store.js').Store>}
   */
  async getBySubdomain(subdomain) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} domain
   * @returns {Promise<import('../Store.js').Store>}
   */
  async getByDomain(domain) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../Store.js').Store} store
   * @returns {Promise<import('../Store.js').Store>}
   */
  async create(store) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../Store.js').Store} store
   * @returns {Promise<import('../Store.js').Store>}
   */
  async update(store) {
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
