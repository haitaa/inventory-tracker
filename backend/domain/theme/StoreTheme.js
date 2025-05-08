/**
 * Mağaza teması domain sınıfı
 */
export class StoreTheme {
  /**
   * @param {string} id
   * @param {string} storeId
   * @param {string} name
   * @param {string} description
   * @param {boolean} isDefault
   * @param {object} variables
   * @param {object} settings
   * @param {Date} createdAt
   * @param {Date} updatedAt
   */
  constructor(
    id,
    storeId,
    name,
    description,
    isDefault,
    variables,
    settings,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.storeId = storeId;
    this.name = name;
    this.description = description;
    this.isDefault = isDefault;
    this.variables = variables;
    this.settings = settings;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
