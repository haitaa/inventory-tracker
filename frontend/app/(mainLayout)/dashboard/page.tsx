"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CreditCard,
  DollarSign,
  Package,
  Users,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { getProductStats } from "@/app/lib/productService";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Gerçek veriler için state tanımlaması
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 856,
    lowStockItems: 3,
    totalSales: 12400,
    salesChange: 12.3,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "Stok Girişi",
      product: "Vozol",
      quantity: 50,
      date: "10 Mayıs 2025",
    },
    {
      id: 2,
      type: "Stok Çıkışı",
      product: "Vape Pen",
      quantity: 5,
      date: "9 Mayıs 2025",
    },
    {
      id: 3,
      type: "Ürün Eklendi",
      product: "Novo 4",
      quantity: null,
      date: "8 Mayıs 2025",
    },
    {
      id: 4,
      type: "Stok Girişi",
      product: "E-Liquid",
      quantity: 20,
      date: "7 Mayıs 2025",
    },
    {
      id: 5,
      type: "Stok Çıkışı",
      product: "Mecha Mod",
      quantity: 2,
      date: "6 Mayıs 2025",
    },
  ]);

  const chartData = [
    { name: "Ocak", stok: 400, satış: 240 },
    { name: "Şubat", stok: 300, satış: 138 },
    { name: "Mart", stok: 200, satış: 980 },
    { name: "Nisan", stok: 278, satış: 390 },
    { name: "Mayıs", stok: 189, satış: 480 },
  ];

  const lowStockProducts = [
    { id: 1, name: "E-Liquid Menthol", sku: "EL-001", stock: 5, threshold: 10 },
    { id: 2, name: "Vape Coil V2", sku: "VC-034", stock: 8, threshold: 15 },
    { id: 3, name: "Mech Mod Pro", sku: "MM-102", stock: 2, threshold: 5 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Kullanıcı token'ını localStorage'dan al
        const token = localStorage.getItem("token");

        // Ürün istatistiklerini getir
        const productStats = await getProductStats(token || undefined);

        setStats((prevStats) => ({
          ...prevStats,
          totalProducts: productStats.totalProducts,
        }));

        setIsLoading(false);
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Kontrol Paneli</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push("/products")}>
            Ürünleri Yönet
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
          <TabsTrigger value="reports">Raporlar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Ürün
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Envanter yönetiminde kayıtlı tüm ürünler
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Stok
                </CardTitle>
                <Warehouse className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStock}</div>
                <p className="text-xs text-muted-foreground">
                  Tüm depolardaki toplam ürün adedi
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Düşük Stoklu Ürünler
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.lowStockItems}</div>
                <p className="text-xs text-muted-foreground">
                  Stok seviyesi kritik eşiğin altındaki ürünler
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Satış
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalSales.toLocaleString()} ₺
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">{stats.salesChange}%</span>
                  <span>geçen aya göre</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Stok ve Satış Verileri</CardTitle>
                <CardDescription>
                  Aylık stok ve satış verileriniz
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="stok" stroke="#8884d8" />
                    <Line type="monotone" dataKey="satış" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Düşük Stoklu Ürünler</CardTitle>
                <CardDescription>
                  Kritik stok seviyesindeki ürünler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            SKU: {product.sku}
                          </div>
                        </div>
                        <Badge
                          variant={
                            product.stock <= product.threshold / 2
                              ? "destructive"
                              : "default"
                          }
                        >
                          {product.stock} adet
                        </Badge>
                      </div>
                      <Progress
                        value={(product.stock / product.threshold) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">Tüm Stok Durumunu Görüntüle</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
              <CardDescription>
                Envanter sistemindeki son hareketler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center mb-4 last:mb-0"
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
                        activity.type.includes("Giriş")
                          ? "bg-green-100 text-green-700"
                          : activity.type.includes("Çıkış")
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {activity.type.includes("Giriş") && (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                      {activity.type.includes("Çıkış") && (
                        <ArrowUpRight className="h-5 w-5 rotate-180" />
                      )}
                      {activity.type.includes("Eklendi") && (
                        <Package className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.product}{" "}
                          {activity.quantity && `(${activity.quantity} adet)`}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity.date}
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/inventory">Tüm Aktiviteleri Görüntüle</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analitik</CardTitle>
              <CardDescription>
                Bu alanda detaylı analitik veriler görüntülenecek
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <BarChart3 className="h-24 w-24 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Raporlar</CardTitle>
              <CardDescription>
                Bu alanda çeşitli raporlar görüntülenecek
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <CreditCard className="h-24 w-24 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
