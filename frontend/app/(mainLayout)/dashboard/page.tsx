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
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  CreditCard,
  DollarSign,
  Package,
  Users,
  Warehouse,
  TrendingUp,
  Calendar,
  Shield,
  Info,
  RefreshCcw,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import Link from "next/link";
import { getProductStats } from "@/app/lib/productService";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Gerçek veriler için state tanımlaması
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 856,
    lowStockItems: 3,
    totalSales: 12400,
    salesChange: 12.3,
    customerCount: 148,
    customerGrowth: 8.5,
    orderCount: 325,
    orderChange: -2.1,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "Stok Girişi",
      product: "Vozol",
      quantity: 50,
      date: "10 Mayıs 2025",
      time: "14:32",
    },
    {
      id: 2,
      type: "Stok Çıkışı",
      product: "Vape Pen",
      quantity: 5,
      date: "9 Mayıs 2025",
      time: "11:20",
    },
    {
      id: 3,
      type: "Ürün Eklendi",
      product: "Novo 4",
      quantity: null,
      date: "8 Mayıs 2025",
      time: "09:45",
    },
    {
      id: 4,
      type: "Stok Girişi",
      product: "E-Liquid",
      quantity: 20,
      date: "7 Mayıs 2025",
      time: "16:08",
    },
    {
      id: 5,
      type: "Stok Çıkışı",
      product: "Mecha Mod",
      quantity: 2,
      date: "6 Mayıs 2025",
      time: "10:15",
    },
  ]);

  const chartData = [
    { name: "Ocak", stok: 400, satış: 240, kar: 180 },
    { name: "Şubat", stok: 300, satış: 138, kar: 98 },
    { name: "Mart", stok: 200, satış: 980, kar: 420 },
    { name: "Nisan", stok: 278, satış: 390, kar: 250 },
    { name: "Mayıs", stok: 189, satış: 480, kar: 320 },
  ];

  const categoryData = [
    { name: "E-Liquid", value: 35 },
    { name: "Pod Sistemleri", value: 25 },
    { name: "Vape Cihazları", value: 20 },
    { name: "Atomizörler", value: 15 },
    { name: "Aksesuarlar", value: 5 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

  const monthlyOrders = [
    { name: "Ocak", orders: 42 },
    { name: "Şubat", orders: 53 },
    { name: "Mart", orders: 69 },
    { name: "Nisan", orders: 78 },
    { name: "Mayıs", orders: 83 },
  ];

  const lowStockProducts = [
    {
      id: 1,
      name: "E-Liquid Menthol",
      sku: "EL-001",
      stock: 5,
      threshold: 10,
      category: "E-Liquid",
    },
    {
      id: 2,
      name: "Vape Coil V2",
      sku: "VC-034",
      stock: 8,
      threshold: 15,
      category: "Atomizörler",
    },
    {
      id: 3,
      name: "Mech Mod Pro",
      sku: "MM-102",
      stock: 2,
      threshold: 5,
      category: "Vape Cihazları",
    },
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

  // İstatistik kart animasyonu
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 px-6 py-6 bg-gray-50 dark:bg-gray-900/30 overflow-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
            Kontrol Paneli
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Envanter ve satış verilerinize genel bakış
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white dark:bg-gray-800 px-3 py-1.5 rounded-md border">
            <Calendar className="h-4 w-4" />
            <span>
              Son Güncelleme: {new Date().toLocaleDateString("tr-TR")}
            </span>
          </div>
          <Button
            onClick={() => router.push("/products")}
            className="w-full sm:w-auto gap-2"
          >
            <Package className="h-4 w-4" />
            <span>Ürünleri Yönet</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsLoading(true)}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-1 border w-fit">
          <TabsList className="grid w-full grid-cols-3 gap-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
            >
              <Package className="h-4 w-4 mr-2" />
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analitik
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Raporlar
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <motion.div
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={cardVariants}>
              <Card className="overflow-hidden border-blue-100 dark:border-blue-900/50 transition-all hover:shadow-md">
                <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 transform rounded-full bg-blue-600/20 blur-2xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Toplam Ürün
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalProducts}
                  </div>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <Badge
                      variant="outline"
                      className="mr-1 text-[10px] px-1 py-0 border-blue-200 dark:border-blue-800"
                    >
                      <Info className="h-3 w-3 mr-0.5" />2 yeni ürün
                    </Badge>
                    <span>bu hafta eklendi</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="overflow-hidden border-emerald-100 dark:border-emerald-900/50 transition-all hover:shadow-md">
                <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 transform rounded-full bg-emerald-600/20 blur-2xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Toplam Stok
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Warehouse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStock}</div>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <span>Tüm depolardaki ürün adedi</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="overflow-hidden border-amber-100 dark:border-amber-900/50 transition-all hover:shadow-md">
                <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 transform rounded-full bg-amber-600/20 blur-2xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Düşük Stoklu Ürünler
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.lowStockItems}
                  </div>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <Badge
                      variant="outline"
                      className="mr-1 text-[10px] px-1 py-0 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400"
                    >
                      Dikkat
                    </Badge>
                    <span>Kritik eşiğin altındaki ürünler</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="overflow-hidden border-green-100 dark:border-green-900/50 transition-all hover:shadow-md">
                <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 transform rounded-full bg-green-600/20 blur-2xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Toplam Satış
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalSales.toLocaleString("tr-TR")} ₺
                  </div>
                  <div className="mt-1 flex items-center space-x-1 text-xs text-muted-foreground">
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                    <span className="text-green-500 font-medium">
                      {stats.salesChange}%
                    </span>
                    <span>geçen aya göre artış</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-7">
            <Card className="md:col-span-4 border-indigo-100 dark:border-indigo-900/50 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-indigo-500" />
                      Stok ve Satış Analizi
                    </CardTitle>
                    <CardDescription>
                      Son 5 ayın stok ve satış verileri
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    >
                      Stok
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    >
                      Satış
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                    >
                      Kâr
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorStok"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorSatis"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorKar"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "6px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          border: "1px solid rgba(0, 0, 0, 0.05)",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="stok"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorStok)"
                      />
                      <Area
                        type="monotone"
                        dataKey="satış"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorSatis)"
                      />
                      <Area
                        type="monotone"
                        dataKey="kar"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorKar)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3 border-violet-100 dark:border-violet-900/50 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-violet-500" />
                      Düşük Stoklu Ürünler
                    </CardTitle>
                    <CardDescription>
                      Stok seviyesi kritik eşiğin altındakiler
                    </CardDescription>
                  </div>
                  <Badge variant="destructive" className="animate-pulse">
                    Kritik Stok
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ScrollArea
                  className="h-72 pr-4"
                  scrollHideDelay={0}
                  type="always"
                >
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="mb-5 last:mb-0 bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium flex items-center">
                            {product.name}
                            {product.stock <= product.threshold / 3 && (
                              <Badge
                                variant="destructive"
                                className="ml-2 py-0 h-5"
                              >
                                Kritik
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="text-xs mr-2">
                              {product.category}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              SKU: {product.sku}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {product.stock}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            /{product.threshold} adet
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={(product.stock / product.threshold) * 100}
                          className={`h-2 ${
                            product.stock <= product.threshold / 3
                              ? "bg-red-500"
                              : product.stock <= product.threshold / 2
                                ? "bg-amber-500"
                                : "bg-green-500"
                          }`}
                        />
                        <span className="text-xs w-10 text-right">
                          {Math.round(
                            (product.stock / product.threshold) * 100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t pt-3 bg-gray-50 dark:bg-gray-800/30">
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    href="/products"
                    className="flex items-center justify-center"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Tüm Stok Durumunu Görüntüle
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <Card className="md:col-span-5 border-blue-100 dark:border-blue-900/50 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      Kategori Dağılımı
                    </CardTitle>
                    <CardDescription>
                      Ürün kategorilerine göre dağılım
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} Ürün`, "Miktar"]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "6px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          border: "1px solid rgba(0, 0, 0, 0.05)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-7 border-green-100 dark:border-green-900/50 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-500" />
                      Son Aktiviteler
                    </CardTitle>
                    <CardDescription>
                      Envanter sistemindeki son hareketler
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea
                  className="h-60 pr-4"
                  scrollHideDelay={0}
                  type="always"
                >
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center mb-4 last:mb-0 p-3 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow"
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-lg mr-4 ${
                          activity.type.includes("Giriş")
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : activity.type.includes("Çıkış")
                              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {activity.type.includes("Giriş") && (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                        {activity.type.includes("Çıkış") && (
                          <ArrowDownRight className="h-5 w-5" />
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
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {activity.date}
                          </div>
                          <div className="text-xs text-muted-foreground/70">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t pt-3 bg-gray-50 dark:bg-gray-800/30">
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    href="/inventory"
                    className="flex items-center justify-center"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Tüm Aktiviteleri Görüntüle
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-indigo-100 dark:border-indigo-900/50">
              <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 transform rounded-full bg-indigo-600/20 blur-2xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Müşteri
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.customerCount}</div>
                <div className="mt-1 flex items-center space-x-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500 font-medium">
                    {stats.customerGrowth}%
                  </span>
                  <span>bu ay</span>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-violet-100 dark:border-violet-900/50">
              <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 transform rounded-full bg-violet-600/20 blur-2xl"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Sipariş
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <Package className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.orderCount}</div>
                <div className="mt-1 flex items-center space-x-1 text-xs text-muted-foreground">
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                  <span className="text-red-500 font-medium">
                    {Math.abs(stats.orderChange)}%
                  </span>
                  <span>geçen aya göre</span>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <Card className="h-full border-blue-100 dark:border-blue-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Aylık Sipariş Grafiği
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyOrders}>
                        <defs>
                          <linearGradient
                            id="colorOrders"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#6366f1"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#6366f1"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                          formatter={(value) => [`${value} Sipariş`, "Toplam"]}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "6px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            border: "1px solid rgba(0, 0, 0, 0.05)",
                          }}
                        />
                        <Bar
                          dataKey="orders"
                          fill="url(#colorOrders)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detaylı Analitikler</CardTitle>
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
