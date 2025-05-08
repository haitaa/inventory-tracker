import api from "@/app/lib/api";
import { CommunicationLogEntry, CustomerSegmentEnum, CustomerType, OrderType, RFMData } from "@/types/schema";

/**
 * Tüm müşterileri getirir.
 * @returns {Promise<CustomerType[]>} Müşteri listesi
 */
export const getCustomers = async (): Promise<CustomerType[]> => {
  const response = await api.get<CustomerType[]>("/customers");
  return response.data;
};

/**
 * ID'ye göre müşteri detaylarını getirir.
 * @param {string} id - Müşterinin ID'si
 * @returns {Promise<CustomerType>} Müşteri detayları
 */
export const getCustomerById = async (id: string): Promise<CustomerType> => {
  const response = await api.get<CustomerType>(`/customers/${id}`);
  return response.data;
};

/**
 * Yeni müşteri oluşturur.
 * @param {Omit<CustomerType, "id" | "userId">} customer - Oluşturulacak müşteri bilgileri
 * @returns {Promise<CustomerType>} Oluşturulan müşteri
 */
export const createCustomer = async (
  customer: Omit<CustomerType, "id" | "userId">
): Promise<CustomerType> => {
  const response = await api.post<CustomerType>("/customers", customer);
  return response.data;
};

/**
 * Müşteri bilgilerini günceller.
 * @param {string} id - Müşterinin ID'si 
 * @param {Partial<CustomerType>} customer - Güncellenecek müşteri bilgileri
 * @returns {Promise<CustomerType>} Güncellenmiş müşteri
 */
export const updateCustomer = async (
  id: string,
  customer: Partial<CustomerType>
): Promise<CustomerType> => {
  const response = await api.put<CustomerType>(`/customers/${id}`, customer);
  return response.data;
};

/**
 * Müşteriyi siler.
 * @param {string} id - Silinecek müşterinin ID'si
 * @returns {Promise<void>}
 */
export const deleteCustomer = async (id: string): Promise<void> => {
  await api.delete(`/customers/${id}`);
};

/**
 * Müşterinin siparişlerini getirir.
 * @param {string} id - Müşterinin ID'si
 * @returns {Promise<OrderType[]>} Müşterinin siparişleri
 */
export const getCustomerOrders = async (id: string): Promise<OrderType[]> => {
  const response = await api.get<OrderType[]>(`/customers/${id}/orders`);
  return response.data;
};

/**
 * Tam adı getirmek için yardımcı fonksiyon
 * @param {CustomerType} customer - Müşteri nesnesi
 * @returns {string} Müşterinin tam adı
 */
export const getFullName = (customer: CustomerType): string => {
  return `${customer.firstName} ${customer.lastName}`;
};

// CRM İşlevselliği

/**
 * Müşterinin RFM verilerini hesaplar
 * @param {string} customerId - Müşterinin ID'si
 * @returns {Promise<RFMData>} RFM verileri
 */
export const calculateCustomerRFM = async (customerId: string): Promise<RFMData> => {
  const response = await api.get<RFMData>(`/customers/${customerId}/rfm`);
  return response.data;
};

/**
 * Müşterinin segmentini günceller
 * @param {string} customerId - Müşterinin ID'si
 * @param {CustomerSegmentEnum} segment - Müşteri segmenti
 * @returns {Promise<CustomerType>} Güncellenmiş müşteri bilgisi
 */
export const updateCustomerSegment = async (
  customerId: string, 
  segment: CustomerSegmentEnum
): Promise<CustomerType> => {
  return updateCustomer(customerId, { segment });
};

/**
 * Tüm müşterilerin segmentlerini otomatik olarak hesaplar
 * @returns {Promise<void>}
 */
export const segmentAllCustomers = async (): Promise<void> => {
  await api.post('/customers/segment-all');
};

/**
 * Müşterinin iletişim kayıtlarını getirir
 * @param {string} customerId - Müşterinin ID'si
 * @returns {Promise<CommunicationLogEntry[]>} İletişim kayıtları
 */
export const getCustomerCommunicationLogs = async (
  customerId: string
): Promise<CommunicationLogEntry[]> => {
  const response = await api.get<CommunicationLogEntry[]>(`/customers/${customerId}/communication-logs`);
  return response.data;
};

/**
 * Müşteriye yeni bir iletişim kaydı ekler
 * @param {string} customerId - Müşterinin ID'si
 * @param {Omit<CommunicationLogEntry, "id" | "date">} log - İletişim kaydı
 * @returns {Promise<CommunicationLogEntry>} Eklenen iletişim kaydı
 */
export const addCustomerCommunicationLog = async (
  customerId: string,
  log: Omit<CommunicationLogEntry, "id" | "date">
): Promise<CommunicationLogEntry> => {
  const response = await api.post<CommunicationLogEntry>(
    `/customers/${customerId}/communication-logs`, 
    log
  );
  return response.data;
};

/**
 * Müşterinin yaşam boyu değerini hesaplar
 * @param {string} customerId - Müşterinin ID'si
 * @returns {Promise<number>} Yaşam boyu değer
 */
export const calculateCustomerLifetimeValue = async (
  customerId: string
): Promise<number> => {
  const response = await api.get<{ value: number }>(`/customers/${customerId}/lifetime-value`);
  return response.data.value;
};

/**
 * Segmentine göre müşterileri filtreler
 * @param {CustomerSegmentEnum} segment - Müşteri segmenti
 * @returns {Promise<CustomerType[]>} Filtrelenmiş müşteri listesi
 */
export const getCustomersBySegment = async (
  segment: CustomerSegmentEnum
): Promise<CustomerType[]> => {
  const response = await api.get<CustomerType[]>(`/customers/by-segment/${segment}`);
  return response.data;
};

/**
 * Müşterinin etiketlerini günceller
 * @param {string} customerId - Müşterinin ID'si
 * @param {string[]} tags - Etiketler
 * @returns {Promise<CustomerType>} Güncellenmiş müşteri
 */
export const updateCustomerTags = async (
  customerId: string,
  tags: string[]
): Promise<CustomerType> => {
  return updateCustomer(customerId, { tags });
}; 