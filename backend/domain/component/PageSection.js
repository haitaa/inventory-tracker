/**
 * Sayfa bölümü domain sınıfı
 */
export class PageSection {
  /**
   * @param {string} id
   * @param {string} pageId
   * @param {string} componentVersionId
   * @param {string} name
   * @param {object} props
   * @param {number} order
   * @param {string} parentSectionId
   * @param {object} containerSettings
   * @param {object} styleOverrides
   * @param {boolean} isVisible
   * @param {Date} createdAt
   * @param {Date} updatedAt
   */
  constructor(
    id,
    pageId,
    componentVersionId,
    name,
    props,
    order,
    parentSectionId,
    containerSettings,
    styleOverrides,
    isVisible,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.pageId = pageId;
    this.componentVersionId = componentVersionId;
    this.name = name;
    this.props = props;
    this.order = order;
    this.parentSectionId = parentSectionId;
    this.containerSettings = containerSettings;
    this.styleOverrides = styleOverrides;
    this.isVisible = isVisible;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
