/**
 * Mağaza sayfası domain sınıfı
 */
export class StorePage {
  /**
   * @param {string} id
   * @param {string} storeId
   * @param {string} title
   * @param {string} slug
   * @param {object} content
   * @param {object} seo
   * @param {boolean} isHomepage
   * @param {boolean} isPublished
   * @param {Date} createdAt
   * @param {Date} updatedAt
   */
  constructor(
    id,
    storeId,
    title,
    slug,
    content,
    seo,
    isHomepage,
    isPublished,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.storeId = storeId;
    this.title = title;
    this.slug = slug;
    this.content = content;
    this.seo = seo;
    this.isHomepage = isHomepage;
    this.isPublished = isPublished;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
