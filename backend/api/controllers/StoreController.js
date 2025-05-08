import { CreateStoreUseCase } from "../../application/usecases/store/CreateStoreUseCase.js";

/**
 * Mağaza API Controller
 */
export class StoreController {
  /**
   * @param {CreateStoreUseCase} createStoreUseCase
   */
  constructor(createStoreUseCase) {
    this.createStoreUseCase = createStoreUseCase;
  }

  /**
   * Yeni mağaza oluşturma endpoint'i
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async createStore(req, res) {
    try {
      const { userId } = req.user; // JWT'den alınan kullanıcı kimliği
      const {
        name,
        description,
        subdomain,
        templateId,
        domain,
        logo,
        favicon,
        settings,
      } = req.body;

      // Gerekli alanları kontrol et
      if (!name || !subdomain || !templateId) {
        return res.status(400).json({
          success: false,
          message: "Mağaza adı, alt alan adı ve şablon kimliği gereklidir",
        });
      }

      // Use case'i çalıştır
      const store = await this.createStoreUseCase.execute(
        userId,
        name,
        description,
        subdomain,
        templateId,
        domain,
        logo,
        favicon,
        settings
      );

      return res.status(201).json({
        success: true,
        data: store,
      });
    } catch (error) {
      console.error("Mağaza oluşturma hatası:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Mağaza oluşturulurken bir hata oluştu",
      });
    }
  }

  /**
   * Kullanıcının mağazalarını getirme endpoint'i
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getUserStores(req, res) {
    try {
      const { userId } = req.user; // JWT'den alınan kullanıcı kimliği

      // Repository örneklemesini alın (DI kullanılacak)
      const storeRepository = req.app.locals.storeRepository;

      // Kullanıcının mağazalarını getir
      const stores = await storeRepository.getByUserId(userId);

      return res.status(200).json({
        success: true,
        data: stores,
      });
    } catch (error) {
      console.error("Mağazaları getirme hatası:", error);
      return res.status(500).json({
        success: false,
        message: "Mağazalar getirilirken bir hata oluştu",
      });
    }
  }

  /**
   * Belirli bir mağazayı getirme endpoint'i
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getStoreById(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.user; // JWT'den alınan kullanıcı kimliği

      // Repository örneklemesini alın
      const storeRepository = req.app.locals.storeRepository;

      // Mağazayı getir
      const store = await storeRepository.getById(id);

      if (!store) {
        return res.status(404).json({
          success: false,
          message: "Mağaza bulunamadı",
        });
      }

      // Kullanıcının bu mağazaya erişim yetkisi var mı kontrol et
      if (store.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "Bu mağazaya erişim izniniz yok",
        });
      }

      return res.status(200).json({
        success: true,
        data: store,
      });
    } catch (error) {
      console.error("Mağaza getirme hatası:", error);
      return res.status(500).json({
        success: false,
        message: "Mağaza getirilirken bir hata oluştu",
      });
    }
  }
}
