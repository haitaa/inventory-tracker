"use client";
import * as React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  ReferenceLine,
} from "recharts";
import { InventoryTransactionType } from "@/types/schema";
import { format, isAfter, subMonths, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

interface ProductChartProps {
  transactions: InventoryTransactionType[];
  minStockLevel?: number;
}

export function ProductChart({
  transactions,
  minStockLevel,
}: ProductChartProps) {
  const [timeRange, setTimeRange] = React.useState<"30" | "90" | "180" | "all">(
    "90"
  );

  // Verileri hazırlama fonksiyonu
  const prepareData = React.useCallback(
    (days: number | "all") => {
      // Tarih filtrelemesi
      let filteredTx = [...transactions];
      if (days !== "all") {
        const startDate = subMonths(new Date(), days / 30);
        filteredTx = transactions.filter((tx) =>
          tx.createdAt ? isAfter(parseISO(tx.createdAt), startDate) : false
        );
      }

      // Tarihe göre sıralama
      const sorted = filteredTx.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });

      // Günlere göre veriler
      const dailyData = new Map<
        string,
        {
          date: string;
          formattedDate: string;
          stock: number;
          in: number;
          out: number;
          transactions: number;
        }
      >();

      // Kümülatif stok ve günlük hareketler
      let cumulativeStock = 0;

      sorted.forEach((tx) => {
        if (!tx.createdAt) return; // createdAt yoksa bu işlemi atla

        const txDate = new Date(tx.createdAt);
        const dateStr = format(txDate, "yyyy-MM-dd");
        const formattedDate = format(txDate, "d MMM", { locale: tr });

        if (!dailyData.has(dateStr)) {
          dailyData.set(dateStr, {
            date: dateStr,
            formattedDate,
            stock: cumulativeStock,
            in: 0,
            out: 0,
            transactions: 0,
          });
        }

        const entry = dailyData.get(dateStr);
        if (entry) {
          const delta = tx.type === "IN" ? tx.quantity : -tx.quantity;
          cumulativeStock += delta;

          if (tx.type === "IN") {
            entry.in += tx.quantity;
          } else {
            entry.out += tx.quantity;
          }

          entry.transactions += 1;
          entry.stock = cumulativeStock;
          dailyData.set(dateStr, entry);
        }
      });

      // Map'i diziye dönüştürme
      return Array.from(dailyData.values());
    },
    [transactions]
  );

  // Mevcut zaman aralığına göre verileri hesaplama
  const data = React.useMemo(() => {
    const days = timeRange === "all" ? "all" : parseInt(timeRange);
    return prepareData(days);
  }, [prepareData, timeRange, transactions]);

  // Boş veri kontrolü
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6">
        <div className="text-muted-foreground text-center">
          <p className="mb-2">Bu ürüne ait stok hareketi bulunmuyor.</p>
          <p className="text-sm">
            Stok giriş veya çıkışı yapıldığında burada grafik olarak
            görüntülenecektir.
          </p>
        </div>
      </div>
    );
  }

  // Maksimum stok değeri için renk belirle
  const getMaxStockColor = () => {
    const maxStock = Math.max(...data.map((d) => d.stock));
    if (maxStock === 0) return "#f43f5e"; // Kırmızı - stok yok
    if (maxStock < 5) return "#f59e0b"; // Turuncu - düşük stok
    return "#10b981"; // Yeşil - yeterli stok
  };

  return (
    <div className="space-y-4">
      {/* Zaman aralığı seçici */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium text-muted-foreground">
          {timeRange === "all" ? "Tüm zamanlar" : `Son ${timeRange} gün`}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setTimeRange("30")}
            className={`px-2 py-1 text-xs rounded ${
              timeRange === "30"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            30 Gün
          </button>
          <button
            onClick={() => setTimeRange("90")}
            className={`px-2 py-1 text-xs rounded ${
              timeRange === "90"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            90 Gün
          </button>
          <button
            onClick={() => setTimeRange("180")}
            className={`px-2 py-1 text-xs rounded ${
              timeRange === "180"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            180 Gün
          </button>
          <button
            onClick={() => setTimeRange("all")}
            className={`px-2 py-1 text-xs rounded ${
              timeRange === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Tümü
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              border: "none",
              fontSize: "13px",
            }}
            formatter={(value, name) => {
              if (name === "stock") return [`${value} adet`, "Toplam Stok"];
              if (name === "in") return [`${value} adet`, "Giriş"];
              if (name === "out") return [`${value} adet`, "Çıkış"];
              if (name === "transactions")
                return [`${value} işlem`, "İşlem Sayısı"];
              return [value, name];
            }}
            labelFormatter={(label) => `Tarih: ${label}`}
          />

          <Legend
            verticalAlign="top"
            height={36}
            iconSize={10}
            iconType="circle"
            formatter={(value) => {
              if (value === "stock") return "Toplam Stok";
              if (value === "in") return "Stok Girişi";
              if (value === "out") return "Stok Çıkışı";
              if (value === "transactions") return "İşlem Sayısı";
              return value;
            }}
          />

          {/* Minimum stok seviyesi için referans çizgisi */}
          {minStockLevel && (
            <ReferenceLine
              y={minStockLevel}
              yAxisId="left"
              label={{
                value: "Min. Stok",
                position: "insideTopLeft",
                fontSize: 12,
                fill: "#f59e0b",
              }}
              stroke="#f59e0b"
              strokeDasharray="3 3"
            />
          )}

          {/* Stok girişleri */}
          <Bar
            yAxisId="right"
            dataKey="in"
            fill="#4ade80"
            radius={[4, 4, 0, 0]}
            barSize={10}
            name="in"
          />

          {/* Stok çıkışları */}
          <Bar
            yAxisId="right"
            dataKey="out"
            fill="#f87171"
            radius={[4, 4, 0, 0]}
            barSize={10}
            name="out"
          />

          {/* Toplam stok çizgisi */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="stock"
            stroke={getMaxStockColor()}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 1 }}
            activeDot={{ r: 5, strokeWidth: 1 }}
            name="stock"
          />

          {/* İşlem sayısı çizgisi */}
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="transactions"
            fill="rgba(147, 51, 234, 0.1)"
            stroke="rgba(147, 51, 234, 0.7)"
            name="transactions"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Özet bilgiler */}
      {data.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md text-center">
            <div className="text-xs text-muted-foreground">Mevcut Stok</div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {data[data.length - 1].stock}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md text-center">
            <div className="text-xs text-muted-foreground">Toplam Giriş</div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {data.reduce((sum, item) => sum + item.in, 0)}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md text-center">
            <div className="text-xs text-muted-foreground">Toplam Çıkış</div>
            <div className="text-lg font-semibold text-red-600 dark:text-red-400">
              {data.reduce((sum, item) => sum + item.out, 0)}
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-md text-center">
            <div className="text-xs text-muted-foreground">Toplam İşlem</div>
            <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              {data.reduce((sum, item) => sum + item.transactions, 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
