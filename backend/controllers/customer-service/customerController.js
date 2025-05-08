import { PrismaClient } from "@prisma/client";
import { httpError } from "../../utils/httpError.js";

const prisma = new PrismaClient();

/**
 * Müşteri verilerini normalize eder, özellikle BigInt değerlerini string'e çevirir.
 * @param {object} customer - Normalize edilecek müşteri nesnesi
 * @returns {object} - Normalize edilmiş müşteri nesnesi
 */
const normalizeCustomer = (customer) => ({
  ...customer,
  id: customer.id.toString(),
  userId: customer.userId.toString(),
});

/**
 * Yeni bir müşteri oluşturur.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Oluşturulan müşteri bilgisi veya hata mesajı
 */
export const createCustomer = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      notes,
    } = req.body;

    // Eğer e-posta varsa, aynı kullanıcı için mükerrer e-posta kontrolü yap
    if (email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          userId,
          email,
        },
      });

      if (existingCustomer) {
        return res.status(409).json({
          message: "Bu e-posta adresiyle bir müşteri zaten var",
        });
      }
    }

    const customer = await prisma.customer.create({
      data: {
        userId,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        postalCode,
        country,
        notes,
      },
    });

    return res.status(201).json(normalizeCustomer(customer));
  } catch (error) {
    next(error);
  }
};

/**
 * Kullanıcıya ait tüm müşterileri getirir.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Müşteri listesi veya hata mesajı
 */
export const getCustomers = async (req, res, next) => {
  try {
    // userId değeri kontrol ediliyor
    if (!req.userId) {
      return next(httpError(401, "Yetkilendirme gerekli"));
    }

    const customers = await prisma.customer.findMany({
      where: { userId: BigInt(req.userId) },
      // Sadece var olan alanları seç
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // BigInt değerlerini string'e dönüştür
    const normalizedCustomers = customers.map(normalizeCustomer);

    res.json(normalizedCustomers);
  } catch (error) {
    console.error("getCustomers error:", error);
    next(error);
  }
};

/**
 * ID'ye göre müşteri getirir.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Müşteri bilgisi veya hata mesajı
 */
export const getCustomerById = async (req, res, next) => {
  try {
    // userId değeri kontrol ediliyor
    if (!req.userId) {
      return next(httpError(401, "Yetkilendirme gerekli"));
    }

    const { id } = req.params;

    // ID değeri kontrol ediliyor
    if (!id) {
      return next(httpError(400, "Müşteri ID'si gerekli"));
    }

    const customer = await prisma.customer.findUnique({
      where: { id: BigInt(id) },
      // Sadece var olan alanları seç
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!customer) {
      return next(httpError(404, "Müşteri bulunamadı"));
    }

    // Kullanıcı sadece kendi müşterilerini görebilir
    if (customer.userId !== BigInt(req.userId)) {
      return next(httpError(403, "Bu işlem için yetkiniz yok"));
    }

    // BigInt değerlerini string'e dönüştür
    const normalizedCustomer = normalizeCustomer(customer);

    res.json(normalizedCustomer);
  } catch (error) {
    console.error("getCustomerById error:", error);
    next(error);
  }
};

/**
 * Müşteri bilgilerini günceller.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Güncellenmiş müşteri bilgisi veya hata mesajı
 */
export const updateCustomer = async (req, res, next) => {
  try {
    // userId değeri kontrol ediliyor
    if (!req.userId) {
      return next(httpError(401, "Yetkilendirme gerekli"));
    }

    const userId = BigInt(req.userId);
    const id = BigInt(req.params.id);

    // ID değeri kontrol ediliyor
    if (!req.params.id) {
      return next(httpError(400, "Müşteri ID'si gerekli"));
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      notes,
      emailConsent,
      smsConsent,
      phoneConsent,
      preferredChannel,
      companyName,
      taxId,
      tags,
    } = req.body;

    // Önce müşteriyi bul
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return next(httpError(404, "Müşteri bulunamadı"));
    }

    // Sadece kendi müşterilerini güncelleyebilir
    if (customer.userId !== userId) {
      return next(httpError(403, "Bu müşteriyi güncelleme izniniz yok"));
    }

    // E-posta değiştiyse ve varsa çakışma kontrolü yap
    if (email && email !== customer.email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          userId,
          email,
          id: {
            not: id,
          },
        },
      });

      if (existingCustomer) {
        return next(
          httpError(409, "Bu e-posta adresiyle başka bir müşteri zaten var")
        );
      }
    }

    // Güncelleme verilerini hazırla
    const updateData = {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      notes,
    };

    // CRM alanlarını ekle (varsa)
    if (emailConsent !== undefined) updateData.emailConsent = emailConsent;
    if (smsConsent !== undefined) updateData.smsConsent = smsConsent;
    if (phoneConsent !== undefined) updateData.phoneConsent = phoneConsent;
    if (preferredChannel) updateData.preferredChannel = preferredChannel;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (taxId !== undefined) updateData.taxId = taxId;
    if (tags) updateData.tags = tags;

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: updateData,
    });

    return res.json(normalizeCustomer(updatedCustomer));
  } catch (error) {
    console.error("updateCustomer error:", error);
    next(error);
  }
};

