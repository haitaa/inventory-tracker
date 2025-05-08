"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreditCard, Filter, Search, PlusCircle } from "lucide-react";
import { PaymentType, PaymentStatusEnum, OrderType } from "@/types/schema";

// Ödeme durumu için renk ve etiketler
export const getPaymentStatusColor = (status: PaymentStatusEnum): string => {
  const statusColors = {
    [PaymentStatusEnum.PENDING]: "bg-yellow-100 text-yellow-800",
    [PaymentStatusEnum.COMPLETED]: "bg-green-100 text-green-800",
    [PaymentStatusEnum.FAILED]: "bg-red-100 text-red-800",
    [PaymentStatusEnum.CANCELLED]: "bg-gray-100 text-gray-800",
    [PaymentStatusEnum.REFUNDED]: "bg-purple-100 text-purple-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

export const getPaymentStatusLabel = (status: PaymentStatusEnum): string => {
  const statusLabels = {
    [PaymentStatusEnum.PENDING]: "Beklemede",
    [PaymentStatusEnum.COMPLETED]: "Tamamlandı",
    [PaymentStatusEnum.FAILED]: "Başarısız",
    [PaymentStatusEnum.CANCELLED]: "İptal Edildi",
    [PaymentStatusEnum.REFUNDED]: "İade Edildi",
  };
  return statusLabels[status] || "Bilinmiyor";
};

// Örnek veri - gerçek uygulamada API'den gelecek
const mockPayments: PaymentType[] = [
  {
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
  },
  {
    id: "2",
    orderId: "1002",
    amount: 120.5,
    currency: "TRY",
    paymentMethod: "bank_transfer",
    transactionId: "TXN-789012",
    transactionDate: new Date().toISOString(),
    status: PaymentStatusEnum.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    orderId: "1003",
    amount: 250.0,
    currency: "TRY",
    paymentMethod: "paypal",
    transactionId: "TXN-345678",
    transactionDate: new Date().toISOString(),
    status: PaymentStatusEnum.FAILED,
    errorMessage: "İşlem sırasında hata oluştu",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    orderId: "1004",
    amount: 199.9,
    currency: "TRY",
    paymentMethod: "credit_card",
    transactionId: "TXN-901234",
    transactionDate: new Date().toISOString(),
    status: PaymentStatusEnum.REFUNDED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentType[]>(mockPayments);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // API'den ödemeleri getir (gerçek uygulamada)
  useEffect(() => {
    // Gerçek uygulamada burası API'den ödemeleri çekecek
    setLoading(true);
    // Örnek API çağrısı simülasyonu
    setTimeout(() => {
      setPayments(mockPayments);
      setLoading(false);
    }, 500);
  }, []);

  // Filtreleme ve arama fonksiyonu
  const filteredPayments = payments.filter((payment) => {
    // Durum filtreleme
    if (statusFilter !== "all" && payment.status !== statusFilter) {
      return false;
    }

    // Arama filtreleme (işlem ID, sipariş ID veya ödeme yöntemi)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        payment.transactionId.toLowerCase().includes(searchLower) ||
        payment.orderId.toLowerCase().includes(searchLower) ||
        payment.paymentMethod.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ödeme İşlemleri</h1>
        <Button onClick={() => router.push("/payments/new")}>
          <PlusCircle className="mr-2 h-4 w-4" /> Yeni Ödeme
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ödemeler</CardTitle>
          <CardDescription>
            Sistem üzerindeki tüm ödeme işlemlerini görüntüleyin ve yönetin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtreleme ve Arama */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="İşlem ID, Sipariş ID veya ödeme yöntemi ara..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-60">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Durum Filtrele" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value={PaymentStatusEnum.PENDING}>
                    Beklemede
                  </SelectItem>
                  <SelectItem value={PaymentStatusEnum.COMPLETED}>
                    Tamamlandı
                  </SelectItem>
                  <SelectItem value={PaymentStatusEnum.FAILED}>
                    Başarısız
                  </SelectItem>
                  <SelectItem value={PaymentStatusEnum.CANCELLED}>
                    İptal Edildi
                  </SelectItem>
                  <SelectItem value={PaymentStatusEnum.REFUNDED}>
                    İade Edildi
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Aktif filtreler */}
          {(statusFilter !== "all" || searchTerm) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {statusFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="px-3 py-1 flex gap-1 items-center"
                >
                  <span>
                    Durum:{" "}
                    {getPaymentStatusLabel(statusFilter as PaymentStatusEnum)}
                  </span>
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="ml-1 hover:bg-gray-300 p-0.5 rounded-full"
                  >
                    &times;
                  </button>
                </Badge>
              )}
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="px-3 py-1 flex gap-1 items-center"
                >
                  <span>Arama: {searchTerm}</span>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:bg-gray-300 p-0.5 rounded-full"
                  >
                    &times;
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Ödeme Tablosu */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-muted/50">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Ödeme bulunamadı</h3>
              <p className="text-muted-foreground mt-2">
                Arama kriterlerinize uygun ödeme işlemi bulunmamaktadır.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>İşlem ID</TableHead>
                    <TableHead>Sipariş ID</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>Ödeme Yöntemi</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.transactionId}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() =>
                            router.push(`/orders/${payment.orderId}`)
                          }
                        >
                          {payment.orderId}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {payment.amount.toFixed(2)} {payment.currency}
                      </TableCell>
                      <TableCell>
                        {payment.paymentMethod === "credit_card"
                          ? "Kredi Kartı"
                          : payment.paymentMethod === "bank_transfer"
                            ? "Banka Havalesi"
                            : payment.paymentMethod === "paypal"
                              ? "PayPal"
                              : payment.paymentMethod}
                      </TableCell>
                      <TableCell>
                        {new Date(payment.transactionDate).toLocaleDateString(
                          "tr-TR"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getPaymentStatusColor(payment.status)}
                        >
                          {getPaymentStatusLabel(payment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/payments/${payment.id}`)}
                        >
                          Detay
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
