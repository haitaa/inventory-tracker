/**
 * Sayfa bölümü repository arayüzü
 */
export class IPageSectionRepository {
  /**
   * @param {string} id
   * @returns {Promise<import('../PageSection.js').PageSection>}
   */
  async getById(id) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} pageId
   * @returns {Promise<import('../PageSection.js').PageSection[]>}
   */
  async getByPageId(pageId) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} pageId
   * @returns {Promise<import('../PageSection.js').PageSection[]>}
   */
  async getRootSections(pageId) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} parentSectionId
   * @returns {Promise<import('../PageSection.js').PageSection[]>}
   */
  async getChildSections(parentSectionId) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../PageSection.js').PageSection} section
   * @returns {Promise<import('../PageSection.js').PageSection>}
   */
  async create(section) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../PageSection.js').PageSection} section
   * @returns {Promise<import('../PageSection.js').PageSection>}
   */
  async update(section) {
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
   * Sayfadaki bölüm sırasını günceller
   * @param {string} pageId
   * @param {Array<string>} sectionIds - Sıralanmış bölüm ID'leri
   * @returns {Promise<boolean>}
   */
  async updateOrder(pageId, sectionIds) {
    throw new Error("Method not implemented");
  }
}
