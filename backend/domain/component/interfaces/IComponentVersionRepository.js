/**
 * Bileşen versiyonu repository arayüzü
 */
export class IComponentVersionRepository {
  /**
   * @param {string} id
   * @returns {Promise<import('../ComponentVersion.js').ComponentVersion>}
   */
  async getById(id) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} componentId
   * @returns {Promise<import('../ComponentVersion.js').ComponentVersion[]>}
   */
  async getByComponentId(componentId) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} componentId
   * @param {string} version
   * @returns {Promise<import('../ComponentVersion.js').ComponentVersion>}
   */
  async getByComponentIdAndVersion(componentId, version) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} componentId
   * @returns {Promise<import('../ComponentVersion.js').ComponentVersion>}
   */
  async getLatestVersion(componentId) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {string} componentId
   * @returns {Promise<import('../ComponentVersion.js').ComponentVersion[]>}
   */
  async getActiveVersions(componentId) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../ComponentVersion.js').ComponentVersion} version
   * @returns {Promise<import('../ComponentVersion.js').ComponentVersion>}
   */
  async create(version) {
    throw new Error("Method not implemented");
  }

  /**
   * @param {import('../ComponentVersion.js').ComponentVersion} version
   * @returns {Promise<import('../ComponentVersion.js').ComponentVersion>}
   */
  async update(version) {
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
