import api from "@/app/lib/api";
import { OrderType, OrderStatusEnum, PaymentTypeEnum } from "@/types/schema";

/**
 * Tüm siparişleri getirir.
 * @returns {Promise<OrderType[]>} Sipariş listesi
 */
export const getOrders = async (): Promise<OrderType[]> => {
  const response = await api.get<OrderType[]>("/orders");
  return response.data;
};

/**
 * ID'ye göre sipariş detaylarını getirir.
 * @param {string} id - Siparişin ID'si
 * @returns {Promise<OrderType>} Sipariş detayları
 */
export const getOrderById = async (id: string): Promise<OrderType> => {
  const response = await api.get<OrderType>(`/orders/${id}`);
  return response.data;
};

/**
 * Sipariş kalemi için ürün özet bilgilerini hazırlar
 */
export interface OrderItemInput {
  productId: string;
  quantity: number;
  unitPrice?: number;
  discount?: number;
  taxRate?: number;
  notes?: string;
}

/**
 * Sipariş oluşturma için gerekli veriler
 */
export interface OrderInput {
  customerId: string;
  items: OrderItemInput[];
  paymentType?: PaymentTypeEnum;
  paymentStatus?: boolean;
  shippingFee?: number;
  tax?: number;
  discount?: number;
  notes?: string;
  shippingAddress?: string;
  trackingNumber?: string;
  carrierName?: string;
}

/**
 * Yeni sipariş oluşturur.
 * @param {OrderInput} order - Oluşturulacak sipariş bilgileri
 * @returns {Promise<OrderType>} Oluşturulan sipariş
 */
export const createOrder = async (order: OrderInput): Promise<OrderType> => {
  const response = await api.post<OrderType>("/orders", order);
  return response.data;
};

/**
 * Sipariş durumunu günceller.
 * @param {string} id - Siparişin ID'si
 * @param {OrderStatusEnum} status - Yeni sipariş durumu
 * @returns {Promise<OrderType>} Güncellenmiş sipariş
 */
export const updateOrderStatus = async (
  id: string,
  status: OrderStatusEnum
): Promise<OrderType> => {
  const response = await api.patch<OrderType>(`/orders/${id}/status`, { status });
  return response.data;
};

/**
 * Sipariş ödeme bilgilerini günceller.
 * @param {string} id - Siparişin ID'si
 * @param {boolean} paymentStatus - Ödeme durumu
 * @param {PaymentTypeEnum} paymentType - Ödeme tipi
 * @returns {Promise<OrderType>} Güncellenmiş sipariş
 */
export const updatePaymentStatus = async (
  id: string,
  paymentStatus: boolean,
  paymentType?: PaymentTypeEnum
): Promise<OrderType> => {
  const response = await api.patch<OrderType>(`/orders/${id}/payment`, { 
    paymentStatus, 
    paymentType 
  });
  return response.data;
};

/**
 * Sipariş kargo bilgilerini günceller.
 * @param {string} id - Siparişin ID'si
 * @param {object} shippingInfo - Kargo bilgileri
 * @returns {Promise<OrderType>} Güncellenmiş sipariş
 */
export const updateShippingInfo = async (
  id: string,
  shippingInfo: {
    shippingAddress?: string;
    trackingNumber?: string;
    carrierName?: string;
  }
): Promise<OrderType> => {
  const response = await api.patch<OrderType>(`/orders/${id}/shipping`, shippingInfo);
  return response.data;
};

/**
 * Siparişi iptal eder.
 * @param {string} id - Siparişin ID'si
 * @returns {Promise<OrderType>} İptal edilen sipariş
 */
export const cancelOrder = async (id: string): Promise<OrderType> => {
  const response = await api.post<OrderType>(`/orders/${id}/cancel`);
  return response.data;
};

/**
 * Sipariş durumu için Türkçe açıklama döndürür.
 * @param {OrderStatusEnum} status - Sipariş durumu
 * @returns {string} Türkçe açıklaması
 */
export const getOrderStatusLabel = (status: OrderStatusEnum): string => {
  const statusLabels = {
    [OrderStatusEnum.PENDING]: "Beklemede",
    [OrderStatusEnum.PROCESSING]: "İşleniyor",
    [OrderStatusEnum.SHIPPED]: "Kargoya Verildi",
    [OrderStatusEnum.DELIVERED]: "Teslim Edildi",
    [OrderStatusEnum.CANCELLED]: "İptal Edildi",
    [OrderStatusEnum.RETURNED]: "İade Edildi",
    [OrderStatusEnum.COMPLETED]: "Tamamlandı",
  };
  return statusLabels[status] || "Bilinmiyor";
};

/**
 * Sipariş durumu için renk kodu döndürür.
 * @param {OrderStatusEnum} status - Sipariş durumu
 * @returns {string} Renk sınıfı
 */
export const getOrderStatusColor = (status: OrderStatusEnum): string => {
  const statusColors = {
    [OrderStatusEnum.PENDING]: "bg-yellow-100 text-yellow-800",
    [OrderStatusEnum.PROCESSING]: "bg-blue-100 text-blue-800",
    [OrderStatusEnum.SHIPPED]: "bg-indigo-100 text-indigo-800",
    [OrderStatusEnum.DELIVERED]: "bg-green-100 text-green-800",
    [OrderStatusEnum.CANCELLED]: "bg-red-100 text-red-800",
    [OrderStatusEnum.RETURNED]: "bg-purple-100 text-purple-800",
    [OrderStatusEnum.COMPLETED]: "bg-green-100 text-green-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

/**
 * Ödeme tipi için Türkçe açıklama döndürür.
 * @param {PaymentTypeEnum} paymentType - Ödeme tipi
 * @returns {string} Türkçe açıklaması
 */
export const getPaymentTypeLabel = (paymentType: PaymentTypeEnum): string => {
  const paymentLabels = {
    [PaymentTypeEnum.CASH]: "Nakit",
    [PaymentTypeEnum.CREDIT_CARD]: "Kredi Kartı",
    [PaymentTypeEnum.BANK_TRANSFER]: "Banka Havalesi",
    [PaymentTypeEnum.OTHER]: "Diğer",
  };
  return paymentLabels[paymentType] || "Bilinmiyor";
}; 