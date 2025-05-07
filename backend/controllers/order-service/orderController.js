import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Sipariş verilerini normalize eder, özellikle BigInt değerlerini string'e çevirir.
 * @param {object} order - Normalize edilecek sipariş nesnesi
 * @returns {object} - Normalize edilmiş sipariş nesnesi
 */
const normalizeOrder = (order) => ({
  ...order,
  id: order.id.toString(),
  userId: order.userId.toString(),
  customerId: order.customerId.toString(),
  items: order.items ? order.items.map(normalizeOrderItem) : undefined,
});

/**
 * Sipariş kalemlerini normalize eder.
 * @param {object} item - Normalize edilecek sipariş kalemi
 * @returns {object} - Normalize edilmiş sipariş kalemi
 */
const normalizeOrderItem = (item) => ({
  ...item,
  id: item.id.toString(),
  orderId: item.orderId.toString(),
  productId: item.productId.toString(),
});

/**
 * Benzersiz sipariş numarası oluşturur.
 * @returns {string} Benzersiz sipariş numarası
 */
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${year}${month}${day}-${random}`;
};

/**
 * Yeni bir sipariş oluşturur.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Oluşturulan sipariş bilgisi veya hata mesajı
 */
export const createOrder = async (req, res, next) => {
  const prismaTransaction = await prisma.$transaction(async (tx) => {
    try {
      const userId = BigInt(req.userId);

      const {
        customerId,
        items,
        paymentType,
        paymentStatus,
        shippingFee,
        tax,
        discount,
        notes,
        shippingAddress,
        trackingNumber,
        carrierName,
      } = req.body;

      // Müşteri var mı ve kullanıcıya mı ait kontrol et
      const customer = await tx.customer.findUnique({
        where: { id: BigInt(customerId) },
      });

      if (!customer) {
        return res.status(404).json({ message: "Müşteri bulunamadı" });
      }

      if (customer.userId !== userId) {
        return res
          .status(403)
          .json({ message: "Bu müşteri için sipariş oluşturamazsınız" });
      }

      // Sipariş kalemleri boş olmamalı
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ message: "En az bir ürün eklemelisiniz" });
      }

      // Sipariş numarası oluştur
      const orderNumber = generateOrderNumber();

      // Sipariş kalemleri için toplam tutarı hesapla
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: BigInt(item.productId) },
        });

        if (!product) {
          return res.status(404).json({
            message: `Ürün bulunamadı: ${item.productId}`,
          });
        }

        const quantity = parseInt(item.quantity);
        const unitPrice = parseFloat(item.unitPrice || product.price);
        const itemDiscount = parseFloat(item.discount || 0);
        const itemTotalPrice = quantity * unitPrice - itemDiscount;

        totalAmount += itemTotalPrice;

        orderItems.push({
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          quantity,
          unitPrice,
          taxRate: item.taxRate || product.taxRate,
          discount: itemDiscount,
          totalPrice: itemTotalPrice,
          notes: item.notes,
        });
      }

      // Toplam tutara kargo ücreti ekle, vergi ve indirim uygula
      if (shippingFee) totalAmount += parseFloat(shippingFee);
      if (tax) totalAmount += parseFloat(tax);
      if (discount) totalAmount -= parseFloat(discount);

      // Siparişi oluştur
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          customerId: BigInt(customerId),
          paymentType: paymentType || undefined,
          paymentStatus: paymentStatus || false,
          shippingFee: shippingFee ? parseFloat(shippingFee) : undefined,
          tax: tax ? parseFloat(tax) : undefined,
          discount: discount ? parseFloat(discount) : undefined,
          totalAmount,
          notes,
          shippingAddress,
          trackingNumber,
          carrierName,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });

      return normalizeOrder(order);
    } catch (error) {
      // Transaction içinde hata olursa error throw et
      throw error;
    }
  });

  try {
    return res.status(201).json(prismaTransaction);
  } catch (error) {
    next(error);
  }
};

/**
 * Kullanıcıya ait tüm siparişleri getirir.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Sipariş listesi veya hata mesajı
 */
export const getOrders = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        customer: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(orders.map(normalizeOrder));
  } catch (error) {
    next(error);
  }
};

/**
 * ID'ye göre sipariş getirir.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Sipariş bilgisi veya hata mesajı
 */
export const getOrderById = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);
    const id = BigInt(req.params.id);

    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    // Sadece kendi siparişlerini görebilir
    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Bu siparişe erişim izniniz yok" });
    }

    return res.status(200).json(normalizeOrder(order));
  } catch (error) {
    next(error);
  }
};

/**
 * Sipariş durumunu günceller.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Güncellenmiş sipariş bilgisi veya hata mesajı
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);
    const id = BigInt(req.params.id);
    const { status } = req.body;

    // Önce siparişi bul
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    // Sadece kendi siparişlerini güncelleyebilir
    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Bu siparişi güncelleme izniniz yok" });
    }

    // Geçerli bir durum değeri olmalı
    const validStatuses = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
      "COMPLETED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Geçersiz sipariş durumu. Geçerli değerler: " +
          validStatuses.join(", "),
      });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return res.status(200).json(normalizeOrder(updatedOrder));
  } catch (error) {
    next(error);
  }
};

/**
 * Ödeme durumunu günceller.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Güncellenmiş sipariş bilgisi veya hata mesajı
 */
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);
    const id = BigInt(req.params.id);
    const { paymentStatus, paymentType } = req.body;

    // Önce siparişi bul
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    // Sadece kendi siparişlerini güncelleyebilir
    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Bu siparişi güncelleme izniniz yok" });
    }

    // Ödeme tipi için kontrol
    if (paymentType) {
      const validPaymentTypes = [
        "CASH",
        "CREDIT_CARD",
        "BANK_TRANSFER",
        "OTHER",
      ];
      if (!validPaymentTypes.includes(paymentType)) {
        return res.status(400).json({
          message:
            "Geçersiz ödeme tipi. Geçerli değerler: " +
            validPaymentTypes.join(", "),
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id,
      },
      data: {
        paymentStatus:
          paymentStatus !== undefined ? paymentStatus : order.paymentStatus,
        paymentType: paymentType || undefined,
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return res.status(200).json(normalizeOrder(updatedOrder));
  } catch (error) {
    next(error);
  }
};

/**
 * Kargo bilgilerini günceller.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Güncellenmiş sipariş bilgisi veya hata mesajı
 */
export const updateShippingInfo = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);
    const id = BigInt(req.params.id);
    const { shippingAddress, trackingNumber, carrierName } = req.body;

    // Önce siparişi bul
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    // Sadece kendi siparişlerini güncelleyebilir
    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Bu siparişi güncelleme izniniz yok" });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id,
      },
      data: {
        shippingAddress:
          shippingAddress !== undefined
            ? shippingAddress
            : order.shippingAddress,
        trackingNumber:
          trackingNumber !== undefined ? trackingNumber : order.trackingNumber,
        carrierName:
          carrierName !== undefined ? carrierName : order.carrierName,
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return res.status(200).json(normalizeOrder(updatedOrder));
  } catch (error) {
    next(error);
  }
};

/**
 * Siparişi iptal eder.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Güncellenmiş sipariş bilgisi veya hata mesajı
 */
export const cancelOrder = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);
    const id = BigInt(req.params.id);

    // Önce siparişi bul
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    // Sadece kendi siparişlerini iptal edebilir
    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Bu siparişi iptal etme izniniz yok" });
    }

    // Tamamlanmış siparişler iptal edilemez
    if (order.status === "DELIVERED" || order.status === "COMPLETED") {
      return res
        .status(400)
        .json({ message: "Tamamlanmış siparişler iptal edilemez" });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: "CANCELLED",
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return res.status(200).json(normalizeOrder(updatedOrder));
  } catch (error) {
    next(error);
  }
};

/**
 * Siparişlerin durumunu toplu olarak günceller.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Güncellenmiş siparişler veya hata mesajı
 */
export const bulkUpdateOrderStatus = async (req, res, next) => {
  try {
    const userId = BigInt(req.userId);
    const { ids, status } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Sipariş ID'leri belirtilmelidir" });
    }

    if (!status) {
      return res.status(400).json({ message: "Durum belirtilmelidir" });
    }

    // Durum için geçerlilik kontrolü
    const validStatuses = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
      "COMPLETED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Geçersiz durum. Geçerli değerler: " + validStatuses.join(", "),
      });
    }

    // BigInt ID'lere dönüştürme
    const orderIds = ids.map((id) => BigInt(id));

    // Kullanıcının bu siparişlere erişim yetkisi olup olmadığını kontrol et
    const userOrders = await prisma.order.findMany({
      where: {
        id: { in: orderIds },
        userId,
      },
      select: { id: true },
    });

    if (userOrders.length !== orderIds.length) {
      return res.status(403).json({
        message: "Bir veya daha fazla siparişe erişim izniniz yok",
      });
    }

    // Siparişlerin durumlarını toplu olarak güncelle
    const updatedOrders = await prisma.$transaction(
      orderIds.map((id) =>
        prisma.order.update({
          where: { id },
          data: { status },
          include: {
            customer: true,
            items: true,
          },
        })
      )
    );

    return res.status(200).json(updatedOrders.map(normalizeOrder));
  } catch (error) {
    next(error);
  }
};
