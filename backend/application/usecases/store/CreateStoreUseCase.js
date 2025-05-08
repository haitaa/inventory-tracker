import { Store } from "../../../domain/store/Store.js";

/**
 * Mağaza oluşturma kullanım senaryosu
 */
export class CreateStoreUseCase {
  /**
   * @param {import('../../../domain/store/interfaces/IStoreRepository').IStoreRepository} storeRepository
   * @param {import('../../../domain/store/interfaces/IStoreTemplateRepository').IStoreTemplateRepository} storeTemplateRepository
   */
  constructor(storeRepository, storeTemplateRepository) {
    this.storeRepository = storeRepository;
    this.storeTemplateRepository = storeTemplateRepository;
  }

  /**
   * Yeni bir mağaza oluşturur
   *
   * @param {string} userId - Kullanıcı kimliği
   * @param {string} name - Mağaza adı
   * @param {string} description - Mağaza açıklaması
   * @param {string} subdomain - Alt alan adı
   * @param {string} templateId - Şablon kimliği
   * @param {string} domain - Özel alan adı (isteğe bağlı)
   * @param {string} logo - Logo URL (isteğe bağlı)
   * @param {string} favicon - Favicon URL (isteğe bağlı)
   * @param {object} settings - Mağaza ayarları (isteğe bağlı)
   * @returns {Promise<Store>} - Oluşturulan mağaza
   * @throws {Error} - Şablon bulunamazsa veya subdomain zaten kullanımdaysa
   */
  async execute(
    userId,
    name,
    description,
    subdomain,
    templateId,
    domain = null,
    logo = null,
    favicon = null,
    settings = {}
  ) {
    // Subdomain kontrolü
    const existingStore = await this.storeRepository.getBySubdomain(subdomain);
    if (existingStore) {
      throw new Error(`'${subdomain}' alt alan adı zaten kullanımda`);
    }

    // Özel domain kontrolü
    if (domain) {
      const existingDomain = await this.storeRepository.getByDomain(domain);
      if (existingDomain) {
        throw new Error(`'${domain}' alan adı zaten kullanımda`);
      }
    }

    // Şablonun varlığını kontrol et
    const template = await this.storeTemplateRepository.getById(templateId);
    if (!template) {
      throw new Error(`ID'si ${templateId} olan şablon bulunamadı`);
    }

    // Yeni mağaza oluştur
    const store = new Store(
      null, // ID, veritabanı tarafından oluşturulacak
      userId,
      name,
      description,
      logo,
      favicon,
      subdomain,
      domain,
      templateId,
      {}, // Başlangıçta özelleştirme yok
      settings,
      true, // Aktif
      false, // Yayınlanmamış
      new Date(),
      new Date()
    );

    // Mağazayı kaydet
    return await this.storeRepository.create(store);
  }
}
