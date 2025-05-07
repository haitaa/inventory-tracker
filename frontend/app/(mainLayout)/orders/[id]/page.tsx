"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Package,
  Truck,
  CreditCard,
  FileText,
  User,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  AlertCircle,
  ShoppingBag,
  XCircle,
  ArrowLeftCircle,
  Printer,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { OrderType, OrderStatusEnum } from "@/types/schema";
import {
  getOrderById,
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentTypeLabel,
  updateOrderStatus,
  exportOrderToPDF,
} from "@/app/lib/orderService";
import { getFullName } from "@/app/lib/customerService";

// Durum simgesi bileşeni
const StatusIcon = ({ status }: { status: OrderStatusEnum }) => {
  switch (status) {
    case OrderStatusEnum.PENDING:
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case OrderStatusEnum.PROCESSING:
      return <Package className="h-5 w-5 text-blue-500" />;
    case OrderStatusEnum.SHIPPED:
      return <Truck className="h-5 w-5 text-indigo-500" />;
    case OrderStatusEnum.DELIVERED:
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case OrderStatusEnum.CANCELLED:
      return <XCircle className="h-5 w-5 text-red-500" />;
    case OrderStatusEnum.RETURNED:
      return <ArrowLeftCircle className="h-5 w-5 text-purple-500" />;
    case OrderStatusEnum.COMPLETED:
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />;
  }
};

