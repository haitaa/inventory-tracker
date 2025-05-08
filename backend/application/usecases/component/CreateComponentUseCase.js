import { Component } from "../../../domain/component/Component.js";

/**
 * Bileşen oluşturma use case'i
 */
export class CreateComponentUseCase {
  /**
   * @param {import('../../../domain/component/interfaces/IComponentRepository').IComponentRepository} componentRepository
   * @param {import('../../../domain/component/interfaces/IComponentCategoryRepository').IComponentCategoryRepository} componentCategoryRepository
   */
  constructor(componentRepository, componentCategoryRepository) {
    this.componentRepository = componentRepository;
    this.componentCategoryRepository = componentCategoryRepository;
  }

  /**
   * Yeni bir bileşen oluşturur
   *
   * @param {string} name - Bileşen adı
   * @param {string} description - Bileşen açıklaması
   * @param {string} categoryId - Kategori ID
   * @param {string} type - Bileşen tipi
   * @param {string} thumbnail - Küçük resim URL
   * @param {object} schema - Bileşen şeması
   * @param {object} defaultProps - Varsayılan özellikler
   * @param {object} restrictions - Kullanım kısıtlamaları
   * @param {boolean} isGlobal - Global mi?
   * @returns {Promise<Component>} - Oluşturulan bileşen
   * @throws {Error} - Kategori bulunamazsa
   */
  async execute(
    name,
    description,
    categoryId,
    type,
    thumbnail,
    schema,
    defaultProps,
    restrictions,
    isGlobal
  ) {
    // Kategorinin varlığını kontrol et
    const category = await this.componentCategoryRepository.getById(categoryId);
    if (!category) {
      throw new Error(`ID'si ${categoryId} olan kategori bulunamadı`);
    }

    // Yeni bileşen oluştur
    const component = new Component(
      null, // ID, veritabanı tarafından oluşturulacak
      name,
      description,
      categoryId,
      type,
      thumbnail,
      schema,
      defaultProps,
      restrictions,
      isGlobal,
      true, // Aktif
      new Date(),
      new Date()
    );

    // Bileşeni kaydet
    return await this.componentRepository.create(component);
  }
}
