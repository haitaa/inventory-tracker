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
  Calendar,
  CalendarClock,
  Info,
  ExternalLink,
  DollarSign,
  ArrowRight,
  Smartphone,
  Monitor,
  Headphones,
  Camera,
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
import dynamic from "next/dynamic";

// Durum simgesi bileşeni
const StatusIcon = ({ status }: { status: OrderStatusEnum }) => {
  switch (status) {
    case OrderStatusEnum.PENDING:
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case OrderStatusEnum.PROCESSING:
      return <Package className="h-5 w-5 text-blue-500" />;
    case OrderStatusEnum.PAID:
      return <CreditCard className="h-5 w-5 text-green-500" />;
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

// Harita bileşeni
// Dinamik olarak import ediyoruz çünkü Leaflet sadece client tarafında çalışır
const DeliveryMapComponent = dynamic(
  () => import("@/components/orders/DeliveryMap"),
  {
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">Harita yükleniyor...</p>
      </div>
    ),
    ssr: false,
  }
);

// Teslimat durumu bileşeni
type DeliveryStatusType =
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered";

function DeliveryStatus({
  status,
  date,
  active,
}: {
  status: DeliveryStatusType;
  date: Date;
  active: boolean;
}) {
  const statuses = {
    picked_up: {
      title: "Kargo Teslim Alındı",
      icon: (
        <Package
          className={`h-5 w-5 ${active ? "text-blue-500" : "text-gray-400"}`}
        />
      ),
    },
    in_transit: {
      title: "Taşınıyor",
      icon: (
        <Truck
          className={`h-5 w-5 ${active ? "text-blue-500" : "text-gray-400"}`}
        />
      ),
    },
    out_for_delivery: {
      title: "Dağıtıma Çıktı",
      icon: (
        <Truck
          className={`h-5 w-5 ${active ? "text-green-500" : "text-gray-400"}`}
        />
      ),
    },
    delivered: {
      title: "Teslim Edildi",
      icon: (
        <CheckCircle
          className={`h-5 w-5 ${active ? "text-green-600" : "text-gray-400"}`}
        />
      ),
    },
  };

  return (
    <div className="flex items-center space-x-3">
      <div
        className={`p-2 rounded-full ${active ? "bg-blue-100" : "bg-gray-100"}`}
      >
        {statuses[status].icon}
      </div>
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${active ? "text-gray-900" : "text-gray-500"}`}
        >
          {statuses[status].title}
        </p>
        <p className="text-xs text-gray-500">
          {date.toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <div>
        {active && (
          <Badge
            variant="outline"
            className={
              status === "delivered"
                ? "bg-green-50 text-green-700 border-green-200"
                : ""
            }
          >
            {status === "delivered" ? "Tamamlandı" : "Aktif"}
          </Badge>
        )}
      </div>
    </div>
  );
}

// Ürün listesi alt bileşeni
const ProductImage = ({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) => {
  // Ürün tipi veya kategorisine göre farklı ikonlar göster
  // Gerçek uygulamada burada ürün API'sinden resim alınacak
  const getProductIcon = () => {
    // SKU'daki ilk harfi kullanarak rastgele bir renk ve ikon belirle
    const firstChar = productName.charAt(0).toLowerCase();

    // Farklı ürün türleri için ikonlar
    if (firstChar >= "a" && firstChar <= "e") {
      return <Smartphone className="h-10 w-10 text-blue-500" />;
    } else if (firstChar > "e" && firstChar <= "j") {
      return <Monitor className="h-10 w-10 text-purple-500" />;
    } else if (firstChar > "j" && firstChar <= "o") {
      return <Headphones className="h-10 w-10 text-green-500" />;
    } else if (firstChar > "o" && firstChar <= "t") {
      return <Camera className="h-10 w-10 text-amber-500" />;
    } else {
      return <Package className="h-10 w-10 text-rose-500" />;
    }
  };

  return (
    <div className="w-24 h-24 rounded-md flex items-center justify-center shrink-0 overflow-hidden bg-gradient-to-br from-muted/30 to-muted/60">
      <div className="flex flex-col items-center justify-center w-full h-full">
        {getProductIcon()}
        <div className="text-xs font-medium mt-1 text-center px-1 truncate w-full">
          {productName.split(" ")[0]}
        </div>
      </div>
    </div>
  );
};

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
            <CardTitle>Ürün Detayları</CardTitle>
            <CardDescription>
              Bu siparişte toplam {order.items.length} farklı ürün bulunuyor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ürün Listesi - Kartlar şeklinde */}
            <div className="grid grid-cols-1 gap-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row gap-4 bg-muted/30 rounded-lg p-4 border border-muted"
                >
                  <ProductImage
                    productId={item.productId}
                    productName={item.productName}
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <h3 className="font-medium text-lg">
                        {item.productName}
                      </h3>
                      <span className="font-semibold">
                        {item.totalPrice.toFixed(2)} ₺
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <span>SKU: {item.productSku}</span>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Badge variant="outline" className="bg-primary/5">
                        {item.quantity} adet
                      </Badge>

                      <Badge variant="outline" className="bg-primary/5">
                        Birim: {item.unitPrice.toFixed(2)} ₺
                      </Badge>

                      {item.discount && item.discount > 0 && (
                        <Badge
                          variant="outline"
                          className="bg-orange-100 text-orange-700 border-orange-200"
                        >
                          {item.discount.toFixed(2)} ₺ indirim
                        </Badge>
                      )}
                    </div>

                    {item.notes && (
                      <div className="mt-2 text-sm bg-muted p-2 rounded-md">
                        <span className="font-medium">Not:</span> {item.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Sipariş Notları */}
            {order.notes && (
              <div>
                <h3 className="text-lg font-medium mb-2">Sipariş Notları</h3>
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

          {/* Sipariş İşlem Geçmişi */}
          {order?.logs && order.logs.length > 0 && (
            <Card className="print:hidden">
              <CardHeader>
                <CardTitle>İşlem Geçmişi</CardTitle>
                <CardDescription>
                  Sipariş ile ilgili yapılan tüm işlemler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {order.logs.map((log, index) => {
                    // Log detaylarını JSON formatından parse et (eğer varsa)
                    const details = log.details
                      ? JSON.parse(log.details)
                      : null;

                    // Log tipine göre ikon belirleme
                    let LogIcon = Info;
                    if (log.message.includes("oluşturuldu")) {
                      LogIcon = ShoppingBag;
                    } else if (log.message.includes("durum")) {
                      LogIcon = Clock;
                    } else if (log.message.includes("Ödeme")) {
                      LogIcon = DollarSign;
                    } else if (log.message.includes("Kargo")) {
                      LogIcon = Truck;
                    } else if (log.message.includes("iptal")) {
                      LogIcon = XCircle;
                    }

                    return (
                      <div
                        key={log.id}
                        className={`relative pl-10 py-4 ${
                          index !== (order.logs?.length ?? 0) - 1
                            ? "border-l-2 border-l-gray-200 ml-4"
                            : ""
                        }`}
                      >
                        {/* Solda timeline çizgisi ve ikon */}
                        <div
                          className={`absolute -left-2 flex items-center justify-center w-8 h-8 rounded-full z-10 ${
                            log.status
                              ? getOrderStatusColor(log.status)
                                  .replace("text-", "text-white ")
                                  .replace("bg-", "bg-")
                              : "bg-gray-200"
                          }`}
                        >
                          <LogIcon className="h-4 w-4 text-white" />
                        </div>

                        {/* Tarih gösterimi - solda */}
                        <div className="absolute left-10 top-4 text-xs font-medium text-gray-500 flex items-center">
                          <CalendarClock className="h-3 w-3 mr-1" />
                          <time dateTime={log.createdAt}>
                            {new Date(log.createdAt).toLocaleString("tr-TR", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </div>

                        {/* Log içeriği */}
                        <div className="mt-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <p className="font-medium text-gray-900">
                            {log.message}
                          </p>

                          {/* Kullanıcı bilgisi */}
                          {log.user && (
                            <div className="mt-1 text-xs text-gray-500 flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              <span>{log.user.username}</span>
                            </div>
                          )}

                          {/* Detaylar */}
                          {details && (
                            <div className="mt-2 space-y-1">
                              {/* Durum değişikliği */}
                              {details.previousStatus && details.newStatus && (
                                <div className="flex items-center space-x-2 text-xs">
                                  <Badge variant="outline">
                                    {getOrderStatusLabel(
                                      details.previousStatus as OrderStatusEnum
                                    )}
                                  </Badge>
                                  <ArrowRight className="h-3 w-3" />
                                  <Badge
                                    className={getOrderStatusColor(
                                      details.newStatus as OrderStatusEnum
                                    )}
                                  >
                                    {getOrderStatusLabel(
                                      details.newStatus as OrderStatusEnum
                                    )}
                                  </Badge>
                                </div>
                              )}

                              {/* Ödeme durumu değişikliği */}
                              {details.previousPaymentStatus !== undefined &&
                                details.newPaymentStatus !== undefined && (
                                  <div className="text-xs text-gray-600">
                                    Ödeme durumu:{" "}
                                    {details.previousPaymentStatus
                                      ? "Ödendi"
                                      : "Beklemede"}{" "}
                                    →{" "}
                                    {details.newPaymentStatus
                                      ? "Ödendi"
                                      : "Beklemede"}
                                  </div>
                                )}

                              {/* Kargo bilgileri */}
                              {details.trackingNumber && (
                                <div className="text-xs text-gray-600">
                                  Kargo takip no: {details.trackingNumber}
                                </div>
                              )}

                              {details.carrierName && (
                                <div className="text-xs text-gray-600">
                                  Kargo firması: {details.carrierName}
                                </div>
                              )}

                              {/* Toplu güncelleme */}
                              {details.bulkUpdate && (
                                <div className="text-xs italic text-amber-600">
                                  Bu işlem toplu güncelleme işlemi ile
                                  yapılmıştır
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Teslimat Haritası - eğer kargo bilgileri varsa göster */}
        {order.trackingNumber && order.carrierName && order.shippingAddress && (
          <Card className="lg:col-span-3 print:hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5 text-primary" />
                Teslimat Takibi
              </CardTitle>
              <CardDescription>Kargo durumu ve teslimat konumu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Kargo bilgileri */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/50 p-4 rounded-md">
                <div>
                  <h4 className="text-sm font-medium mb-1">Kargo Firması</h4>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{order.carrierName}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Takip Numarası</h4>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{order.trackingNumber}</span>

                    {/* Kargo firmasının takip sayfasına yönlendirme butonu */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-7 px-2"
                      onClick={() => {
                        // Kargo firmasına göre doğru takip URL'ini oluştur
                        let trackingUrl = "";
                        const trackingNo = order.trackingNumber;

                        if (order.carrierName?.toLowerCase().includes("aras")) {
                          trackingUrl = `https://kargotakip.araskargo.com.tr/track/${trackingNo}`;
                        } else if (
                          order.carrierName?.toLowerCase().includes("yurtiçi")
                        ) {
                          trackingUrl = `https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${trackingNo}`;
                        } else if (
                          order.carrierName?.toLowerCase().includes("mng")
                        ) {
                          trackingUrl = `https://www.mngkargo.com.tr/gonderi-takip/?${trackingNo}`;
                        } else if (
                          order.carrierName?.toLowerCase().includes("ptt")
                        ) {
                          trackingUrl = `https://gonderitakip.ptt.gov.tr/Track/Verify?q=${trackingNo}`;
                        } else {
                          // Genel bir URL, spesifik kargo firmalarına yönlendirilebilir
                          trackingUrl = `https://www.google.com/search?q=${encodeURIComponent(order.carrierName + " kargo takip " + trackingNo)}`;
                        }

                        // Yeni sekmede aç
                        window.open(trackingUrl, "_blank");
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">
                        Kargo firması sitesinde takip et
                      </span>
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Tahmini Teslimat</h4>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {calculateEstimatedDelivery(
                        order.updatedAt || order.createdAt
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kargo durumu */}
              <div className="bg-muted/30 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-3">Kargo Durumu</h4>
                <div className="space-y-2">
                  <DeliveryStatus
                    status="picked_up"
                    date={
                      new Date(
                        order?.updatedAt || order?.createdAt || new Date()
                      )
                    }
                    active={true}
                  />
                  <DeliveryStatus
                    status="in_transit"
                    date={addDays(
                      new Date(
                        order?.updatedAt || order?.createdAt || new Date()
                      ),
                      1
                    )}
                    active={
                      order?.status === "SHIPPED" ||
                      order?.status === "DELIVERED"
                    }
                  />
                  <DeliveryStatus
                    status="out_for_delivery"
                    date={addDays(
                      new Date(
                        order?.updatedAt || order?.createdAt || new Date()
                      ),
                      2
                    )}
                    active={order?.status === "DELIVERED"}
                  />
                  <DeliveryStatus
                    status="delivered"
                    date={addDays(
                      new Date(
                        order?.updatedAt || order?.createdAt || new Date()
                      ),
                      3
                    )}
                    active={order?.status === "DELIVERED"}
                  />
                </div>
              </div>

              {/* Teslimat Haritası */}
              <div className="h-80 rounded-md overflow-hidden border">
                <DeliveryMapComponent
                  address={order.shippingAddress}
                  carrierName={order.carrierName}
                  orderStatus={order.status}
                />
              </div>
            </CardContent>
          </Card>
        )}
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

// Yardımcı fonksiyonlar
// Tahmini teslimat tarihi hesaplama
function calculateEstimatedDelivery(dateStr: string | undefined): string {
  if (!dateStr) {
    return new Date().toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const baseDate = new Date(dateStr);
  // 3-5 iş günü ekle
  const estimatedDate = addDays(baseDate, 4); // Ortalama 4 gün
  return estimatedDate.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Tarihe gün ekleme
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
