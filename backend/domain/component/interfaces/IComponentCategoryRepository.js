/**
 * Bileşen kategorisi repository arayüzü
 */
export class IComponentCategoryRepository {
  /**
   * @param {string} id
   * @returns {Promise<import('../ComponentCategory.js').ComponentCategory>}
   */
  async getById(id) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} slug
   * @returns {Promise<import('../ComponentCategory.js').ComponentCategory>}
   */
  async getBySlug(slug) {
    throw new Error("Method not implemented");
  }

  /**
   * @returns {Promise<import('../ComponentCategory.js').ComponentCategory[]>}
   */
  async getAll() {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../ComponentCategory.js').ComponentCategory} category
   * @returns {Promise<import('../ComponentCategory.js').ComponentCategory>}
   */
  async create(category) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../ComponentCategory.js').ComponentCategory} category
   * @returns {Promise<import('../ComponentCategory.js').ComponentCategory>}
   */
  async update(category) {
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
