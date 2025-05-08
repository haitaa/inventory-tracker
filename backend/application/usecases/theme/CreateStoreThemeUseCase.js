import { StoreTheme } from "../../../domain/theme/StoreTheme.js";

/**
 * Mağaza teması oluşturma use case'i
 */
export class CreateStoreThemeUseCase {
  /**
   * @param {import('../../../domain/theme/interfaces/IStoreThemeRepository').IStoreThemeRepository} storeThemeRepository
   * @param {import('../../../domain/store/interfaces/IStoreRepository').IStoreRepository} storeRepository
   */
  constructor(storeThemeRepository, storeRepository) {
    this.storeThemeRepository = storeThemeRepository;
    this.storeRepository = storeRepository;
  }

  /**
   * Yeni bir mağaza teması oluşturur
   *
   * @param {string} storeId - Mağaza ID
   * @param {string} name - Tema adı
   * @param {string} description - Tema açıklaması
   * @param {boolean} isDefault - Varsayılan tema mı?
   * @param {object} variables - Tema değişkenleri (renkler, yazı tipleri vb.)
   * @param {object} settings - Tema ayarları
   * @returns {Promise<StoreTheme>} - Oluşturulan tema
   * @throws {Error} - Mağaza bulunamazsa veya aynı isimli tema zaten varsa
   */
  async execute(storeId, name, description, isDefault, variables, settings) {
    // Mağazanın varlığını kontrol et
    const store = await this.storeRepository.getById(storeId);
    if (!store) {
      throw new Error(`ID'si ${storeId} olan mağaza bulunamadı`);
    }

    // Tema adı kontrolü, aynı isimde tema varsa hata fırlat
    const existingTheme = await this.storeThemeRepository.getByStoreIdAndName(
      storeId,
      name
    );
    if (existingTheme) {
      throw new Error(`Bu mağaza için '${name}' adlı tema zaten mevcut`);
    }

    // Yeni tema oluştur
    const theme = new StoreTheme(
      null, // ID, veritabanı tarafından oluşturulacak
      storeId,
      name,
      description,
      isDefault,
      variables,
      settings,
      new Date(),
      new Date()
    );

    // Temayı kaydet
    const createdTheme = await this.storeThemeRepository.create(theme);

    // Eğer varsayılan tema olarak işaretlendiyse, diğer temaları varsayılan olmaktan çıkar
    if (isDefault) {
      await this.storeThemeRepository.setDefaultTheme(storeId, createdTheme.id);
    }

    return createdTheme;
  }
}
