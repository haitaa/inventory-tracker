"use client";

import { useEffect, useState } from "react";
import {
  getInventoryTransactionsByProduct,
  InventoryTransactionType,
} from "@/app/lib/inventoryTransactionService";

interface InventoryTransactionsProps {
  productId: string;
}

export default function InventoryTransactions({
  productId,
}: InventoryTransactionsProps) {
  const [transactions, setTransactions] = useState<InventoryTransactionType[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? (localStorage.getItem("token") ?? "")
        : "";

    getInventoryTransactionsByProduct(token, productId)
      .then((data) => {
        setTransactions(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <div>Yükleniyor…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (transactions.length === 0) return <div>İşlem bulunamadı.</div>;

  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Tür</th>
          <th className="px-4 py-2">Miktar</th>
          <th className="px-4 py-2">Depo ID</th>
          <th className="px-4 py-2">Kullanıcı ID</th>
          <th className="px-4 py-2">Tarih</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx.id}>
            <td className="border px-4 py-2">{tx.id}</td>
            <td className="border px-4 py-2">{tx.type}</td>
            <td className="border px-4 py-2">{tx.quantity}</td>
            <td className="border px-4 py-2">{tx.warehouseId}</td>
            <td className="border px-4 py-2">{tx.userId}</td>
            <td className="border px-4 py-2">
              {new Date(tx.createdAt).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
