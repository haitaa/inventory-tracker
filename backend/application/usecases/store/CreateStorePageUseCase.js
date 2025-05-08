import { StorePage } from "../../../domain/store/StorePage.js";

/**
 * Mağaza sayfası oluşturma kullanım senaryosu
 */
export class CreateStorePageUseCase {
  /**
   * @param {import('../../../domain/store/interfaces/IStoreRepository').IStoreRepository} storeRepository
   * @param {import('../../../domain/store/interfaces/IStorePageRepository').IStorePageRepository} storePageRepository
   */
  constructor(storeRepository, storePageRepository) {
    this.storeRepository = storeRepository;
    this.storePageRepository = storePageRepository;
  }

  /**
   * Yeni bir mağaza sayfası oluşturur
   *
   * @param {string} storeId - Mağaza kimliği
   * @param {string} title - Sayfa başlığı
   * @param {string} slug - Sayfa URL slug'ı
   * @param {object} content - Sayfa içeriği (JSON)
   * @param {object} seo - SEO meta verileri (isteğe bağlı)
   * @param {boolean} isHomepage - Ana sayfa mı? (isteğe bağlı)
   * @param {boolean} isPublished - Yayında mı? (isteğe bağlı)
   * @returns {Promise<StorePage>} - Oluşturulan sayfa
   * @throws {Error} - Mağaza yoksa veya slug zaten kullanımdaysa
   */
  async execute(
    storeId,
    title,
    slug,
    content,
    seo = {},
    isHomepage = false,
    isPublished = true
  ) {
    // Mağazanın varlığını kontrol et
    const store = await this.storeRepository.getById(storeId);
    if (!store) {
      throw new Error(`ID'si ${storeId} olan mağaza bulunamadı`);
    }

    // Slug'ın benzersiz olup olmadığını kontrol et
    const existingPage = await this.storePageRepository.getByStoreIdAndSlug(
      storeId,
      slug
    );
    if (existingPage) {
      throw new Error(`'${slug}' slug'ı bu mağaza için zaten kullanımda`);
    }

    // Eğer ana sayfa olarak işaretlendiyse, diğer ana sayfayı kontrol et
    if (isHomepage) {
      const currentHomepage =
        await this.storePageRepository.getHomepageByStoreId(storeId);
      if (currentHomepage) {
        throw new Error(
          "Bu mağaza için zaten bir ana sayfa mevcut. Önce mevcut ana sayfayı güncelleyin."
        );
      }
    }

    // Yeni sayfa oluştur
    const page = new StorePage(
      null, // ID, veritabanı tarafından oluşturulacak
      storeId,
      title,
      slug,
      content,
      seo,
      isHomepage,
      isPublished,
      new Date(),
      new Date()
    );

    // Sayfayı kaydet
    return await this.storePageRepository.create(page);
  }
}
