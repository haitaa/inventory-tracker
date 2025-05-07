"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { CustomerType, OrderType } from "@/types/schema";
import {
  getCustomerById,
  getCustomerOrders,
  deleteCustomer,
  getFullName,
} from "@/app/lib/customerService";
import {
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentTypeLabel,
} from "@/app/lib/orderService";

export default function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomerData();
  }, [params.id]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const customerData = await getCustomerById(params.id);
      setCustomer(customerData);

      const customerOrders = await getCustomerOrders(params.id);
      setOrders(customerOrders);
    } catch (error: any) {
      console.error("Müşteri bilgileri yüklenirken hata:", error);
      setError(
        error.response?.data?.message || "Müşteri bilgileri yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) {
      try {
        await deleteCustomer(params.id);
        router.push("/customers");
      } catch (error: any) {
        console.error("Müşteri silinirken hata:", error);
        setError(
          error.response?.data?.message || "Müşteri silinirken bir hata oluştu."
        );
      }
    }
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

  if (!customer) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Müşteri Detayları</h1>
          <Button variant="outline" onClick={() => router.push("/customers")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Müşteri Listesine Dön
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>Müşteri bulunamadı</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Müşteri Detayları</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push("/customers")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Müşteri Listesine Dön
          </Button>
          <Button onClick={() => router.push(`/customers/${params.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Düzenle
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Sil
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Müşteri Bilgileri */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Kişisel Bilgiler</CardTitle>
            <CardDescription>Temel müşteri bilgileri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {getFullName(customer)}
                </h3>
                <p className="text-muted-foreground">
                  Müşteri ID: {customer.id}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">E-posta:</span>
                <span>{customer.email || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Telefon:</span>
                <span>{customer.phone || "-"}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-3">Adres Bilgileri</h3>
              {customer.address ||
              customer.city ||
              customer.state ||
              customer.country ? (
                <div className="space-y-2">
                  {customer.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <span>{customer.address}</span>
                    </div>
                  )}
                  {(customer.city ||
                    customer.state ||
                    customer.postalCode ||
                    customer.country) && (
                    <div className="ml-6">
                      {customer.city && <span>{customer.city}, </span>}
                      {customer.state && <span>{customer.state} </span>}
                      {customer.postalCode && (
                        <span>{customer.postalCode}, </span>
                      )}
                      {customer.country && <span>{customer.country}</span>}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Adres bilgisi girilmemiş
                </p>
              )}
            </div>

            {customer.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-2">Notlar</h3>
                  <p className="text-muted-foreground">{customer.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Özet Bilgiler */}
        <Card>
          <CardHeader>
            <CardTitle>Özet Bilgiler</CardTitle>
            <CardDescription>Müşteri ile ilgili istatistikler</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
              <span className="font-medium">Toplam Sipariş</span>
              <Badge variant="secondary">{orders.length}</Badge>
            </div>

            <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
              <span className="font-medium">Son Sipariş</span>
              <Badge variant="secondary">
                {orders.length > 0
                  ? new Date(orders[0].createdAt!).toLocaleDateString("tr-TR")
                  : "-"}
              </Badge>
            </div>

            <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
              <span className="font-medium">Toplam Harcama</span>
              <Badge variant="secondary">
                {orders.length > 0
                  ? `${orders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2)} ₺`
                  : "-"}
              </Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                router.push(`/orders/new?customerId=${customer.id}`)
              }
            >
              <Package className="mr-2 h-4 w-4" /> Yeni Sipariş Oluştur
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Siparişler */}
      <Card>
        <CardHeader>
          <CardTitle>Siparişler</CardTitle>
          <CardDescription>Müşterinin tüm siparişleri</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sipariş No</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Ödeme Tipi</TableHead>
                    <TableHead>Toplam</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt!).toLocaleDateString("tr-TR")}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/orders/${order.id}`)}
                        >
                          Detaylar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Henüz Sipariş Yok</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Bu müşteriye ait sipariş bulunmuyor.
              </p>
              <Button
                className="mt-4"
                onClick={() =>
                  router.push(`/orders/new?customerId=${customer.id}`)
                }
              >
                <Package className="mr-2 h-4 w-4" /> Yeni Sipariş Oluştur
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
