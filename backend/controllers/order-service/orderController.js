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
  logs: order.logs ? order.logs.map(normalizeOrderLog) : undefined,
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
 * Sipariş log kayıtlarını normalize eder.
 * @param {object} log - Normalize edilecek log kaydı
 * @returns {object} - Normalize edilmiş log kaydı
 */
const normalizeOrderLog = (log) => ({
  ...log,
  id: log.id.toString(),
  orderId: log.orderId.toString(),
  userId: log.userId.toString(),
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
 * Sipariş için log kaydı oluşturur.
 * @param {PrismaClient} tx - Prisma transaction client
 * @param {object} logData - Log verileri
 * @param {BigInt} logData.orderId - Sipariş ID
 * @param {BigInt} logData.userId - Kullanıcı ID
 * @param {string} logData.message - Log mesajı
 * @param {string} [logData.status] - Sipariş durumu (opsiyonel)
 * @param {string} [logData.details] - Detaylar (opsiyonel)
 * @returns {Promise<object>} - Oluşturulan log kaydı
 */
const createOrderLog = async (
  tx,
  { orderId, userId, message, status, details }
) => {
  return await tx.orderLog.create({
    data: {
      orderId,
      userId,
      message,
      status,
      details: details ? JSON.stringify(details) : null,
    },
  });
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

      // Sipariş oluşturuldu log kaydı ekle
      await createOrderLog(tx, {
        orderId: order.id,
        userId,
        message: "Sipariş oluşturuldu",
        status: order.status,
        details: {
          orderNumber,
          totalAmount,
          itemCount: orderItems.length,
        },
      });

      // Sipariş nesnesini logları da içerecek şekilde yeniden al
      const orderWithLogs = await tx.order.findUnique({
        where: {
          id: order.id,
        },
        include: {
          items: true,
          logs: true,
        },
      });

      return normalizeOrder(orderWithLogs);
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
        logs: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
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
  const prismaTransaction = await prisma.$transaction(async (tx) => {
    try {
      const userId = BigInt(req.userId);
      const id = BigInt(req.params.id);
      const { status } = req.body;

      // Önce siparişi bul
      const order = await tx.order.findUnique({
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

      // Durumu güncelle
      const updatedOrder = await tx.order.update({
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

      // Log kaydı ekle
      await createOrderLog(tx, {
        orderId: id,
        userId,
        message: `Sipariş durumu "${status}" olarak güncellendi`,
        status,
        details: {
          previousStatus: order.status,
          newStatus: status,
        },
      });

      // Logları da içeren güncellenmiş siparişi getir
      const orderWithLogs = await tx.order.findUnique({
        where: { id },
        include: {
          customer: true,
          items: true,
          logs: {
            orderBy: {
              createdAt: "desc",
            },
            take: 10, // Son 10 log
          },
        },
      });

      return normalizeOrder(orderWithLogs);
    } catch (error) {
      throw error;
    }
  });

  try {
    return res.status(200).json(prismaTransaction);
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
  const prismaTransaction = await prisma.$transaction(async (tx) => {
    try {
      const userId = BigInt(req.userId);
      const id = BigInt(req.params.id);
      const { paymentStatus, paymentType } = req.body;

      // Önce siparişi bul
      const order = await tx.order.findUnique({
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

      // Güncelleme
      const updatedOrder = await tx.order.update({
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

      // Log kaydı ekle
      await createOrderLog(tx, {
        orderId: id,
        userId,
        message: paymentStatus
          ? `Ödeme alındı: ${
              paymentType || order.paymentType
            } ile ödeme tamamlandı`
          : `Ödeme durumu güncellendi: ${
              paymentStatus ? "Ödendi" : "Ödenmedi"
            }`,
        details: {
          previousPaymentStatus: order.paymentStatus,
          newPaymentStatus:
            paymentStatus !== undefined ? paymentStatus : order.paymentStatus,
          previousPaymentType: order.paymentType,
          newPaymentType: paymentType || order.paymentType,
        },
      });

      // Siparişi loglarla birlikte getir
      const orderWithLogs = await tx.order.findUnique({
        where: { id },
        include: {
          customer: true,
          items: true,
          logs: {
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          },
        },
      });

      return normalizeOrder(orderWithLogs);
    } catch (error) {
      throw error;
    }
  });

  try {
    return res.status(200).json(prismaTransaction);
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
  const prismaTransaction = await prisma.$transaction(async (tx) => {
    try {
      const userId = BigInt(req.userId);
      const id = BigInt(req.params.id);
      const { shippingAddress, trackingNumber, carrierName } = req.body;

      // Önce siparişi bul
      const order = await tx.order.findUnique({
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

      // Güncelleme
      const updatedOrder = await tx.order.update({
        where: {
          id,
        },
        data: {
          shippingAddress:
            shippingAddress !== undefined
              ? shippingAddress
              : order.shippingAddress,
          trackingNumber:
            trackingNumber !== undefined
              ? trackingNumber
              : order.trackingNumber,
          carrierName:
            carrierName !== undefined ? carrierName : order.carrierName,
        },
        include: {
          customer: true,
          items: true,
        },
      });

      // Log kaydı ekle
      await createOrderLog(tx, {
        orderId: id,
        userId,
        message: "Kargo bilgileri güncellendi",
        details: {
          shippingAddress: updatedOrder.shippingAddress,
          trackingNumber: updatedOrder.trackingNumber,
          carrierName: updatedOrder.carrierName,
        },
      });

      // Loglarla birlikte getir
      const orderWithLogs = await tx.order.findUnique({
        where: { id },
        include: {
          customer: true,
          items: true,
          logs: {
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          },
        },
      });

      return normalizeOrder(orderWithLogs);
    } catch (error) {
      throw error;
    }
  });

  try {
    return res.status(200).json(prismaTransaction);
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
  const prismaTransaction = await prisma.$transaction(async (tx) => {
    try {
      const userId = BigInt(req.userId);
      const id = BigInt(req.params.id);

      // Önce siparişi bul
      const order = await tx.order.findUnique({
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

      // Güncelleme
      const updatedOrder = await tx.order.update({
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

      // Log kaydı ekle
      await createOrderLog(tx, {
        orderId: id,
        userId,
        message: "Sipariş iptal edildi",
        status: "CANCELLED",
        details: {
          previousStatus: order.status,
        },
      });

      // Loglarla birlikte getir
      const orderWithLogs = await tx.order.findUnique({
        where: { id },
        include: {
          customer: true,
          items: true,
          logs: {
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          },
        },
      });

      return normalizeOrder(orderWithLogs);
    } catch (error) {
      throw error;
    }
  });

  try {
    return res.status(200).json(prismaTransaction);
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
  const prismaTransaction = await prisma.$transaction(async (tx) => {
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
      const userOrders = await tx.order.findMany({
        where: {
          id: { in: orderIds },
          userId,
        },
        select: { id: true, status: true },
      });

      if (userOrders.length !== orderIds.length) {
        return res.status(403).json({
          message: "Bir veya daha fazla siparişe erişim izniniz yok",
        });
      }

      // Siparişlerin durumlarını toplu olarak güncelle
      const updatedOrders = await Promise.all(
        orderIds.map(async (id) => {
          const originalOrder = userOrders.find((o) => o.id === id);

          const updatedOrder = await tx.order.update({
            where: { id },
            data: { status },
            include: {
              customer: true,
              items: true,
            },
          });

          // Her sipariş için log kaydı oluştur
          await createOrderLog(tx, {
            orderId: id,
            userId,
            message: `Sipariş durumu toplu güncelleme ile "${status}" olarak değiştirildi`,
            status,
            details: {
              previousStatus: originalOrder?.status,
              newStatus: status,
              bulkUpdate: true,
            },
          });

          return updatedOrder;
        })
      );

      // Logları da içeren siparişleri getir
      const ordersWithLogs = await tx.order.findMany({
        where: {
          id: { in: orderIds },
        },
        include: {
          customer: true,
          items: true,
          logs: {
            orderBy: {
              createdAt: "desc",
            },
            take: 5, // Her sipariş için son 5 log
          },
        },
      });

      return ordersWithLogs.map(normalizeOrder);
    } catch (error) {
      throw error;
    }
  });

  try {
    return res.status(200).json(prismaTransaction);
  } catch (error) {
    next(error);
  }
};

/**
 * Siparişi günceller.
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @param {NextFunction} next - Express next middleware fonksiyonu
 * @returns {Promise<Response>} - Güncellenmiş sipariş bilgisi veya hata mesajı
 */
export const updateOrder = async (req, res, next) => {
  const prismaTransaction = await prisma.$transaction(async (tx) => {
    try {
      const userId = BigInt(req.userId);
      const id = BigInt(req.params.id);

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
        status,
      } = req.body;

      // Önce siparişi bul
      const order = await tx.order.findUnique({
        where: {
          id,
        },
        include: {
          items: true,
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

      // Müşteriyi kontrol et
      if (customerId) {
        const customer = await tx.customer.findUnique({
          where: { id: BigInt(customerId) },
        });

        if (!customer) {
          return res.status(404).json({ message: "Müşteri bulunamadı" });
        }

        if (customer.userId !== userId) {
          return res
            .status(403)
            .json({ message: "Bu müşteri için sipariş güncelleyemezsiniz" });
        }
      }

      // Sipariş statüsü için kontrol
      if (status) {
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

      // Siparişi güncelle
      let updateData = {
        paymentType: paymentType || undefined,
        paymentStatus:
          paymentStatus !== undefined ? paymentStatus : order.paymentStatus,
        shippingFee:
          shippingFee !== undefined
            ? parseFloat(shippingFee)
            : order.shippingFee,
        tax: tax !== undefined ? parseFloat(tax) : order.tax,
        discount:
          discount !== undefined ? parseFloat(discount) : order.discount,
        notes: notes !== undefined ? notes : order.notes,
        shippingAddress:
          shippingAddress !== undefined
            ? shippingAddress
            : order.shippingAddress,
        trackingNumber:
          trackingNumber !== undefined ? trackingNumber : order.trackingNumber,
        carrierName:
          carrierName !== undefined ? carrierName : order.carrierName,
        status: status || undefined,
      };

      if (customerId) {
        updateData.customerId = BigInt(customerId);
      }

      // Toplam tutarı hesapla (eğer sipariş kalemleri değişmediyse)
      let totalAmount = order.totalAmount;

      // Sipariş kalemleri güncelleme
      if (items && Array.isArray(items) && items.length > 0) {
        // Mevcut sipariş kalemlerini sil
        await tx.orderItem.deleteMany({
          where: {
            orderId: id,
          },
        });

        // Yeni sipariş kalemleri oluştur
        const orderItems = [];
        totalAmount = 0; // Yeniden hesapla

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
            orderId: id,
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
        if (updateData.shippingFee) totalAmount += updateData.shippingFee;
        if (updateData.tax) totalAmount += updateData.tax;
        if (updateData.discount) totalAmount -= updateData.discount;

        // Oluşturulan sipariş kalemlerini veritabanına ekle
        await tx.orderItem.createMany({
          data: orderItems,
        });
      } else {
        // Eğer sipariş kalemleri güncellenmediyse, toplam tutarı mevcut kalemlerden hesapla
        // Şeffaf hesaplama için mevcut ürün kalemlerinin toplamını yeniden hesapla
        const orderItems = await tx.orderItem.findMany({
          where: {
            orderId: id,
          },
        });

        totalAmount = orderItems.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );

        // Toplam tutara kargo ücreti ekle, vergi ve indirim uygula
        if (updateData.shippingFee) totalAmount += updateData.shippingFee;
        if (updateData.tax) totalAmount += updateData.tax;
        if (updateData.discount) totalAmount -= updateData.discount;
      }

      // Toplam tutarı güncelle
      updateData.totalAmount = totalAmount;

      // Siparişi güncelle
      const updatedOrder = await tx.order.update({
        where: {
          id,
        },
        data: updateData,
        include: {
          customer: true,
          items: true,
        },
      });

      return normalizeOrder(updatedOrder);
    } catch (error) {
      // Transaction içinde hata olursa error throw et
      throw error;
    }
  });

  try {
    return res.status(200).json(prismaTransaction);
  } catch (error) {
    next(error);
  }
};
