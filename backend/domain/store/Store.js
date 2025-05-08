/**
 * Mağaza domain sınıfı
 */
export class Store {
  /**
   * @param {string} id
   * @param {string} userId
   * @param {string} name
   * @param {string} description
   * @param {string} logo
   * @param {string} favicon
   * @param {string} subdomain
   * @param {string} domain
   * @param {string} templateId
   * @param {object} customization
   * @param {object} settings
   * @param {boolean} isActive
   * @param {boolean} isPublished
   * @param {Date} createdAt
   * @param {Date} updatedAt
   */
  constructor(
    id,
    userId,
    name,
    description,
    logo,
    favicon,
    subdomain,
    domain,
    templateId,
    customization,
    settings,
    isActive,
    isPublished,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.logo = logo;
    this.favicon = favicon;
    this.subdomain = subdomain;
    this.domain = domain;
    this.templateId = templateId;
    this.customization = customization;
    this.settings = settings;
    this.isActive = isActive;
    this.isPublished = isPublished;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
