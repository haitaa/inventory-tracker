import { toast } from "react-hot-toast";

export interface PaymentMethod {
  id: string;
  name: string;
  type: "credit_card" | "bank_transfer" | "online_payment" | "pos" | "other";
  isActive: boolean;
  icon?: string;
  description?: string;
  config?: Record<string, any>;
}

export interface CreditCardInfo {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface BankTransferInfo {
  bankName: string;
  accountName: string;
  iban: string;
  referenceCode?: string;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethodId: string;
  currency: string;
  creditCardInfo?: CreditCardInfo;
  bankTransferInfo?: BankTransferInfo;
  returnUrl?: string;
  description?: string;
}

export interface PaymentResponse {
  id: string;
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  transactionDate: string;
  paymentUrl?: string; // For redirect to external payment provider
  receiptUrl?: string;
  errorMessage?: string;
}

// API'nin baseUrl'ini alır
const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
};

// Tüm ödeme yöntemlerini getirir
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${getApiBaseUrl()}/payments/methods`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ödeme yöntemleri alınamadı");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Ödeme yöntemleri alınırken hata:", error);
    throw error;
  }
};

// Yeni ödeme işlemi başlatır
export const initiatePayment = async (
  paymentData: PaymentRequest
): Promise<PaymentResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${getApiBaseUrl()}/payments/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ödeme işlemi başlatılamadı");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Ödeme işlemi başlatılırken hata:", error);
    throw error;
  }
};

// Kredi kartı işlemi
export const processCreditCardPayment = async (
  orderId: string,
  amount: number,
  creditCardInfo: CreditCardInfo
): Promise<PaymentResponse> => {
  try {
    const paymentRequest: PaymentRequest = {
      orderId,
      amount,
      paymentMethodId: "credit_card",
      currency: "TRY",
      creditCardInfo,
    };

    return await initiatePayment(paymentRequest);
  } catch (error: any) {
    toast.error("Kredi kartı işlemi başarısız: " + error.message);
    throw error;
  }
};

// Banka havalesi işlemi
export const processBankTransfer = async (
  orderId: string,
  amount: number,
  bankTransferInfo: BankTransferInfo
): Promise<PaymentResponse> => {
  try {
    const paymentRequest: PaymentRequest = {
      orderId,
      amount,
      paymentMethodId: "bank_transfer",
      currency: "TRY",
      bankTransferInfo,
    };

    return await initiatePayment(paymentRequest);
  } catch (error: any) {
    toast.error("Banka havalesi işlemi başarısız: " + error.message);
    throw error;
  }
};

// Online ödeme işlemi (PayPal, vb.)
export const processOnlinePayment = async (
  orderId: string,
  amount: number,
  paymentMethodId: string,
  returnUrl: string
): Promise<PaymentResponse> => {
  try {
    const paymentRequest: PaymentRequest = {
      orderId,
      amount,
      paymentMethodId,
      currency: "TRY",
      returnUrl,
    };

    return await initiatePayment(paymentRequest);
  } catch (error: any) {
    toast.error("Online ödeme işlemi başarısız: " + error.message);
    throw error;
  }
};

// POS işlemi
export const processPosPayment = async (
  orderId: string,
  amount: number,
  posId: string
): Promise<PaymentResponse> => {
  try {
    const paymentRequest: PaymentRequest = {
      orderId,
      amount,
      paymentMethodId: posId,
      currency: "TRY",
      description: "POS ile ödeme",
    };

    return await initiatePayment(paymentRequest);
  } catch (error: any) {
    toast.error("POS işlemi başarısız: " + error.message);
    throw error;
  }
};

// Ödeme durumunu kontrol eder
export const checkPaymentStatus = async (
  paymentId: string
): Promise<PaymentResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${getApiBaseUrl()}/payments/status/${paymentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ödeme durumu alınamadı");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Ödeme durumu alınırken hata:", error);
    throw error;
  }
};

// Ödemeyi iptal eder
export const cancelPayment = async (paymentId: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${getApiBaseUrl()}/payments/cancel/${paymentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ödeme iptal edilemedi");
    }

    toast.success("Ödeme başarıyla iptal edildi");
  } catch (error: any) {
    console.error("Ödeme iptal edilirken hata:", error);
    toast.error("Ödeme iptal edilemedi: " + error.message);
    throw error;
  }
};

// Ödeme iade işlemi
export const refundPayment = async (
  paymentId: string,
  amount?: number
): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${getApiBaseUrl()}/payments/refund/${paymentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ödeme iade edilemedi");
    }

    toast.success("Ödeme başarıyla iade edildi");
  } catch (error: any) {
    console.error("Ödeme iade edilirken hata:", error);
    toast.error("Ödeme iade edilemedi: " + error.message);
    throw error;
  }
};

// Makbuz oluştur ve indir
export const downloadReceipt = async (paymentId: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${getApiBaseUrl()}/payments/receipt/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Makbuz indirilemedi");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `makbuz-${paymentId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Makbuz indirilirken hata:", error);
    toast.error("Makbuz indirilemedi: " + error.message);
    throw error;
  }
}; 