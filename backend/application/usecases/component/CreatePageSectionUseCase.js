import { PageSection } from "../../../domain/component/PageSection.js";

/**
 * Sayfa bölümü oluşturma use case'i
 */
export class CreatePageSectionUseCase {
  /**
   * @param {import('../../../domain/component/interfaces/IPageSectionRepository').IPageSectionRepository} pageSectionRepository
   * @param {import('../../../domain/component/interfaces/IComponentVersionRepository').IComponentVersionRepository} componentVersionRepository
   * @param {import('../../../domain/store/interfaces/IStorePageRepository').IStorePageRepository} storePageRepository
   */
  constructor(
    pageSectionRepository,
    componentVersionRepository,
    storePageRepository
  ) {
    this.pageSectionRepository = pageSectionRepository;
    this.componentVersionRepository = componentVersionRepository;
    this.storePageRepository = storePageRepository;
  }

  /**
   * Yeni bir sayfa bölümü oluşturur
   *
   * @param {string} pageId - Sayfa ID
   * @param {string} componentVersionId - Bileşen versiyon ID
   * @param {string} name - Bölüm adı
   * @param {object} props - Bileşen özellikleri
   * @param {number} order - Sıralama
   * @param {string} parentSectionId - Üst bölüm ID (isteğe bağlı)
   * @param {object} containerSettings - Konteyner ayarları
   * @param {object} styleOverrides - Stil geçersiz kılmaları
   * @returns {Promise<PageSection>} - Oluşturulan sayfa bölümü
   * @throws {Error} - Sayfa veya bileşen versiyonu bulunamazsa
   */
  async execute(
    pageId,
    componentVersionId,
    name,
    props,
    order,
    parentSectionId,
    containerSettings,
    styleOverrides
  ) {
    // Sayfanın varlığını kontrol et
    const page = await this.storePageRepository.getById(pageId);
    if (!page) {
      throw new Error(`ID'si ${pageId} olan sayfa bulunamadı`);
    }

    // Bileşen versiyonunun varlığını kontrol et
    const componentVersion = await this.componentVersionRepository.getById(
      componentVersionId
    );
    if (!componentVersion) {
      throw new Error(
        `ID'si ${componentVersionId} olan bileşen versiyonu bulunamadı`
      );
    }

    // Ebeveyn bölüm kontrolü (varsa)
    if (parentSectionId) {
      const parentSection = await this.pageSectionRepository.getById(
        parentSectionId
      );
      if (!parentSection) {
        throw new Error(
          `ID'si ${parentSectionId} olan ebeveyn bölüm bulunamadı`
        );
      }
      // Ebeveyn bölüm aynı sayfaya ait olmalı
      if (parentSection.pageId !== pageId) {
        throw new Error(
          `Ebeveyn bölüm farklı bir sayfaya ait, aynı sayfada olmalı`
        );
      }
    }

    // Yeni sayfa bölümü oluştur
    const pageSection = new PageSection(
      null, // ID, veritabanı tarafından oluşturulacak
      pageId,
      componentVersionId,
      name,
      props,
      order,
      parentSectionId,
      containerSettings,
      styleOverrides,
      true, // Görünür
      new Date(),
      new Date()
    );

    // Sayfa bölümünü kaydet
    return await this.pageSectionRepository.create(pageSection);
  }
}
