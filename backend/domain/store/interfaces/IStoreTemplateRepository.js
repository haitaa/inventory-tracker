/**
 * Mağaza şablonu repository arayüzü
 */
export class IStoreTemplateRepository {
  /**
   * @param {string} id
   * @returns {Promise<import('../StoreTemplate.js').StoreTemplate>}
   */
  async getById(id) {
    throw new Error("Method not implemented");
  }

  /**
   * @returns {Promise<import('../StoreTemplate.js').StoreTemplate[]>}
   */
  async getAll() {
    throw new Error("Method not implemented");
  }

  /**
   * @returns {Promise<import('../StoreTemplate.js').StoreTemplate[]>}
   */
  async getActive() {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} type
   * @returns {Promise<import('../StoreTemplate.js').StoreTemplate[]>}
   */
  async getByType(type) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../StoreTemplate.js').StoreTemplate} template
   * @returns {Promise<import('../StoreTemplate.js').StoreTemplate>}
   */
  async create(template) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../StoreTemplate.js').StoreTemplate} template
   * @returns {Promise<import('../StoreTemplate.js').StoreTemplate>}
   */
  async update(template) {
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
