import { PrismaClient } from "@prisma/client";

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
    const userId = BigInt(req.userId);

    const customers = await prisma.customer.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(customers.map(normalizeCustomer));
  } catch (error) {
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
    const userId = BigInt(req.userId);
    const id = BigInt(req.params.id);

    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Müşteri bulunamadı" });
    }

    // Sadece kendi müşterilerini görebilir
    if (customer.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Bu müşteriye erişim izniniz yok" });
    }

    return res.status(200).json(normalizeCustomer(customer));
  } catch (error) {
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
    const userId = BigInt(req.userId);
    const id = BigInt(req.params.id);

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

    // Önce müşteriyi bul
    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Müşteri bulunamadı" });
    }

    // Sadece kendi müşterilerini güncelleyebilir
    if (customer.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Bu müşteriyi güncelleme izniniz yok" });
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
        return res.status(409).json({
          message: "Bu e-posta adresiyle başka bir müşteri zaten var",
        });
      }
    }

    const updatedCustomer = await prisma.customer.update({
      where: {
        id,
      },
      data: {
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

    return res.status(200).json(normalizeCustomer(updatedCustomer));
  } catch (error) {
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
    const userId = BigInt(req.userId);
    const id = BigInt(req.params.id);

    // Önce müşteriyi bul
    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Müşteri bulunamadı" });
    }

    // Sadece kendi müşterilerini silebilir
    if (customer.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Bu müşteriyi silme izniniz yok" });
    }

    // Müşterinin siparişleri var mı kontrol et
    const orderCount = await prisma.order.count({
      where: {
        customerId: id,
      },
    });

    if (orderCount > 0) {
      return res.status(400).json({
        message: "Bu müşteriye ait siparişler olduğu için silinemez",
      });
    }

    // Müşteriyi sil
    await prisma.customer.delete({
      where: {
        id,
      },
    });

    return res.status(204).send();
  } catch (error) {
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
    const userId = BigInt(req.userId);
    const id = BigInt(req.params.id);

    // Önce müşteriyi bul
    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Müşteri bulunamadı" });
    }

    // Sadece kendi müşterilerinin siparişlerini görebilir
    if (customer.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Bu müşterinin siparişlerine erişim izniniz yok" });
    }

    // Müşterinin siparişlerini getir
    const orders = await prisma.order.findMany({
      where: {
        customerId: id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
