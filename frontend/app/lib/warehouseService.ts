import api from "@/app/lib/api";
import { WarehouseType, StockType, InventoryTransactionType } from "@/types/schema";
import { getCookie } from "cookies-next";

/**
 * Kullanıcıya ait tüm depoları getirir.
 * @returns {Promise<WarehouseType[]>} Depo listesi
 */
export const getWarehouses = async (): Promise<WarehouseType[]> => {
  try {
    // Cookie'den token alınması
    const token = getCookie("token")?.toString();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await api.get<WarehouseType[]>("/warehouses", { headers });
    return response.data;
  } catch (error) {
    console.error("Depolar alınırken hata:", error);
    return [];
  }
};

/**
 * ID'ye göre depo detaylarını getirir.
 * @param {string} id - Depo ID'si
 * @returns {Promise<WarehouseType>} Depo detayları
 */
export const getWarehouseById = async (id: string): Promise<WarehouseType | null> => {
  try {
    // Cookie'den token alınması
    const token = getCookie("token")?.toString();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await api.get<WarehouseType>(`/warehouses/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Depo ID ${id} alınırken hata:`, error);
    return null;
  }
};

/**
 * Yeni depo oluşturur.
 * @param {object} warehouse - Depo verileri
 * @returns {Promise<WarehouseType>} Oluşturulan depo
 */
export const createWarehouse = async (warehouse: {
  name: string;
  code?: string;
  address?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  managerName?: string;
  capacity?: string;
}): Promise<WarehouseType> => {
  // Cookie'den token alınması
  const token = getCookie("token")?.toString();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  // Capacity değerini sayıya çeviriyoruz
  const warehouseData = {
    ...warehouse,
    capacity: warehouse.capacity ? parseInt(warehouse.capacity) : undefined
  };
  
  const response = await api.post<WarehouseType>("/warehouses", warehouseData, { headers });
  return response.data;
};

/**
 * Depo bilgilerini günceller.
 * @param {string} id - Depo ID'si
 * @param {object} warehouse - Güncellenecek depo verileri
 * @returns {Promise<WarehouseType>} Güncellenmiş depo
 */
export const updateWarehouse = async (
  id: string,
  warehouse: {
    name?: string;
    code?: string;
    address?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    email?: string;
    managerName?: string;
    capacity?: string;
  }
): Promise<WarehouseType> => {
  // Cookie'den token alınması
  const token = getCookie("token")?.toString();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  // Capacity değerini sayıya çeviriyoruz
  const warehouseData = {
    ...warehouse,
    capacity: warehouse.capacity ? parseInt(warehouse.capacity) : undefined
  };
  
  const response = await api.put<WarehouseType>(`/warehouses/${id}`, warehouseData, { headers });
  return response.data;
};

/**
 * Depo siler.
 * @param {string} id - Depo ID'si
 * @returns {Promise<void>}
 */
export const deleteWarehouse = async (id: string): Promise<void> => {
  // Cookie'den token alınması
  const token = getCookie("token")?.toString();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  await api.delete(`/warehouses/${id}`, { headers });
};

/**
 * Bir depodaki tüm stokları getirir.
 * @param {string} warehouseId - Depo ID'si
 * @returns {Promise<StockType[]>} - Depoda bulunan stok listesi
 */
export const getWarehouseStocks = async (warehouseId: string): Promise<StockType[]> => {
  try {
    const response = await api.get<StockType[]>(`/warehouses/${warehouseId}/stocks`);
    return response.data;
  } catch (error) {
    console.error("Depodaki stokları getirme hatası:", error);
    throw error;
  }
};

/**
 * Bir depodaki son işlemleri getirir.
 * @param {string} warehouseId - Depo ID'si
 * @returns {Promise<InventoryTransactionType[]>} - Depodaki son işlemler listesi
 */
export const getWarehouseTransactions = async (warehouseId: string): Promise<InventoryTransactionType[]> => {
  try {
    const response = await api.get<InventoryTransactionType[]>(
      `/warehouses/${warehouseId}/transactions`
    );
    return response.data;
  } catch (error) {
    console.error("Depodaki işlemleri getirme hatası:", error);
    throw error;
  }
}; 