/**
 * Müşteriyi siler.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Başarı durumu veya hata mesajı
 */
export const deleteCustomer = async (req, res, next) => {
  try {
    // userId değeri kontrol ediliyor
    if (!req.userId) {
      return next(httpError(401, "Yetkilendirme gerekli"));
    }

    const userId = BigInt(req.userId);
    const id = BigInt(req.params.id);

    // ID değeri kontrol ediliyor
    if (!req.params.id) {
      return next(httpError(400, "Müşteri ID'si gerekli"));
    }

    // Önce müşteriyi bul
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return next(httpError(404, "Müşteri bulunamadı"));
    }

    // Sadece kendi müşterilerini silebilir
    if (customer.userId !== userId) {
      return next(httpError(403, "Bu müşteriyi silme izniniz yok"));
    }

    // Müşterinin siparişleri var mı kontrol et
    const orderCount = await prisma.order.count({
      where: {
        customerId: id,
      },
    });

    if (orderCount > 0) {
      return next(
        httpError(400, "Bu müşteriye ait siparişler olduğu için silinemez")
      );
    }

    // Müşteriyi sil
    await prisma.customer.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("deleteCustomer error:", error);
    next(error);
  }
};

/**
 * Müşterinin siparişlerini getirir.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Sipariş listesi veya hata mesajı
 */
export const getCustomerOrders = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id: BigInt(id) },
    });

    if (!customer) {
      return next(httpError(404, "Müşteri bulunamadı"));
    }

    // Kullanıcı sadece kendi müşterilerini görebilir
    if (customer.userId !== BigInt(req.userId)) {
      return next(httpError(403, "Bu işlem için yetkiniz yok"));
    }

    const orders = await prisma.order.findMany({
      where: { customerId: BigInt(id) },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 * Müşterinin yaşam boyu değerini hesaplar
 * NOT: Bu fonksiyon şu anda veritabanında gerekli sütunlar olmadığı için devre dışı bırakılmıştır.
 * Migration yapmadan önce aktifleştirmeyiniz.
 */
/*
export const calculateLifetimeValue = async (req, res, next) => {
  // Fonksiyon içeriği
};
*/

/**
 * Tüm müşterilerin segmentasyonunu yapar
 * NOT: Bu fonksiyon şu anda veritabanında gerekli sütunlar olmadığı için devre dışı bırakılmıştır.
 * Migration yapmadan önce aktifleştirmeyiniz.
 */
/*
export const segmentAllCustomers = async (req, res, next) => {
  // Fonksiyon içeriği
};
*/

/**
 * Belirli bir segmentteki tüm müşterileri döndürür
 * NOT: Bu fonksiyon şu anda veritabanında gerekli sütunlar olmadığı için devre dışı bırakılmıştır.
 * Migration yapmadan önce aktifleştirmeyiniz.
 */
/*
export const getCustomersBySegment = async (req, res, next) => {
  // Fonksiyon içeriği
};
*/

/**
 * Müşterinin iletişim kayıtlarını getirir
 * NOT: Bu fonksiyon şu anda veritabanında gerekli tablo olmadığı için devre dışı bırakılmıştır.
 * Migration yapmadan önce aktifleştirmeyiniz.
 */
/*
export const getCustomerCommunicationLogs = async (req, res, next) => {
  // Fonksiyon içeriği
};
*/

/**
 * Müşteriye yeni bir iletişim kaydı ekler
 * NOT: Bu fonksiyon şu anda veritabanında gerekli tablo olmadığı için devre dışı bırakılmıştır.
 * Migration yapmadan önce aktifleştirmeyiniz.
 */
/*
export const addCommunicationLog = async (req, res, next) => {
  // Fonksiyon içeriği
};
*/
