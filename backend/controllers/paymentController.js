import { PrismaClient } from "@prisma/client";
import { generateTransactionId } from "../utils/helpers.js";
const prisma = new PrismaClient();

/**
 * Ödeme yöntemlerini listeler
 * @route GET /api/payments/methods
 * @access Özel
 */
export const getPaymentMethods = async (req, res) => {
  try {
    // Gerçek uygulamada bu veriler veritabanından gelebilir
    const paymentMethods = [
      {
        id: "credit_card",
        name: "Kredi Kartı",
        description: "Kredi kartı ile ödeme yapın",
        active: true,
        icon: "credit-card",
      },
      {
        id: "bank_transfer",
        name: "Banka Havalesi",
        description: "Banka havalesi ile ödeme yapın",
        active: true,
        icon: "bank",
      },
      {
        id: "paypal",
        name: "PayPal",
        description: "PayPal ile ödeme yapın",
        active: true,
        icon: "paypal",
      },
      {
        id: "pos",
        name: "POS Cihazı",
        description: "Şubede POS ile ödeme yapın",
        active: true,
        icon: "credit-card-pos",
      },
    ];

    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error("Ödeme yöntemleri alınırken hata:", error);
    res.status(500).json({ message: "Ödeme yöntemleri alınamadı" });
  }
};

/**
 * Ödeme işlemini gerçekleştirir
 * @route POST /api/payments/process
 * @access Özel
 */
export const processPayment = async (req, res) => {
  try {
    const {
      orderId,
      amount,
      paymentMethodId,
      currency,
      creditCardInfo,
      returnUrl,
    } = req.body;

    // Sipariş kontrolü
    const order = await prisma.order.findUnique({
      where: { id: BigInt(orderId) },
    });

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    // Ödeme kaydı oluştur
    const payment = await prisma.payment.create({
      data: {
        orderId: BigInt(orderId),
        amount: amount,
        currency: currency || "TRY",
        paymentMethod: paymentMethodId,
        transactionId: generateTransactionId(),
        transactionDate: new Date(),
        status: "PENDING",
      },
    });

    // Farklı ödeme yöntemlerine göre işlemler
    let responseData = {};
    let paymentStatus = "PENDING";

    switch (paymentMethodId) {
      case "credit_card":
        // Kredi kartı ile ödeme simülasyonu
        // Gerçek uygulamada burada ödeme sağlayıcısına istek atılır
        if (creditCardInfo) {
          // Başarılı ödeme simülasyonu
          paymentStatus = "COMPLETED";
          responseData = {
            receiptUrl: `https://yourapp.com/receipts/${payment.id}`,
          };
        } else {
          throw new Error("Kredi kartı bilgileri eksik");
        }
        break;

      case "bank_transfer":
        // Banka havalesi için ödeme bilgileri
        responseData = {
          accountInfo: {
            bankName: "XYZ Bank",
            accountName: "Şirket Adı",
            iban: "TR123456789012345678901234",
            reference: `SIPARIS-${order.orderNumber}`,
          },
        };
        break;

      case "paypal":
      case "online_payment":
        // Online ödeme için yönlendirme
        if (returnUrl) {
          responseData = {
            paymentUrl: `https://payment-provider.com/pay?order=${orderId}&amount=${amount}&return=${returnUrl}`,
          };
        } else {
          throw new Error("Dönüş URL'i eksik");
        }
        break;

      case "pos":
        // POS ödemesi için beklemede
        responseData = {
          posInfo: {
            referenceCode: payment.transactionId,
            instructions: "Lütfen bu referans kodu ile mağazamıza gelin.",
          },
        };
        break;

      default:
        throw new Error("Geçersiz ödeme yöntemi");
    }

    // Ödeme durumunu güncelle
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: paymentStatus },
    });

    // Başarılı ise sipariş durumunu güncelle
    if (paymentStatus === "COMPLETED") {
      await prisma.order.update({
        where: { id: BigInt(orderId) },
        data: {
          paymentStatus: true,
          status: "PAID",
        },
      });

      // Sipariş logu oluştur
      await prisma.orderLog.create({
        data: {
          orderId: BigInt(orderId),
          userId: BigInt(req.userId), // Kullanıcı ID'si
          status: "PAID",
          message: "Ödeme tamamlandı",
          details: JSON.stringify({
            paymentId: payment.id.toString(),
            transactionId: payment.transactionId,
            paymentMethod: paymentMethodId,
          }),
        },
      });
    }

    // Yanıt gönder
    res.status(200).json({
      id: payment.id.toString(),
      status: paymentStatus.toLowerCase(),
      transactionId: payment.transactionId,
      transactionDate: payment.transactionDate,
      ...responseData,
    });
  } catch (error) {
    console.error("Ödeme işlemi başlatılırken hata:", error);
    res
      .status(500)
      .json({ message: error.message || "Ödeme işlemi başlatılamadı" });
  }
};

/**
 * Ödeme durumunu kontrol eder
 * @route GET /api/payments/status/:id
 * @access Özel
 */
export const checkPaymentStatus = async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: BigInt(req.params.id) },
    });

    if (!payment) {
      return res.status(404).json({ message: "Ödeme bulunamadı" });
    }

    // Yanıt gönder
    res.status(200).json({
      id: payment.id.toString(),
      status: payment.status.toLowerCase(),
      transactionId: payment.transactionId,
      transactionDate: payment.transactionDate,
      receiptUrl:
        payment.status === "COMPLETED"
          ? `https://yourapp.com/receipts/${payment.id}`
          : undefined,
      errorMessage: payment.errorMessage,
    });
  } catch (error) {
    console.error("Ödeme durumu alınırken hata:", error);
    res.status(500).json({ message: "Ödeme durumu alınamadı" });
  }
};

/**
 * Ödemeyi iptal eder
 * @route POST /api/payments/cancel/:id
 * @access Özel
 */
export const cancelPayment = async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: BigInt(req.params.id) },
    });

    if (!payment) {
      return res.status(404).json({ message: "Ödeme bulunamadı" });
    }

    // Sadece bekleyen ödemeler iptal edilebilir
    if (payment.status !== "PENDING") {
      return res.status(400).json({ message: "Bu ödeme iptal edilemez" });
    }

    // Ödemeyi iptal et
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "CANCELLED",
        errorMessage: "Kullanıcı tarafından iptal edildi",
      },
    });

    // Sipariş logu oluştur
    await prisma.orderLog.create({
      data: {
        orderId: payment.orderId,
        userId: BigInt(req.userId), // Kullanıcı ID'si
        message: "Ödeme iptal edildi",
        details: JSON.stringify({
          paymentId: payment.id.toString(),
          transactionId: payment.transactionId,
        }),
      },
    });

    res.status(200).json({ message: "Ödeme başarıyla iptal edildi" });
  } catch (error) {
    console.error("Ödeme iptal edilirken hata:", error);
    res.status(500).json({ message: "Ödeme iptal edilemedi" });
  }
};
