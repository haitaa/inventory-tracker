"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  ChevronLeft,
  Edit,
  Loader2,
  Trash2,
  Package,
  Map,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  Plus,
  Minus,
  Search,
  ArrowUpDown,
  CalendarDays,
  Boxes,
  AlertCircle,
  Check,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  WarehouseType,
  StockType,
  ProductType,
  InventoryTransactionType,
} from "@/types/schema";
import {
  getWarehouseById,
  deleteWarehouse,
  updateWarehouse,
  getWarehouseStocks,
  getWarehouseTransactions,
} from "@/app/lib/warehouseService";
import { InventoryTransactionModal } from "@/components/InventoryTransactionModal";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { searchProductsByName } from "@/app/lib/productService";
import { addInventoryStock } from "@/app/lib/inventoryTransactionService";

interface WarehousePageProps {
  params: { warehouseId: string };
}

export default function WarehousePage({
  params: { warehouseId },
}: WarehousePageProps) {
  const router = useRouter();
  const [warehouse, setWarehouse] = useState<WarehouseType | null>(null);
  const [stocks, setStocks] = useState<StockType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockTransactionType, setStockTransactionType] = useState<
    "IN" | "OUT"
  >("IN");
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [recentTransactions, setRecentTransactions] = useState<
    InventoryTransactionType[]
  >([]);
  const [isMultipleStockModalOpen, setIsMultipleStockModalOpen] =
    useState(false);
  const [bulkProducts, setBulkProducts] = useState<
    Array<{ id: string; name: string; quantity: number }>
  >([]);
  const [searchResults, setSearchResults] = useState<ProductType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAddingBulkProducts, setIsAddingBulkProducts] = useState(false);

  // Depoya ait bilgileri ve stokları getirme
  const fetchWarehouseData = async () => {
    setLoading(true);
    try {
      // Depo bilgilerini getir
      const data = await getWarehouseById(warehouseId);
      if (!data) {
        toast.error("Depo bulunamadı");
        router.replace("/warehouses");
        return;
      }
      setWarehouse(data);

      // Depodaki stokları getir
      const stocksData = await getWarehouseStocks(warehouseId);
      setStocks(stocksData);

      // Son işlemleri getir
      const transactionsData = await getWarehouseTransactions(warehouseId);
      setRecentTransactions(transactionsData);
    } catch (error) {
      console.error("Depo verileri alınırken hata:", error);
      toast.error("Depo verileri yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    fetchWarehouseData();
  }, [warehouseId, router]);

  // Depoyu silme
  const handleDeleteWarehouse = async () => {
    setIsDeleting(true);
    try {
      await deleteWarehouse(warehouseId);
      toast.success("Depo başarıyla silindi");
      router.replace("/warehouses");
    } catch (error) {
      console.error("Depo silinirken hata:", error);
      toast.error("Depo silinirken bir hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };

  // Stok ekleme modalını açma
  const openAddStockModal = (product: ProductType) => {
    setSelectedProduct(product);
    setStockTransactionType("IN");
    setStockModalOpen(true);
  };

  // Stok çıkarma modalını açma
  const openRemoveStockModal = (product: ProductType) => {
    setSelectedProduct(product);
    setStockTransactionType("OUT");
    setStockModalOpen(true);
  };

  // Stok modalını kapatma
  const closeStockModal = () => {
    setStockModalOpen(false);
    setSelectedProduct(null);
  };

  // Stok işlemi başarılı olduğunda
  const handleStockSuccess = () => {
    // Sayfa verilerini yenile
    fetchWarehouseData();
  };

  // Animasyon için varyantlar
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

  // Stok verilerini filtreleme ve sıralama
  const filteredStocks = stocks.filter(
    (stock) =>
      stock.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.product?.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    // product.name, product.sku, quantity gibi alanlara göre sıralama
    const aField =
      sortField === "quantity"
        ? a.quantity
        : a.product?.[sortField as keyof ProductType];
    const bField =
      sortField === "quantity"
        ? b.quantity
        : b.product?.[sortField as keyof ProductType];

    if (!aField && !bField) return 0;
    if (!aField) return sortDirection === "asc" ? 1 : -1;
    if (!bField) return sortDirection === "asc" ? -1 : 1;

    if (typeof aField === "number" && typeof bField === "number") {
      return sortDirection === "asc" ? aField - bField : bField - aField;
    }

    if (typeof aField === "string" && typeof bField === "string") {
      return sortDirection === "asc"
        ? aField.localeCompare(bField)
        : bField.localeCompare(aField);
    }

    return 0;
  });

  // Sıralama işlemi
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Stoklar toplamı
  const totalStockQuantity = stocks.reduce(
    (total, stock) => total + stock.quantity,
    0
  );

  // Doluluk oranı (kapasite varsa)
  const capacityUsagePercent = warehouse?.capacity
    ? Math.min(100, Math.round((totalStockQuantity / warehouse.capacity) * 100))
    : 0;

  // Ürün arama fonksiyonu
  const searchProducts = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchProductsByName(query);
      setSearchResults(data);
    } catch (error) {
      console.error("Ürünler aranırken hata:", error);
      toast.error("Ürünler aranırken bir hata oluştu");
    } finally {
      setIsSearching(false);
    }
  };

  // Toplu stok ekleme fonksiyonu
  const handleAddBulkStock = async () => {
    if (bulkProducts.length === 0) {
      toast.error("Lütfen en az bir ürün ekleyin");
      return;
    }

    setIsAddingBulkProducts(true);
    const token = localStorage.getItem("token") || "";
    const successfulProducts: string[] = [];
    const failedProducts: string[] = [];

    try {
      // Her ürün için stok ekleme işlemini gerçekleştir
      for (const product of bulkProducts) {
        try {
          await addInventoryStock(
            token,
            product.id,
            product.quantity,
            warehouseId,
            "Toplu ekleme işlemi"
          );
          successfulProducts.push(product.name);
        } catch (error) {
          console.error(`${product.name} eklenirken hata:`, error);
          failedProducts.push(product.name);
        }
      }

      // Başarılı ve başarısız işlemleri raporla
      if (successfulProducts.length > 0) {
        toast.success(
          `${successfulProducts.length} adet ürün stoğu başarıyla eklendi`
        );
      }

      if (failedProducts.length > 0) {
        toast.error(
          `${failedProducts.length} ürün eklenemedi: ${failedProducts.join(", ")}`
        );
      }

      setBulkProducts([]);
      setIsMultipleStockModalOpen(false);

      // Sayfayı yenile
      fetchWarehouseData();
    } catch (error) {
      console.error("Toplu stok eklenirken hata:", error);
      toast.error("Toplu stok eklenirken bir hata oluştu");
    } finally {
      setIsAddingBulkProducts(false);
    }
  };

  // Ürünü toplu ekleme listesine ekle
  const addProductToBulkList = (product: ProductType) => {
    if (bulkProducts.some((p) => p.id === product.id)) {
      toast.error("Bu ürün zaten listeye eklenmiş");
      return;
    }

    setBulkProducts([
      ...bulkProducts,
      { id: product.id, name: product.name || "İsimsiz ürün", quantity: 1 },
    ]);
    setSearchResults([]);
  };

  // Ürünü toplu ekleme listesinden çıkar
  const removeProductFromBulkList = (productId: string) => {
    setBulkProducts(bulkProducts.filter((p) => p.id !== productId));
  };

  // Ürün miktarını güncelle
  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      toast.error("Miktar en az 1 olmalıdır");
      return;
    }

    setBulkProducts(
      bulkProducts.map((p) => (p.id === productId ? { ...p, quantity } : p))
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Depo Bulunamadı</h1>
        <p className="text-muted-foreground mb-4">
          Aradığınız depo bulunamadı veya erişim izniniz yok.
        </p>
        <Button onClick={() => router.replace("/warehouses")}>
          Depolar Sayfasına Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 pt-0">
      {/* Depo başlık alanı */}
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
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
            {warehouse.name}
          </h1>
          {warehouse.code && (
            <Badge
              variant="outline"
              className="ml-2 bg-slate-50 dark:bg-slate-800 font-mono"
            >
              {warehouse.code}
            </Badge>
          )}
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => router.push(`/warehouses/${warehouse.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
            Düzenle
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Depoyu silmek istediğinizden emin misiniz?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz. Bu depo kalıcı olarak silinecek ve
                  içindeki ürünlerle olan bağlantısı kaldırılacaktır.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteWarehouse}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  {isDeleting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Evet, Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Ana içerik */}
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Üst kartlar - Özet bilgiler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Toplam Stok</CardDescription>
                <CardTitle className="text-2xl">{totalStockQuantity}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Ürün Sayısı: {stocks.length}</span>
                  <span>
                    {warehouse.capacity ? `${warehouse.capacity} kapasite` : ""}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Doluluk Oranı</CardDescription>
                <CardTitle className="text-2xl">
                  {capacityUsagePercent}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress
                  value={capacityUsagePercent}
                  className={`h-2 ${
                    capacityUsagePercent > 80
                      ? "bg-red-100 dark:bg-red-950/50"
                      : capacityUsagePercent > 50
                        ? "bg-amber-100 dark:bg-amber-950/50"
                        : "bg-emerald-100 dark:bg-emerald-950/50"
                  }`}
                />
                <div className="mt-1 text-xs text-muted-foreground">
                  {capacityUsagePercent > 80
                    ? "Kritik Seviye"
                    : capacityUsagePercent > 50
                      ? "Normal Seviye"
                      : "İyi Seviye"}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Son İşlem</CardDescription>
                <CardTitle className="text-lg truncate">
                  {recentTransactions.length > 0
                    ? recentTransactions[0].product?.name || "İsimsiz ürün"
                    : "İşlem Yok"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {recentTransactions.length > 0 &&
                recentTransactions[0].createdAt ? (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {format(
                        new Date(recentTransactions[0].createdAt),
                        "d MMMM yyyy, HH:mm",
                        { locale: tr }
                      )}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">
                    Henüz bir işlem yapılmamış
                  </span>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Konum</CardDescription>
                <CardTitle className="text-lg">
                  {warehouse.city || "Belirtilmemiş"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {warehouse.address ? (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">
                      {warehouse.address}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Adres bilgisi bulunamadı
                  </span>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Depo Detay Bilgileri */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Depo Bilgileri</CardTitle>
              <CardDescription>Depo hakkında detaylı bilgiler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Genel Bilgiler</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Depo Adı:</span>
                      <span>{warehouse.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Depo Kodu:</span>
                      <span>{warehouse.code || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Kapasite:</span>
                      <span>{warehouse.capacity || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Ürün Sayısı:
                      </span>
                      <span>{stocks.length}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Konum Bilgileri</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Adres:</span>
                      <span>{warehouse.address || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Şehir:</span>
                      <span>{warehouse.city || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">İlçe:</span>
                      <span>{warehouse.district || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Posta Kodu:</span>
                      <span>{warehouse.postalCode || "Belirtilmemiş"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">İletişim Bilgileri</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sorumlu:</span>
                      <span>{warehouse.managerName || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Telefon:</span>
                      <span>{warehouse.phone || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">E-posta:</span>
                      <span>{warehouse.email || "Belirtilmemiş"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sekmeli Alan: Stoklar ve Son İşlemler */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="stocks" className="border-0 shadow-sm rounded-lg">
            <TabsList className="bg-gray-50 dark:bg-gray-800/30 p-0.5 border-b rounded-t-lg">
              <TabsTrigger
                value="stocks"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md"
              >
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>Stoklar</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md"
              >
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>Son İşlemler</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Stoklar Sekmesi */}
            <TabsContent value="stocks" className="p-0">
              <div className="p-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Ürün ara..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        // Dışa aktar
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Dışa Aktar
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => setIsMultipleStockModalOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Stok Ekle
                    </Button>
                  </div>
                </div>

                {/* Toplu Stok Ekleme Modalı */}
                <Sheet
                  open={isMultipleStockModalOpen}
                  onOpenChange={setIsMultipleStockModalOpen}
                >
                  <SheetContent className="sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>Toplu Stok Ekleme</SheetTitle>
                      <SheetDescription>
                        Depoya birden fazla ürün eklemek için kullanabilirsiniz.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ürün Ara</label>
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Ürün adı yazın..."
                            className="pl-8"
                            onChange={(e) => searchProducts(e.target.value)}
                          />
                        </div>

                        {/* Arama Sonuçları */}
                        {searchResults.length > 0 && (
                          <div className="border rounded-md mt-1 max-h-[200px] overflow-y-auto bg-white dark:bg-gray-900">
                            {isSearching ? (
                              <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                              </div>
                            ) : (
                              <div className="divide-y">
                                {searchResults.map((product) => (
                                  <div
                                    key={product.id}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                    onClick={() =>
                                      addProductToBulkList(product)
                                    }
                                  >
                                    <div className="flex items-center">
                                      <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 border flex items-center justify-center mr-2">
                                        {product.imageUrl ? (
                                          <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-6 h-6 object-contain"
                                          />
                                        ) : (
                                          <Package className="h-4 w-4 text-gray-400" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          {product.name || "İsimsiz ürün"}
                                        </div>
                                        {product.sku && (
                                          <div className="text-xs text-muted-foreground">
                                            {product.sku}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-3">
                          Eklenecek Ürünler
                        </h4>
                        {bulkProducts.length === 0 ? (
                          <div className="text-center py-8 border rounded-md bg-gray-50 dark:bg-gray-800/10">
                            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">
                              Listeye henüz ürün eklenmedi
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {bulkProducts.map((product) => (
                              <div
                                key={product.id}
                                className="flex items-center justify-between border rounded-md p-3 bg-gray-50 dark:bg-gray-800/10"
                              >
                                <div className="flex items-center gap-2">
                                  <Package className="h-5 w-5 text-indigo-500" />
                                  <div>
                                    <p className="text-sm font-medium">
                                      {product.name}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() =>
                                        updateProductQuantity(
                                          product.id,
                                          Math.max(1, product.quantity - 1)
                                        )
                                      }
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <Input
                                      type="number"
                                      value={product.quantity}
                                      min="1"
                                      onChange={(e) =>
                                        updateProductQuantity(
                                          product.id,
                                          parseInt(e.target.value) || 1
                                        )
                                      }
                                      className="h-8 w-16 text-center"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() =>
                                        updateProductQuantity(
                                          product.id,
                                          product.quantity + 1
                                        )
                                      }
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-red-500"
                                    onClick={() =>
                                      removeProductFromBulkList(product.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <SheetFooter className="mt-6">
                      <SheetClose asChild>
                        <Button variant="outline">İptal</Button>
                      </SheetClose>
                      <Button
                        onClick={handleAddBulkStock}
                        disabled={
                          bulkProducts.length === 0 || isAddingBulkProducts
                        }
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isAddingBulkProducts && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {bulkProducts.length === 0
                          ? "Ürün Ekleyin"
                          : `${bulkProducts.length} Ürünü Ekle`}
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>

                {/* Stok Tablosu */}
                {sortedStocks.length === 0 ? (
                  <div className="p-12 text-center bg-gray-50 dark:bg-gray-800/10 rounded-md">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">
                      Stok Bulunamadı
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? "Arama kriterlerinize uygun stok bulunamadı."
                        : "Bu depoda henüz stok girişi yapılmamış."}
                    </p>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchQuery("")}
                        className="mx-auto"
                      >
                        Filtreyi Temizle
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">
                            <Button
                              variant="ghost"
                              onClick={() => handleSort("name")}
                              className="px-0 font-medium flex items-center"
                            >
                              Ürün
                              {sortField === "name" && (
                                <ArrowUpDown
                                  className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                                />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort("sku")}
                              className="px-0 font-medium flex items-center"
                            >
                              SKU
                              {sortField === "sku" && (
                                <ArrowUpDown
                                  className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                                />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort("quantity")}
                              className="px-0 font-medium flex items-center"
                            >
                              Stok Adedi
                              {sortField === "quantity" && (
                                <ArrowUpDown
                                  className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                                />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedStocks.map((stock) => (
                          <TableRow key={stock.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 border flex items-center justify-center mr-2">
                                  {stock.product?.imageUrl ? (
                                    <img
                                      src={stock.product.imageUrl}
                                      alt={stock.product.name}
                                      className="w-6 h-6 object-contain"
                                    />
                                  ) : (
                                    <Package className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <div>
                                    {stock.product?.name || "İsimsiz ürün"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {stock.product?.categoryId
                                      ? "Kategori"
                                      : ""}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                              >
                                {stock.product?.sku || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  stock.quantity <= 0
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : stock.quantity < 5
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                }`}
                              >
                                {stock.quantity}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    stock.product &&
                                    openAddStockModal(stock.product)
                                  }
                                  className="h-8 w-8"
                                  disabled={!stock.product}
                                >
                                  <Plus className="h-4 w-4 text-emerald-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    stock.product &&
                                    openRemoveStockModal(stock.product)
                                  }
                                  className="h-8 w-8"
                                  disabled={
                                    !stock.product || stock.quantity <= 0
                                  }
                                >
                                  <Minus className="h-4 w-4 text-red-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    stock.product &&
                                    router.push(`/products/${stock.product.id}`)
                                  }
                                  className="h-8 w-8"
                                  disabled={!stock.product}
                                >
                                  <Edit className="h-4 w-4 text-blue-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Son İşlemler Sekmesi */}
            <TabsContent value="transactions" className="p-0">
              <div className="p-4">
                {recentTransactions.length === 0 ? (
                  <div className="p-12 text-center bg-gray-50 dark:bg-gray-800/10 rounded-md">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <BarChart3 className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">
                      İşlem Bulunamadı
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Bu depoda henüz stok işlemi yapılmamış.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[220px]">Ürün</TableHead>
                          <TableHead>İşlem Tipi</TableHead>
                          <TableHead>Miktar</TableHead>
                          <TableHead>Tarih</TableHead>
                          <TableHead>Kullanıcı</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              {transaction.product?.name || "İsimsiz ürün"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  transaction.type === "IN"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                }`}
                              >
                                {transaction.type === "IN" ? "Giriş" : "Çıkış"}
                              </Badge>
                            </TableCell>
                            <TableCell>{transaction.quantity}</TableCell>
                            <TableCell>
                              {transaction.createdAt
                                ? format(
                                    new Date(transaction.createdAt),
                                    "d MMMM yyyy, HH:mm",
                                    { locale: tr }
                                  )
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {transaction.user?.email ||
                                "Bilinmeyen Kullanıcı"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Stok Ekleme/Çıkarma Modalı */}
      {selectedProduct && (
        <InventoryTransactionModal
          isOpen={stockModalOpen}
          onClose={closeStockModal}
          onSuccess={handleStockSuccess}
          productId={selectedProduct.id}
          transactionType={stockTransactionType}
          initialWarehouseId={warehouseId}
        />
      )}
    </div>
  );
}
