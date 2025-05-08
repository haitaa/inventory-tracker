"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  Calendar,
  Printer,
  Share2,
  FileDown,
  CreditCard,
  ReceiptText,
  ExternalLink,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { PaymentType, PaymentStatusEnum, OrderType } from "@/types/schema";
import { getPaymentStatusColor, getPaymentStatusLabel } from "../page";

// Örnek veri - gerçek uygulamada API'den gelecek
const mockPayment: PaymentType = {
  id: "1",
  orderId: "1001",
  amount: 450.99,
  currency: "TRY",
  paymentMethod: "credit_card",
  transactionId: "TXN-123456",
  transactionDate: new Date().toISOString(),
  status: PaymentStatusEnum.COMPLETED,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Örnek sipariş verisi
const mockOrder: OrderType = {
  id: "1001",
  orderNumber: "ORD-1001",
  userId: "1",
  customerId: "1",
  customer: {
    id: "1",
    userId: "1",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    email: "ahmet@ornek.com",
    phone: "+90 555 123 4567",
  },
  status: "PAID" as any,
  paymentType: "CREDIT_CARD" as any,
  paymentStatus: true,
  totalAmount: 450.99,
  items: [
    {
      id: "1",
      orderId: "1001",
      productId: "101",
      productName: "Akıllı Telefon X",
      productSku: "SKU-101",
      quantity: 1,
      unitPrice: 399.99,
      taxRate: 0.18,
      totalPrice: 399.99,
    },
    {
      id: "2",
      orderId: "1001",
      productId: "102",
      productName: "Telefon Kılıfı",
      productSku: "SKU-102",
      quantity: 2,
      unitPrice: 25.5,
      taxRate: 0.18,
      totalPrice: 51.0,
    },
  ],
  createdAt: "2023-09-15T14:30:00Z",
  updatedAt: "2023-09-15T14:35:00Z",
};

// Ödeme yöntemi adını formatla
const formatPaymentMethod = (method: string): string => {
  switch (method) {
    case "credit_card":
      return "Kredi Kartı";
    case "bank_transfer":
      return "Banka Havalesi";
    case "paypal":
      return "PayPal";
    case "pos":
      return "POS Cihazı";
    default:
      return method;
  }
};

export default function PaymentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentType | null>(null);
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API'den ödeme ve sipariş bilgilerini getir
  useEffect(() => {
    // Gerçek uygulamada API'den ödeme ve sipariş verilerini çekeriz
    setLoading(true);
    setTimeout(() => {
      // Gerçek uygulamada bu API çağrıları olacak
      // const fetchPayment = async () => {
      //   const response = await api.get(`/payments/${params.id}`);
      //   return response.data;
      // }
      // const fetchOrder = async (orderId) => {
      //   const response = await api.get(`/orders/${orderId}`);
      //   return response.data;
      // }

      setPayment(mockPayment);
      setOrder(mockOrder);
      setLoading(false);
    }, 800);
  }, [params.id]);

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

  if (!payment) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ödeme Detayları</h1>
          <Button variant="outline" onClick={() => router.push("/payments")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Ödemelere Dön
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>Ödeme kaydı bulunamadı</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ödeme #{payment.transactionId}</h1>
          <p className="text-muted-foreground">
            {new Date(payment.createdAt!).toLocaleDateString("tr-TR")}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/payments")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Ödemelere Dön
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ana Detaylar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ödeme Detayları</CardTitle>
            <CardDescription>
              İşlem detayları ve bağlantılı sipariş bilgileri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ödeme Özeti */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">
                      İşlem: {payment.transactionId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.transactionDate).toLocaleDateString(
                        "tr-TR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <Badge className={getPaymentStatusColor(payment.status)}>
                  {getPaymentStatusLabel(payment.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ödeme Yöntemi</p>
                  <p className="font-medium">
                    {formatPaymentMethod(payment.paymentMethod)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ödeme Tutarı</p>
                  <p className="font-medium">
                    {payment.amount.toFixed(2)} {payment.currency}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ödeme Tarihi</p>
                  <p className="font-medium">
                    {new Date(payment.transactionDate).toLocaleDateString(
                      "tr-TR"
                    )}
                  </p>
                </div>
              </div>

              {payment.status === PaymentStatusEnum.FAILED &&
                payment.errorMessage && (
                  <div className="mt-4 bg-red-50 border border-red-100 text-red-800 rounded p-3 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">Hata</p>
                      <p className="text-sm">{payment.errorMessage}</p>
                    </div>
                  </div>
                )}
            </div>

            {/* Bağlantılı Sipariş */}
            {order && (
              <div>
                <h2 className="text-lg font-medium mb-3">Bağlantılı Sipariş</h2>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sipariş No</TableHead>
                        <TableHead>Müşteri</TableHead>
                        <TableHead>Toplam Tutar</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          {order.customer?.firstName} {order.customer?.lastName}
                        </TableCell>
                        <TableCell>
                          {order.totalAmount.toFixed(2)} TRY
                        </TableCell>
                        <TableCell>
                          <Badge>{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/orders/${order.id}`)}
                          >
                            Siparişi Gör
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Sipariş Kalemleri */}
            {order && (
              <div>
                <h2 className="text-lg font-medium mb-3">Sipariş Kalemleri</h2>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ürün</TableHead>
                        <TableHead>Miktar</TableHead>
                        <TableHead>Birim Fiyat</TableHead>
                        <TableHead>Toplam</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div>
                              <p>{item.productName}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.productSku}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unitPrice.toFixed(2)} TRY</TableCell>
                          <TableCell>
                            {item.totalPrice.toFixed(2)} TRY
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

        {/* Yan Panel */}
        <div className="space-y-6">
          {/* Ödeme İşlemleri */}
          <Card>
            <CardHeader>
              <CardTitle>İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                disabled={payment.status !== PaymentStatusEnum.PENDING}
              >
                <ReceiptText className="mr-2 h-4 w-4" /> Makbuz Oluştur
              </Button>
              <Button variant="outline" className="w-full">
                <Printer className="mr-2 h-4 w-4" /> Yazdır
              </Button>
              <Button variant="outline" className="w-full">
                <FileDown className="mr-2 h-4 w-4" /> PDF İndir
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" /> Paylaş
              </Button>
            </CardContent>
          </Card>

          {/* Ödeme Durumu İşlemleri */}
          <Card>
            <CardHeader>
              <CardTitle>Ödeme Durumu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Durum:</span>
                <Badge className={getPaymentStatusColor(payment.status)}>
                  {getPaymentStatusLabel(payment.status)}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Ödeme Yöntemi:</span>
                <span>{formatPaymentMethod(payment.paymentMethod)}</span>
              </div>

              <Separator />

              <div className="space-y-4">
                {payment.status === PaymentStatusEnum.PENDING && (
                  <Button variant="outline" className="w-full">
                    <RotateCcw className="mr-2 h-4 w-4" /> Ödeme Durumunu
                    Kontrol Et
                  </Button>
                )}

                {(payment.status === PaymentStatusEnum.PENDING ||
                  payment.status === PaymentStatusEnum.FAILED) && (
                  <>
                    <Button className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" /> Yeniden Ödeme Yap
                    </Button>
                    <Button variant="destructive" className="w-full">
                      İptal Et
                    </Button>
                  </>
                )}

                {payment.status === PaymentStatusEnum.COMPLETED && (
                  <Button variant="destructive" className="w-full">
                    İade Talebi Oluştur
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ödeme Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>Ödeme Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">İşlem No:</span>
                <span className="font-mono">{payment.transactionId}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Oluşturulma:</span>
                <span>
                  {new Date(payment.createdAt!).toLocaleDateString("tr-TR")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Güncelleme:</span>
                <span>
                  {new Date(payment.updatedAt!).toLocaleDateString("tr-TR")}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Toplam:</span>
                <span>
                  {payment.amount.toFixed(2)} {payment.currency}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
