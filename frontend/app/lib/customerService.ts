import api from "@/app/lib/api";
import { CustomerType } from "@/types/schema";

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
export const getCustomerOrders = async (id: string): Promise<any[]> => {
  const response = await api.get<any[]>(`/customers/${id}/orders`);
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