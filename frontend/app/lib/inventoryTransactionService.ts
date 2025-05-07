import api from "@/app/lib/api";
import { InventoryTransactionType, TransactionTypeEnum } from "@/types/schema";

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
