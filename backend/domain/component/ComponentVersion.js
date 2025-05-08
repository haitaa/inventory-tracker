/**
 * Bileşen versiyonu domain sınıfı
 */
export class ComponentVersion {
  /**
   * @param {string} id
   * @param {string} componentId
   * @param {string} version
   * @param {string} template
   * @param {string} script
   * @param {string} style
   * @param {boolean} isActive
   * @param {Date} createdAt
   * @param {Date} updatedAt
   */
  constructor(
    id,
    componentId,
    version,
    template,
    script,
    style,
    isActive,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.componentId = componentId;
    this.version = version;
    this.template = template;
    this.script = script;
    this.style = style;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
