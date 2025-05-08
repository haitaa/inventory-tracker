/**
 * Mağaza şablonu domain sınıfı
 */
export class StoreTemplate {
  /**
   * @param {string} id
   * @param {string} name
   * @param {string} description
   * @param {string} thumbnail
   * @param {string} type
   * @param {object} defaultPages
   * @param {object} components
   * @param {boolean} isActive
   * @param {Date} createdAt
   * @param {Date} updatedAt
   */
  constructor(
    id,
    name,
    description,
    thumbnail,
    type,
    defaultPages,
    components,
    isActive,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.thumbnail = thumbnail;
    this.type = type;
    this.defaultPages = defaultPages;
    this.components = components;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
