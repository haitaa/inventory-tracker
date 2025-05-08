/**
 * Bileşen kategorisi domain sınıfı
 */
export class ComponentCategory {
  /**
   * @param {string} id
   * @param {string} name
   * @param {string} description
   * @param {string} icon
   * @param {string} slug
   * @param {Date} createdAt
   * @param {Date} updatedAt
   */
  constructor(id, name, description, icon, slug, createdAt, updatedAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.slug = slug;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
