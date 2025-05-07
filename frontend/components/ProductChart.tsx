"use client";
import * as React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { InventoryTransactionType } from "@/app/lib/inventoryTransactionService";

interface ProductChartProps {
  transactions: InventoryTransactionType[];
}

export function ProductChart({ transactions }: ProductChartProps) {
  // Sort by date and compute cumulative stock
  const sorted = React.useMemo(
    () =>
      [...transactions].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [transactions]
  );

  const data = React.useMemo(() => {
    const map: { date: string; stock: number }[] = [];
    let cum = 0;
    sorted.forEach((tx) => {
      const date = new Date(tx.createdAt).toLocaleDateString();
      const delta = tx.type === "IN" ? tx.quantity : -tx.quantity;
      cum += delta;
      map.push({ date, stock: cum });
    });
    return map;
  }, [sorted]);

  if (transactions.length === 0) return <div>Veri bulunamadı.</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="stock" stroke="#4f46e5" />
      </LineChart>
    </ResponsiveContainer>
  );
}
