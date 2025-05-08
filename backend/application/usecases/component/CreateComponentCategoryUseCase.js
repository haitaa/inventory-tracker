import { ComponentCategory } from "../../../domain/component/ComponentCategory.js";

/**
 * Bileşen kategorisi oluşturma use case'i
 */
export class CreateComponentCategoryUseCase {
  /**
   * @param {import('../../../domain/component/interfaces/IComponentCategoryRepository').IComponentCategoryRepository} componentCategoryRepository
   */
  constructor(componentCategoryRepository) {
    this.componentCategoryRepository = componentCategoryRepository;
  }

  /**
   * Yeni bir bileşen kategorisi oluşturur
   *
   * @param {string} name - Kategori adı
   * @param {string} description - Kategori açıklaması
   * @param {string} icon - Kategori ikonu
   * @param {string} slug - Kategori slug
   * @returns {Promise<ComponentCategory>} - Oluşturulan kategori
   * @throws {Error} - Slug zaten kullanımdaysa
   */
  async execute(name, description, icon, slug) {
    // Slug kontrolü
    const existingCategory = await this.componentCategoryRepository.getBySlug(
      slug
    );
    if (existingCategory) {
      throw new Error(`'${slug}' slug'ı zaten kullanımda`);
    }

    // Yeni kategori oluştur
    const category = new ComponentCategory(
      null, // ID, veritabanı tarafından oluşturulacak
      name,
      description,
      icon,
      slug,
      new Date(),
      new Date()
    );

    // Kategoriyi kaydet
    return await this.componentCategoryRepository.create(category);
  }
}
