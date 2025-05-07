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
} from "@/components/ui/dropdown-menu";
import { OrderType, OrderStatusEnum, PaymentTypeEnum } from "@/types/schema";
import {
  getOrders,
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentTypeLabel,
  exportOrdersToCSV,
  bulkUpdateOrderStatus,
} from "@/app/lib/orderService";

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Siparişler yüklenirken hata:", error);
      setError("Siparişler yüklenemedi.");
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Siparişler</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={isExporting || filteredOrders.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Dışa Aktarılıyor..." : "Dışa Aktar"}
          </Button>
          <Button onClick={() => router.push("/orders/new")}>
            <Plus className="mr-2 h-4 w-4" /> Yeni Sipariş
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sipariş Listesi</CardTitle>
          <CardDescription>
            Envanter yönetimi sistemindeki tüm siparişler
          </CardDescription>
          <div className="flex flex-col space-y-2 md:space-y-0 md:items-center md:justify-between mt-2">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Sipariş ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" variant="ghost">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue placeholder="Durum filtreleme" />
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

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:ml-auto">
                  <Filter className="h-4 w-4 mr-2" /> Gelişmiş Filtreleme
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Gelişmiş Filtreleme</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Ödeme Tipi</Label>
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

                  <div className="space-y-2">
                    <Label>Tarih Aralığı</Label>
                    <div className="flex flex-col space-y-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Başlangıç Tarihi</Label>
                        <DatePicker
                          date={startDate}
                          setDate={setStartDate}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Bitiş Tarihi</Label>
                        <DatePicker
                          date={endDate}
                          setDate={setEndDate}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tutar Aralığı (₺)</Label>
                    <div className="flex space-x-2">
                      <div className="space-y-1 flex-1">
                        <Label className="text-xs">Minimum</Label>
                        <Input
                          type="number"
                          placeholder="Min ₺"
                          value={minAmount}
                          onChange={(e) => setMinAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1 flex-1">
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

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={handleFilterReset}>
                      Sıfırla
                    </Button>
                    <Button>Uygula</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Sipariş Bulunamadı</h3>
              <p className="text-sm text-muted-foreground mt-2">
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
                  className="mt-4"
                  onClick={handleFilterReset}
                >
                  Filtreleri Temizle
                </Button>
              )}
            </div>
          ) : (
            <div>
              {selectedOrderIds.length > 0 && (
                <div className="flex items-center justify-between bg-muted/40 p-2 rounded-md mb-4">
                  <span className="text-sm font-medium">
                    {selectedOrderIds.length} sipariş seçildi
                  </span>
                  <div className="flex space-x-2">
                    <Dialog
                      open={isStatusDialogOpen}
                      onOpenChange={setIsStatusDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Durumu Güncelle
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
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
                          <Label htmlFor="status">Yeni Durum</Label>
                          <Select
                            value={bulkStatus}
                            onValueChange={(value) =>
                              setBulkStatus(value as OrderStatusEnum)
                            }
                          >
                            <SelectTrigger id="status">
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={
                            selectedOrderIds.length === filteredOrders.length &&
                            filteredOrders.length > 0
                          }
                          onCheckedChange={handleSelectAllOrders}
                        />
                      </TableHead>
                      <TableHead>Sipariş No</TableHead>
                      <TableHead>Müşteri</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Ödeme Tipi</TableHead>
                      <TableHead>Toplam</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedOrderIds.includes(order.id)}
                            onCheckedChange={(checked) =>
                              handleSelectOrder(order.id, !!checked)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          {order.customer?.firstName} {order.customer?.lastName}
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt!).toLocaleDateString(
                            "tr-TR"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {getOrderStatusLabel(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getPaymentTypeLabel(order.paymentType)}
                        </TableCell>
                        <TableCell>{order.totalAmount.toFixed(2)} ₺</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/orders/${order.id}`)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(`/orders/${order.id}/edit`)
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedOrderIds([order.id]);
                                    setBulkStatus("");
                                    setIsStatusDialogOpen(true);
                                  }}
                                >
                                  Durumu Güncelle
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
