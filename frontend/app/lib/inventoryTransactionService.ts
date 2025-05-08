import api from "@/app/lib/api";
import { InventoryTransactionType, TransactionTypeEnum } from "@/types/schema";

export const getInventoryTransactionsByProduct = async (
  token: string,
  productId: string
): Promise<InventoryTransactionType[]> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.get<InventoryTransactionType[]>(
      `/inventory/${productId}/transactions`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Ürün işlemleri alınırken hata:", error);
    return [];
  }
};

interface TransactionOptions {
  reference?: string;
  transactionDate?: Date;
  reason?: string;
  isReturned?: boolean;
}

// Stok ekleme
export const addInventoryStock = async (
  token: string,
  productId: string,
  quantity: number, 
  warehouseId: string,
  notes?: string,
  options?: TransactionOptions
): Promise<InventoryTransactionType> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.post<InventoryTransactionType>(
    `/inventory`,
    {
      productId,
      quantity,
      warehouseId,
      type: TransactionTypeEnum.IN,
      notes: notes || "",
      reference: options?.reference || "",
      transactionDate: options?.transactionDate || new Date(),
      reason: options?.reason || "",
      isReturned: options?.isReturned || false,
    },
    { headers }
  );
  return response.data;
};

// Stok çıkarma
export const removeInventoryStock = async (
  token: string,
  productId: string,
  quantity: number,
  warehouseId: string,
  notes?: string,
  options?: TransactionOptions
): Promise<InventoryTransactionType> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.post<InventoryTransactionType>(
    `/inventory`,
    {
      productId,
      quantity,
      warehouseId,
      type: TransactionTypeEnum.OUT,
      notes: notes || "",
      reference: options?.reference || "",
      transactionDate: options?.transactionDate || new Date(),
      reason: options?.reason || "",
      isReturned: options?.isReturned || false,
    },
    { headers }
  );
  return response.data;
};

// Stok transferi
export const transferInventoryStock = async (
  token: string,
  productId: string,
  quantity: number,
  sourceWarehouseId: string,
  targetWarehouseId: string,
  notes?: string,
  options?: TransactionOptions
): Promise<InventoryTransactionType> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.post<InventoryTransactionType>(
    `/inventory/transfer`,
    {
      productId,
      quantity,
      sourceWarehouseId,
      targetWarehouseId,
      notes: notes || "",
      reference: options?.reference || "",
      transactionDate: options?.transactionDate || new Date(),
      reason: options?.reason || "transfer",
      isReturned: options?.isReturned || false,
    },
    { headers }
  );
  return response.data;
};

// Stok geçmişi getirme
export const getInventoryTransactionHistory = async (
  token: string,
  productId: string,
  warehouseId?: string,
  startDate?: Date,
  endDate?: Date,
  limit?: number,
  offset?: number
): Promise<InventoryTransactionType[]> => {
  let url = `/inventory?productId=${productId}`;
  
  if (warehouseId) url += `&warehouseId=${warehouseId}`;
  if (startDate) url += `&startDate=${startDate.toISOString()}`;
  if (endDate) url += `&endDate=${endDate.toISOString()}`;
  if (limit) url += `&limit=${limit}`;
  if (offset) url += `&offset=${offset}`;

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get<InventoryTransactionType[]>(url, { headers });
  return response.data;
};