// Durum geçiş sırası
const statusOrder = [
  OrderStatusEnum.PENDING,
  OrderStatusEnum.PROCESSING,
  OrderStatusEnum.SHIPPED,
  OrderStatusEnum.DELIVERED,
  OrderStatusEnum.COMPLETED,
];

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderStatusEnum | null>(
    null
  );
  const [statusNote, setStatusNote] = useState("");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusEnum | null>(
    null
  );
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchOrderData();
  }, [params.id]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(params.id);
      setOrder(data);
      setCurrentStatus(data.status);
    } catch (error: any) {
      console.error("Sipariş bilgileri yüklenirken hata:", error);
      setError(
        error.response?.data?.message || "Sipariş bilgileri yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  const openStatusUpdateDialog = (status: OrderStatusEnum) => {
    setSelectedStatus(status);
    setIsStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!order || !selectedStatus) return;

    try {
      setUpdatingStatus(true);
      await updateOrderStatus(order.id, selectedStatus);
      setCurrentStatus(selectedStatus);
      // Sipariş verisini güncelle
      fetchOrderData();
      setIsStatusDialogOpen(false);
      setStatusNote("");
    } catch (error: any) {
      console.error("Sipariş durumu güncellenirken hata:", error);
      setError(
        error.response?.data?.message ||
          "Sipariş durumu güncellenirken bir hata oluştu."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleExportPDF = async () => {
    if (!order) return;

    try {
      setIsExporting(true);
      await exportOrderToPDF(order);
    } catch (error) {
      console.error("PDF oluşturulurken hata:", error);
      setError("PDF raporu oluşturulamadı.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (!order) return;
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Hata</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sipariş Detayları</h1>
          <Button variant="outline" onClick={() => router.push("/orders")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Sipariş Listesine Dön
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>Sipariş bulunamadı</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Durum zaman çizelgesi için indeksleri hesaplama
  const currentStatusIndex = statusOrder.indexOf(order.status);
  const isSpecialStatus = !statusOrder.includes(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sipariş #{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            {new Date(order.createdAt!).toLocaleDateString("tr-TR")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button variant="outline" onClick={() => router.push("/orders")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Sipariş Listesine Dön
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Yazdır
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <FileDown className="mr-2 h-4 w-4" />
            {isExporting ? "Oluşturuluyor..." : "PDF İndir"}
          </Button>
          <Button onClick={() => router.push(`/orders/${params.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Düzenle
          </Button>
        </div>
      </div>

      {/* Durum Güncellemesi */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Sipariş Durumu</CardTitle>
          <CardDescription>
            Mevcut durum:{" "}
            <Badge className={getOrderStatusColor(order.status)}>
              {getOrderStatusLabel(order.status)}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSpecialStatus ? (
            <div className="flex items-center space-x-4 mb-4">
              <StatusIcon status={order.status} />
              <div>
                <h3 className="font-medium">
                  {getOrderStatusLabel(order.status)}
                </h3>
                {order.status === OrderStatusEnum.CANCELLED && (
                  <p className="text-sm text-muted-foreground">
                    Bu sipariş iptal edilmiş. Durumu değiştirmek için siparişi
                    tekrar aktifleştirmeniz gerekiyor.
                  </p>
                )}
                {order.status === OrderStatusEnum.RETURNED && (
                  <p className="text-sm text-muted-foreground">
                    Bu sipariş iade edilmiş.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-between mb-2 px-2">
                {statusOrder.map((status, index) => (
                  <div key={status} className="flex flex-col items-center">
                    <div
                      className={`rounded-full p-1 cursor-pointer transition-all ${
                        index <= currentStatusIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      onClick={() => openStatusUpdateDialog(status)}
                    >
                      <StatusIcon status={status} />
                    </div>
                    <span className="text-xs mt-1 text-center max-w-24 truncate">
                      {getOrderStatusLabel(status)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bağlantı çizgisi */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-primary -z-10"
                style={{
                  width: `${
                    currentStatusIndex >= 0
                      ? (currentStatusIndex / (statusOrder.length - 1)) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Son güncelleme: {new Date(order.updatedAt!).toLocaleString("tr-TR")}
          </div>
          <Dialog
            open={isStatusDialogOpen}
            onOpenChange={setIsStatusDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>Durumu Güncelle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sipariş Durumunu Güncelle</DialogTitle>
                <DialogDescription>
                  Sipariş durumunu değiştirmek için aşağıdan yeni bir durum
                  seçin
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Yeni Durum</Label>
                  <Select
                    value={selectedStatus || ""}
                    onValueChange={(value) =>
                      setSelectedStatus(value as OrderStatusEnum)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(OrderStatusEnum).map((status) => (
                        <SelectItem key={status} value={status}>
                          {getOrderStatusLabel(status as OrderStatusEnum)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="note">Not (İsteğe bağlı)</Label>
                  <Textarea
                    id="note"
                    placeholder="Durum değişikliği ile ilgili not ekleyin..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsStatusDialogOpen(false)}
                >
                  İptal
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={!selectedStatus || updatingStatus}
                >
                  {updatingStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
                      Güncelleniyor...
                    </>
                  ) : (
                    "Durumu Güncelle"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {/* Yazdırma başlığı */}
      <div className="hidden print:block print:mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Sipariş Detay Raporu</h1>
          <p className="text-xl">Sipariş #{order.orderNumber}</p>
          <p className="text-gray-500">
            {new Date(order.createdAt!).toLocaleDateString("tr-TR")}
          </p>
        </div>

        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold mb-2">Firma Bilgileri</h2>
            <p>Türkçe E-Ticaret</p>
            <p>+90 555 123 4567</p>
            <p>info@turkceeticaret.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold mb-2">Müşteri Bilgileri</h2>
            <p>
              {order.customer?.firstName} {order.customer?.lastName}
            </p>
            <p>{order.customer?.email}</p>
            <p>{order.customer?.phone}</p>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold mb-2">Sipariş Durumu</h2>
            <p>{getOrderStatusLabel(order.status)}</p>
            <p>Ödeme: {getPaymentTypeLabel(order.paymentType)}</p>
            <p>Ödeme Durumu: {order.paymentStatus ? "Ödendi" : "Beklemede"}</p>
          </div>
          {order.shippingAddress && (
            <div className="text-right">
              <h2 className="text-lg font-bold mb-2">Teslimat Bilgileri</h2>
              <p>{order.shippingAddress}</p>
              {order.trackingNumber && <p>Takip No: {order.trackingNumber}</p>}
              {order.carrierName && <p>Kargo: {order.carrierName}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ana Detaylar */}
        <Card className="lg:col-span-2">
          <CardHeader className="print:pb-2">
            <CardTitle>Sipariş Detayları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sipariş Kalemleri */}
            <div>
              <h3 className="text-lg font-medium mb-3">Ürünler</h3>
              <div className="rounded-md border print:border-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ürün</TableHead>
                      <TableHead>Birim Fiyat</TableHead>
                      <TableHead>Miktar</TableHead>
                      <TableHead>İndirim</TableHead>
                      <TableHead className="text-right">Toplam</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-muted-foreground">
                            SKU: {item.productSku}
                          </div>
                        </TableCell>
                        <TableCell>{item.unitPrice.toFixed(2)} ₺</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {item.discount
                            ? `${item.discount.toFixed(2)} ₺`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.totalPrice.toFixed(2)} ₺
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Sipariş Notları */}
            {order.notes && (
              <div>
                <h3 className="text-lg font-medium mb-2">Notlar</h3>
                <div className="bg-muted/50 p-3 rounded-md print:bg-transparent print:p-0 print:border print:border-dashed print:border-gray-300 print:p-2">
                  <p>{order.notes}</p>
                </div>
              </div>
            )}

            {/* Teslimat Bilgileri */}
            {order.shippingAddress && (
              <div className="print:hidden">
                <h3 className="text-lg font-medium mb-2">Teslimat Bilgileri</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <p>{order.shippingAddress}</p>
                </div>

                {order.trackingNumber && (
                  <div className="mt-2 ml-6">
                    <span className="text-sm font-medium">Takip No: </span>
                    <span>{order.trackingNumber}</span>
                  </div>
                )}

                {order.carrierName && (
                  <div className="mt-1 ml-6">
                    <span className="text-sm font-medium">Kargo Firması: </span>
                    <span>{order.carrierName}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Yan Panel */}
        <div className="space-y-6">
          {/* Müşteri Bilgileri */}
          <Card className="print:hidden">
            <CardHeader>
              <CardTitle>Müşteri Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">
                    {order.customer && getFullName(order.customer)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.customer?.email}
                  </div>
                </div>
              </div>

              {order.customer?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer.phone}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/customers/${order.customerId}`)}
              >
                <User className="mr-2 h-4 w-4" /> Müşteri Detayları
              </Button>
            </CardFooter>
          </Card>

          {/* Ödeme Bilgileri */}
          <Card>
            <CardHeader className="print:pb-2">
              <CardTitle>Ödeme Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Durum:</span>
                <Badge variant={order.paymentStatus ? "secondary" : "outline"}>
                  {order.paymentStatus ? "Ödendi" : "Bekliyor"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Ödeme Yöntemi:</span>
                <span>{getPaymentTypeLabel(order.paymentType)}</span>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ara Toplam:</span>
                  <span>
                    {order.items
                      .reduce((total, item) => total + item.totalPrice, 0)
                      .toFixed(2)}{" "}
                    ₺
                  </span>
                </div>

                {(order.shippingFee ?? 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kargo:</span>
                    <span>{(order.shippingFee ?? 0).toFixed(2)} ₺</span>
                  </div>
                )}

                {(order.tax ?? 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vergi:</span>
                    <span>{(order.tax ?? 0).toFixed(2)} ₺</span>
                  </div>
                )}

                {(order.discount ?? 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">İndirim:</span>
                    <span>-{(order.discount ?? 0).toFixed(2)} ₺</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Toplam:</span>
                  <span>{order.totalAmount.toFixed(2)} ₺</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Yazdırma altbilgisi */}
      <div className="hidden print:block print:mt-8 print:border-t print:pt-4 print:text-center print:text-sm print:text-gray-500">
        <p>
          Bu belge {new Date().toLocaleDateString("tr-TR")} tarihinde
          oluşturulmuştur.
        </p>
        <p>Türkçe E-Ticaret | www.turkceeticaret.com</p>
      </div>
    </div>
  );
}
