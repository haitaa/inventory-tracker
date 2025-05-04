import api from "@/app/lib/api";

enum TransactionType {
  IN = "IN",
  OUT = "OUT",
}

export interface InventoryTransactionType {
  id: string;
  type: TransactionType;
  quantity: number;
  productId: string;
  warehouseId: string;
  userId: string;
  createdAt: string;
}

export const getInventoryTransactionsByProduct = async (
  token: string,
  productId: string,
): Promise<InventoryTransactionType[]> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get<InventoryTransactionType[]>(
    `/inventory/${productId}/transactions`,
    { headers },
  );
  return response.data;
};
