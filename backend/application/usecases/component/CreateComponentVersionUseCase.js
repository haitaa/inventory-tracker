import { ComponentVersion } from "../../../domain/component/ComponentVersion.js";

/**
 * Bileşen versiyonu oluşturma use case'i
 */
export class CreateComponentVersionUseCase {
  /**
   * @param {import('../../../domain/component/interfaces/IComponentVersionRepository').IComponentVersionRepository} componentVersionRepository
   * @param {import('../../../domain/component/interfaces/IComponentRepository').IComponentRepository} componentRepository
   */
  constructor(componentVersionRepository, componentRepository) {
    this.componentVersionRepository = componentVersionRepository;
    this.componentRepository = componentRepository;
  }

  /**
   * Yeni bir bileşen versiyonu oluşturur
   *
   * @param {string} componentId - Bileşen ID
   * @param {string} version - Versiyon numarası (semantik: x.y.z)
   * @param {string} template - HTML/React şablonu
   * @param {string} script - JavaScript kodu
   * @param {string} style - CSS kodu
   * @returns {Promise<ComponentVersion>} - Oluşturulan bileşen versiyonu
   * @throws {Error} - Bileşen bulunamazsa veya versiyon zaten varsa
   */
  async execute(componentId, version, template, script, style) {
    // Bileşenin varlığını kontrol et
    const component = await this.componentRepository.getById(componentId);
    if (!component) {
      throw new Error(`ID'si ${componentId} olan bileşen bulunamadı`);
    }

    // Versiyon kontrolü, aynı versiyon numarası varsa hata fırlat
    const existingVersion =
      await this.componentVersionRepository.getByComponentIdAndVersion(
        componentId,
        version
      );
    if (existingVersion) {
      throw new Error(`Bu bileşen için '${version}' versiyonu zaten mevcut`);
    }

    // Yeni bileşen versiyonu oluştur
    const componentVersion = new ComponentVersion(
      null, // ID, veritabanı tarafından oluşturulacak
      componentId,
      version,
      template,
      script,
      style,
      true, // Aktif
      new Date(),
      new Date()
    );

    // Bileşen versiyonunu kaydet
    return await this.componentVersionRepository.create(componentVersion);
  }
}
