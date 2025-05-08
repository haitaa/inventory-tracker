/**
 * Bileşen repository arayüzü
 */
export class IComponentRepository {
  /**
   * @param {string} id
   * @returns {Promise<import('../Component.js').Component>}
   */
  async getById(id) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} categoryId
   * @returns {Promise<import('../Component.js').Component[]>}
   */
  async getByCategoryId(categoryId) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} type
   * @returns {Promise<import('../Component.js').Component[]>}
   */
  async getByType(type) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {boolean} isGlobal
   * @returns {Promise<import('../Component.js').Component[]>}
   */
  async getByGlobalStatus(isGlobal) {
    throw new Error("Method not implemented");
  }

  /**
   * @returns {Promise<import('../Component.js').Component[]>}
   */
  async getActive() {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../Component.js').Component} component
   * @returns {Promise<import('../Component.js').Component>}
   */
  async create(component) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../Component.js').Component} component
   * @returns {Promise<import('../Component.js').Component>}
   */
  async update(component) {
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
