"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit,
  FileText,
  Filter,
  Download,
  Calendar,
  CreditCard,
  Check,
  MoreHorizontal,
  TrendingUp,
  ArrowDownUp,
  RefreshCcw,
  Clock,
  ExternalLink,
  Truck,
  ShoppingBag,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { OrderType, OrderStatusEnum, PaymentTypeEnum } from "@/types/schema";
import {
  getOrders,
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentTypeLabel,
  exportOrdersToCSV,
  bulkUpdateOrderStatus,
} from "@/app/lib/orderService";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

// İstatistik kartı bileşeni
type StatCardProps = {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
  subtitle?: string;
  change?: {
    value: number;
    type: "positive" | "negative";
  };
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  change,
}: StatCardProps) => (
  <Card className="relative overflow-hidden shadow-sm border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
    <div
      className={`absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 transform rounded-full bg-${color}-500/10 blur-2xl`}
    ></div>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <div
          className={`w-10 h-10 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}
        >
          <Icon
            className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`}
          />
        </div>
        {change && (
          <Badge
            variant={change.type === "positive" ? "default" : "destructive"}
            className={`px-1.5 h-5 text-xs font-medium ${
              change.type === "positive"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : ""
            }`}
          >
            {change.value}%
            {change.type === "positive" ? (
              <TrendingUp className="ml-0.5 h-3 w-3" />
            ) : (
              <ArrowDownUp className="ml-0.5 h-3 w-3" />
            )}
          </Badge>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{title}</p>
      {subtitle && (
        <p className="text-xs mt-1 text-muted-foreground">{subtitle}</p>
      )}
    </CardContent>
  </Card>
);

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<OrderStatusEnum | "">("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    thisWeekRevenue: 0,
    revenueChange: 5.2,
    orderGrowth: 3.4,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length) {
      // Basit istatistikler hesapla
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = orders.filter(
        (order) => new Date(order.createdAt!).getTime() >= today.getTime()
      ).length;

      const pendingOrders = orders.filter((order) =>
        [OrderStatusEnum.PENDING, OrderStatusEnum.PROCESSING].includes(
          order.status
        )
      ).length;

      // Son 7 gün
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      const thisWeekRevenue = orders
        .filter(
          (order) => new Date(order.createdAt!).getTime() >= lastWeek.getTime()
        )
        .reduce((sum, order) => sum + order.totalAmount, 0);

      setStats({
        ...stats,
        totalOrders,
        todayOrders,
        pendingOrders,
        totalRevenue,
        thisWeekRevenue,
      });
    }
  }, [orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Siparişler yüklenirken hata:", error);
      setError("Siparişler yüklenemedi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Duruma göre filtreleme
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    // Ödeme tipine göre filtreleme
    if (
      paymentTypeFilter !== "all" &&
      order.paymentType !== paymentTypeFilter
    ) {
      return false;
    }

    // Tarih aralığına göre filtreleme
    if (startDate && new Date(order.createdAt!) < startDate) {
      return false;
    }
    if (endDate) {
      const endDateWithTime = new Date(endDate);
      endDateWithTime.setHours(23, 59, 59, 999);
      if (new Date(order.createdAt!) > endDateWithTime) {
        return false;
      }
    }

    // Tutar aralığına göre filtreleme
    const orderAmount = Number(order.totalAmount);
    if (minAmount && orderAmount < Number(minAmount)) {
      return false;
    }
    if (maxAmount && orderAmount > Number(maxAmount)) {
      return false;
    }

    // Arama sorgusuna göre filtreleme
    const searchLower = searchQuery.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(searchLower) ||
      (order.customer?.firstName + " " + order.customer?.lastName)
        .toLowerCase()
        .includes(searchLower) ||
      (order.customer?.email || "").toLowerCase().includes(searchLower) ||
      (order.customer?.phone || "").toLowerCase().includes(searchLower) ||
      order.totalAmount.toString().includes(searchLower)
    );
  });

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      await exportOrdersToCSV(filteredOrders);
    } catch (error) {
      console.error("Dışa aktarma hatası:", error);
      setError("Siparişler dışa aktarılamadı.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilterReset = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPaymentTypeFilter("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setMinAmount("");
    setMaxAmount("");
  };

  const handleSelectAllOrders = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(filteredOrders.map((order) => order.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrderIds((prev) => [...prev, orderId]);
    } else {
      setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedOrderIds.length === 0) return;

    try {
      setUpdatingStatus(true);
      await bulkUpdateOrderStatus(
        selectedOrderIds,
        bulkStatus as OrderStatusEnum
      );
      await fetchOrders();
      setSelectedOrderIds([]);
      setBulkStatus("");
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error("Toplu durum güncellemesi hatası:", error);
      setError("Siparişlerin durumu güncellenirken bir hata oluştu.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900/10 p-6 rounded-lg">
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-400">
            Sipariş Yönetimi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            E-ticaret sistemindeki tüm siparişleri yönetin ve takip edin
          </p>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <Button
            variant="outline"
            onClick={fetchOrders}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCcw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Yenileniyor..." : "Yenile"}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={isExporting || filteredOrders.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Dışa Aktarılıyor..." : "Dışa Aktar"}
          </Button>
          <Button
            onClick={() => router.push("/orders/new")}
            className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 gap-2"
          >
            <Plus className="h-4 w-4" /> Yeni Sipariş
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="animate-fadeIn">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* İstatistik Kartları */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={cardVariants}>
          <StatCard
            title="Toplam Sipariş"
            value={stats.totalOrders.toString()}
            icon={ShoppingBag}
            color="blue"
            change={{ value: stats.orderGrowth, type: "positive" }}
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="Bugün Oluşturulan"
            value={stats.todayOrders.toString()}
            icon={Clock}
            color="green"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="Bekleyen Siparişler"
            value={stats.pendingOrders.toString()}
            icon={Package}
            color="amber"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="Toplam Gelir"
            value={`${stats.totalRevenue.toLocaleString("tr-TR")} ₺`}
            subtitle={`Bu hafta: ${stats.thisWeekRevenue.toLocaleString("tr-TR")} ₺`}
            icon={CreditCard}
            color="indigo"
            change={{ value: stats.revenueChange, type: "positive" }}
          />
        </motion.div>
      </motion.div>

      <Card className="border-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800/50">
        <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-800/30">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-indigo-500" />
                  Sipariş Listesi
                </CardTitle>
                <CardDescription>
                  {filteredOrders.length === orders.length
                    ? `Toplam ${orders.length} sipariş`
                    : `${filteredOrders.length} / ${orders.length} sipariş gösteriliyor`}
                </CardDescription>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" /> Filtrele
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader className="text-left">
                    <SheetTitle>Gelişmiş Filtreleme</SheetTitle>
                    <SheetDescription>
                      Siparişleri çeşitli kriterlere göre filtreleyebilirsiniz
                    </SheetDescription>
                  </SheetHeader>

                  <Separator className="my-4" />

                  <div className="space-y-5 py-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Sipariş Durumu
                      </Label>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="sm:w-44">
                          <SelectValue placeholder="Tüm Durumlar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tüm Durumlar</SelectItem>
                          {Object.keys(OrderStatusEnum).map((status) => (
                            <SelectItem key={status} value={status}>
                              {getOrderStatusLabel(status as OrderStatusEnum)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ödeme Tipi</Label>
                      <Select
                        value={paymentTypeFilter}
                        onValueChange={setPaymentTypeFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tüm Ödeme Tipleri" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tüm Ödeme Tipleri</SelectItem>
                          {Object.keys(PaymentTypeEnum).map((type) => (
                            <SelectItem key={type} value={type}>
                              {getPaymentTypeLabel(type as PaymentTypeEnum)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Tarih Aralığı
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Başlangıç</Label>
                          <DatePicker
                            date={startDate}
                            setDate={setStartDate}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Bitiş</Label>
                          <DatePicker
                            date={endDate}
                            setDate={setEndDate}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Tutar Aralığı (₺)
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Minimum</Label>
                          <Input
                            type="number"
                            placeholder="Min ₺"
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Maksimum</Label>
                          <Input
                            type="number"
                            placeholder="Max ₺"
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <SheetFooter className="pt-4 mt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={handleFilterReset}
                      className="w-full sm:w-auto"
                    >
                      Sıfırla
                    </Button>
                    <Button
                      className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => {
                        document
                          .querySelector("[data-radix-dismiss-trigger]")
                          ?.dispatchEvent(
                            new MouseEvent("click", { bubbles: true })
                          );
                      }}
                    >
                      Uygula
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Sipariş numarası, müşteri adı veya email ile ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 flex-1 bg-gray-50/50 dark:bg-gray-800/20 focus-visible:ring-indigo-500"
                />
              </div>
              <div className="sm:w-44">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm Durumlar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    {Object.keys(OrderStatusEnum).map((status) => (
                      <SelectItem key={status} value={status}>
                        {getOrderStatusLabel(status as OrderStatusEnum)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Sipariş Bulunamadı</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                {searchQuery ||
                statusFilter !== "all" ||
                paymentTypeFilter !== "all" ||
                startDate ||
                endDate ||
                minAmount ||
                maxAmount
                  ? "Arama ve filtreleme kriterlerine uygun sipariş bulunamadı."
                  : "Henüz sipariş eklenmemiş."}
              </p>
              {(searchQuery ||
                statusFilter !== "all" ||
                paymentTypeFilter !== "all" ||
                startDate ||
                endDate ||
                minAmount ||
                maxAmount) && (
                <Button
                  variant="outline"
                  className="mt-4 gap-2"
                  onClick={handleFilterReset}
                >
                  <RefreshCcw className="h-4 w-4" />
                  Filtreleri Temizle
                </Button>
              )}
            </div>
          ) : (
            <div>
              {selectedOrderIds.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 border-y border-indigo-100 dark:border-indigo-800/30">
                  <span className="text-sm font-medium flex items-center">
                    <Check className="h-4 w-4 text-indigo-600 mr-2" />
                    {selectedOrderIds.length} sipariş seçildi
                  </span>
                  <div className="flex space-x-2">
                    <Dialog
                      open={isStatusDialogOpen}
                      onOpenChange={setIsStatusDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Truck className="h-4 w-4" />
                          Durumu Güncelle
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>
                            Sipariş Durumlarını Güncelle
                          </DialogTitle>
                          <DialogDescription>
                            Seçilen {selectedOrderIds.length} siparişin durumunu
                            değiştir
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Label
                            htmlFor="status"
                            className="text-sm font-medium"
                          >
                            Yeni Durum
                          </Label>
                          <Select
                            value={bulkStatus}
                            onValueChange={(value) =>
                              setBulkStatus(value as OrderStatusEnum)
                            }
                          >
                            <SelectTrigger id="status" className="mt-1.5">
                              <SelectValue placeholder="Durum seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(OrderStatusEnum).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {getOrderStatusLabel(
                                    status as OrderStatusEnum
                                  )}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsStatusDialogOpen(false)}
                          >
                            İptal
                          </Button>
                          <Button
                            onClick={handleBulkStatusUpdate}
                            disabled={!bulkStatus || updatingStatus}
                            className="bg-indigo-600 hover:bg-indigo-700"
                          >
                            {updatingStatus ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
                                Güncelleniyor...
                              </>
                            ) : (
                              "Güncelle"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrderIds([])}
                    >
                      Seçimi Temizle
                    </Button>
                  </div>
                </div>
              )}
              <div className="relative overflow-x-auto">
                <Table className="border-collapse w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/30">
                      <TableHead className="py-3 w-12">
                        <Checkbox
                          checked={
                            selectedOrderIds.length === filteredOrders.length &&
                            filteredOrders.length > 0
                          }
                          onCheckedChange={handleSelectAllOrders}
                          className="translate-y-[2px]"
                        />
                      </TableHead>
                      <TableHead className="font-medium">Sipariş No</TableHead>
                      <TableHead className="font-medium">Müşteri</TableHead>
                      <TableHead className="font-medium">Tarih</TableHead>
                      <TableHead className="font-medium">Durum</TableHead>
                      <TableHead className="font-medium">Ödeme Tipi</TableHead>
                      <TableHead className="font-medium">Toplam</TableHead>
                      <TableHead className="text-right font-medium">
                        İşlemler
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order, index) => (
                      <TableRow
                        key={order.id}
                        className={`border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors ${
                          selectedOrderIds.includes(order.id)
                            ? "bg-indigo-50/50 dark:bg-indigo-900/10"
                            : ""
                        }`}
                      >
                        <TableCell className="py-3">
                          <Checkbox
                            checked={selectedOrderIds.includes(order.id)}
                            onCheckedChange={(checked) =>
                              handleSelectOrder(order.id, !!checked)
                            }
                            className="translate-y-[2px]"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <span
                            className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            onClick={() => router.push(`/orders/${order.id}`)}
                          >
                            {order.orderNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>
                              {order.customer?.firstName}{" "}
                              {order.customer?.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {order.customer?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>
                              {new Date(order.createdAt!).toLocaleDateString(
                                "tr-TR"
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(order.createdAt!).toLocaleTimeString(
                                "tr-TR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getOrderStatusColor(order.status)} px-2 py-0.5`}
                          >
                            {getOrderStatusLabel(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CreditCard className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span>
                              {getPaymentTypeLabel(order.paymentType)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.totalAmount.toLocaleString("tr-TR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          ₺
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => router.push(`/orders/${order.id}`)}
                            >
                              <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                router.push(`/orders/${order.id}/edit`)
                              }
                            >
                              <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedOrderIds([order.id]);
                                    setBulkStatus("");
                                    setIsStatusDialogOpen(true);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Truck className="h-4 w-4 mr-2" />
                                  Durumu Güncelle
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/orders/${order.id}`)
                                  }
                                  className="cursor-pointer"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Detayları Görüntüle
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
