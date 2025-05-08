// app/(mainLayout)/products/[productId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";
import { ProductType, InventoryTransactionType } from "@/types/schema";
import { getInventoryTransactionsByProduct } from "@/app/lib/inventoryTransactionService";
import { ProductChart } from "@/components/ProductChart";
import InventoryTransactions from "../inventory-transactions";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { deleteProductImage, getFullImageUrl } from "@/app/lib/productService";
import { ProductImageModal } from "@/components/product-image-modal";
import Image from "next/image";
import { motion } from "framer-motion";
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
  BarChart3,
  Calendar,
  ChevronLeft,
  Clock,
  Edit,
  Truck,
  Eye,
  FileText,
  ImageIcon,
  Package,
  ShoppingCart,
  Tag,
  Trash2,
  BadgeCheck,
  AlertCircle,
  LayoutGrid,
  LineChart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";

function GeneralSection({
  product,
  transactions,
}: {
  product: ProductType;
  transactions: InventoryTransactionType[];
}) {
  const router = useRouter();
  // Hesaplanan stok adedi
  const currentStock = transactions.reduce(
    (tot, tx) => (tx.type === "IN" ? tot + tx.quantity : tot - tx.quantity),
    0
  );

  // Görünüm geçişleri için animasyon
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // Belirlenen stok durumu renkleri
  const stockStatus =
    currentStock === 0
      ? {
          color: "red",
          label: "Tükendi",
          bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        }
      : currentStock < 5
        ? {
            color: "amber",
            label: "Azaldı",
            bg: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
          }
        : {
            color: "emerald",
            label: "Stokta",
            bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
          };

  // Son 5 stok işlemi
  const recentTransactions = [...transactions]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Ürün başlık alanı */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-400">
            {product.name}
          </h1>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => router.push(`/products/${product.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
            Düzenle
          </Button>
          <Button
            className="gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4" />
            Sipariş Oluştur
          </Button>
        </div>
      </div>

      {/* Ana içerik alanı */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol sütun - Ürün görseli */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0 relative">
              {product.imageUrl ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer overflow-hidden">
                      <Image
                        src={getFullImageUrl(product.imageUrl)}
                        alt={product.name}
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{product.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center">
                      <Image
                        src={getFullImageUrl(product.imageUrl)}
                        alt={product.name}
                        width={1200}
                        height={900}
                        className="max-h-[70vh] w-auto object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-4">
                  <ImageIcon className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-4" />
                  <span className="text-gray-400 dark:text-gray-500 text-center">
                    Ürün görseli henüz yüklenmemiş
                  </span>
                </div>
              )}

              <div className="absolute top-3 right-3 flex gap-2">
                <Badge className={stockStatus.bg}>{stockStatus.label}</Badge>
              </div>
            </CardContent>

            <CardFooter className="p-4 bg-gray-50 dark:bg-gray-800/30 flex justify-between items-center">
              <div className="flex gap-2">
                <ProductImageModal
                  productId={product.id}
                  trigger={
                    <Button variant="outline" size="sm" className="gap-2">
                      <ImageIcon className="h-4 w-4" />
                      {product.imageUrl ? "Görseli Değiştir" : "Görsel Yükle"}
                    </Button>
                  }
                  onSuccess={() => {
                    window.location.reload();
                  }}
                />

                {product.imageUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={async () => {
                      try {
                        await deleteProductImage(product.id);
                        window.location.reload();
                      } catch (error) {
                        toast.error("Resim silinirken hata oluştu");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Sil
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Orta ve sağ sütun - Ürün bilgileri ve stok durumu */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ürün bilgileri kartı */}
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="flex items-center text-lg font-semibold">
                    <Package className="mr-2 h-5 w-5 text-indigo-500" />
                    Ürün Bilgileri
                  </CardTitle>
                  <Badge variant="outline" className="rounded-md">
                    SKU: {product.sku}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fiyat
                    </p>
                    <p className="text-lg font-semibold">
                      {product.price.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      ₺
                    </p>
                  </div>

                  {product.cost_price && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Maliyet
                      </p>
                      <p className="text-lg font-semibold">
                        {product.cost_price.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        ₺
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Stok Durumu
                    </p>
                    <div className="flex items-center">
                      <Badge className={stockStatus.bg + " mt-1"}>
                        {currentStock} Adet {stockStatus.label}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Son Güncelleme
                    </p>
                    <p className="text-sm">
                      {product.updatedAt
                        ? format(new Date(product.updatedAt), "d MMMM yyyy", {
                            locale: tr,
                          })
                        : "-"}
                    </p>
                  </div>
                </div>

                <Separator />

                {product.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Açıklama
                    </p>
                    <p className="text-sm">{product.description}</p>
                  </div>
                )}

                {product.barcode && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Barkod
                    </p>
                    <Badge variant="outline" className="font-mono">
                      {product.barcode}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stok durumu kartı */}
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <BarChart3 className="mr-2 h-5 w-5 text-indigo-500" />
                  Stok Durumu
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-sm font-medium">Güncel Stok Seviyesi:</p>
                    <Badge
                      variant="outline"
                      className={`${
                        currentStock === 0
                          ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                          : currentStock < 5
                            ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400"
                            : "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
                      }`}
                    >
                      {currentStock} Adet
                    </Badge>
                  </div>

                  <Progress
                    value={Math.min(currentStock * 10, 100)}
                    className="h-2"
                  />

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-3 mt-2">
                    <h4 className="text-sm font-medium mb-2">
                      Son Stok Hareketleri
                    </h4>
                    {recentTransactions.length > 0 ? (
                      <div className="space-y-2">
                        {recentTransactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:pb-0 last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  tx.type === "IN" ? "default" : "destructive"
                                }
                                className="w-16 justify-center"
                              >
                                {tx.type === "IN" ? "Giriş" : "Çıkış"}
                              </Badge>
                              <span>{tx.quantity} Adet</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {tx.createdAt
                                ? format(new Date(tx.createdAt), "d MMM yyyy", {
                                    locale: tr,
                                  })
                                : "Tarih yok"}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-2 text-sm text-muted-foreground">
                        Henüz stok hareketi bulunmuyor.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Sekmeli alt alan */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="mb-4 w-full bg-gray-100 dark:bg-gray-800/50 p-1 rounded-md">
            <TabsTrigger value="chart" className="gap-2">
              <LineChart className="h-4 w-4" />
              Stok Grafiği
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Tüm Hareketler
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="border-0 p-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Stok Hareketleri Grafiği</CardTitle>
                <CardDescription>
                  Zaman içindeki stok giriş ve çıkışları
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80 w-full">
                  <ProductChart transactions={transactions} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="border-0 p-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Stok Hareketleri</CardTitle>
                <CardDescription>
                  Bu ürüne ait tüm stok giriş ve çıkışları
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <InventoryTransactions productId={product.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

// Diğer sekme bileşenleri burada...
function AttributesSection() {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Özellikler</CardTitle>
        <CardDescription>Ürün özellikleri ve spesifikasyonları</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Bilgi</AlertTitle>
          <AlertDescription>
            Bu bölüm henüz geliştirme aşamasındadır.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function OptionsSection() {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Seçenekler</CardTitle>
        <CardDescription>Ürün varyasyonları ve seçenekleri</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Bilgi</AlertTitle>
          <AlertDescription>
            Bu bölüm henüz geliştirme aşamasındadır.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function FilesSection() {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Dosyalar</CardTitle>
        <CardDescription>Ürün ile ilgili belgeler ve dosyalar</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Bilgi</AlertTitle>
          <AlertDescription>
            Bu bölüm henüz geliştirme aşamasındadır.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

// Diğer sekme bileşenleri aynı şekilde modern görünüme dönüştürülecek...

const sections = [
  {
    key: "general",
    label: "Genel",
    Component: GeneralSection,
    icon: <Package className="h-4 w-4 mr-2" />,
  },
  {
    key: "attributes",
    label: "Özellikler",
    Component: AttributesSection,
    icon: <Tag className="h-4 w-4 mr-2" />,
  },
  {
    key: "options",
    label: "Seçenekler",
    Component: OptionsSection,
    icon: <LayoutGrid className="h-4 w-4 mr-2" />,
  },
  {
    key: "files",
    label: "Dosyalar",
    Component: FilesSection,
    icon: <FileText className="h-4 w-4 mr-2" />,
  },
];

interface ProductPageProps {
  params: { productId: string };
}

export default function ProductPage({
  params: { productId },
}: ProductPageProps) {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [transactions, setTransactions] = useState<InventoryTransactionType[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<string>("general");
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? (localStorage.getItem("token") ?? "")
        : "";
    (async () => {
      try {
        const [prodRes, txs] = await Promise.all([
          api.get<ProductType>(`/products/${productId}`),
          getInventoryTransactionsByProduct(token, productId),
        ]);
        setProduct(prodRes.data);
        setTransactions(txs);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  // Loading durumu için daha güzel bir görünüm
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-muted-foreground">Ürün bilgileri yükleniyor...</p>
      </div>
    );

  // Hata durumu için daha açıklayıcı bir görünüm
  if (error)
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Hata Oluştu</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Geri Dön
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );

  if (!product)
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ürün Bulunamadı</AlertTitle>
        <AlertDescription>
          Aradığınız ürün bulunamadı veya silinmiş olabilir.
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Geri Dön
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );

  const ActiveComponent =
    sections.find((s) => s.key === active)?.Component || sections[0].Component;

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900/10 p-6 rounded-lg">
      {/* Sekme menüsü */}
      <div className="relative mb-6 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-1">
          {sections.map((s) => (
            <Button
              key={s.key}
              variant={active === s.key ? "default" : "ghost"}
              className={`gap-2 ${active === s.key ? "bg-indigo-600 text-white" : ""}`}
              size="sm"
              onClick={() => setActive(s.key)}
            >
              {s.icon}
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Aktif içerik */}
      <div>
        <ActiveComponent product={product} transactions={transactions} />
      </div>
    </div>
  );
}
