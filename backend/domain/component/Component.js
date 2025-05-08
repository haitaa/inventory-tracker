/**
 * Bileşen domain sınıfı
 */
export class Component {
  /**
   * @param {string} id
   * @param {string} name
   * @param {string} description
   * @param {string} categoryId
   * @param {string} type
   * @param {string} thumbnail
   * @param {object} schema
   * @param {object} defaultProps
   * @param {object} restrictions
   * @param {boolean} isGlobal
   * @param {boolean} isActive
   * @param {Date} createdAt
   * @param {Date} updatedAt
   */
  constructor(
    id,
    name,
    description,
    categoryId,
    type,
    thumbnail,
    schema,
    defaultProps,
    restrictions,
    isGlobal,
    isActive,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.categoryId = categoryId;
    this.type = type;
    this.thumbnail = thumbnail;
    this.schema = schema;
    this.defaultProps = defaultProps;
    this.restrictions = restrictions;
    this.isGlobal = isGlobal;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
