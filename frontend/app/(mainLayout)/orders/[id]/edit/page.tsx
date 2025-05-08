"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Save, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  updateOrder,
  OrderInput,
  OrderItemInput,
  getOrderById,
} from "@/app/lib/orderService";
import {
  PaymentTypeEnum,
  OrderStatusEnum,
  CustomerType,
  OrderType,
} from "@/types/schema";
import { getCustomers, getFullName } from "@/app/lib/customerService";
import { getProducts, ProductType } from "@/app/lib/productService";
import { useAuth } from "@/app/lib/auth";

// Sipariş formu için doğrulama şeması
const orderItemSchema = z.object({
  productId: z.string().min(1, { message: "Ürün seçilmesi gerekiyor" }),
  productName: z.string(),
  productSku: z.string(),
  quantity: z
    .number()
    .min(1, { message: "Miktar en az 1 olmalıdır" })
    .default(1),
  unitPrice: z.number().min(0, { message: "Fiyat 0'dan büyük olmalıdır" }),
  totalPrice: z.number().default(0),
  discount: z.number().min(0).default(0),
  taxRate: z.number().min(0).default(0),
});

const orderSchema = z.object({
  customerId: z.string().min(1, { message: "Müşteri seçilmesi gerekiyor" }),
  items: z
    .array(orderItemSchema)
    .min(1, { message: "En az bir ürün eklenmesi gerekiyor" }),
  paymentType: z.string().default(PaymentTypeEnum.CASH),
  paymentStatus: z.boolean().default(false),
  status: z.string().default(OrderStatusEnum.PENDING),
  shippingFee: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  notes: z.string().optional(),
  shippingAddress: z.string().optional(),
  trackingNumber: z.string().optional(),
  carrierName: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<OrderType | null>(null);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  // Form oluştur
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema) as any,
    defaultValues: {
      customerId: "",
      items: [],
      paymentType: PaymentTypeEnum.CASH,
      paymentStatus: false,
      status: OrderStatusEnum.PENDING,
      shippingFee: 0,
      tax: 0,
      discount: 0,
      notes: "",
      shippingAddress: "",
      trackingNumber: "",
      carrierName: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Sipariş verisini ve diğer verileri yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        setError(null);

        // Kullanıcı kontrolü
        if (authLoading) return;
        if (!user) {
          router.push("/auth/sign-in");
          return;
        }

        // Sipariş ve diğer verileri eşzamanlı olarak yükle
        const [orderData, customersData, productsData] = await Promise.all([
          getOrderById(params.id),
          getCustomers(),
          getProducts(),
        ]);

        setOrder(orderData);
        setCustomers(customersData);
        setProducts(productsData);

        // Form alanlarını sipariş verileriyle doldur
        form.reset({
          customerId: orderData.customerId,
          items: orderData.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productSku: item.productSku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            discount: item.discount || 0,
            taxRate: item.taxRate || 0,
          })),
          paymentType: orderData.paymentType,
          paymentStatus: orderData.paymentStatus,
          status: orderData.status,
          shippingFee: orderData.shippingFee || 0,
          tax: orderData.tax || 0,
          discount: orderData.discount || 0,
          notes: orderData.notes || "",
          shippingAddress: orderData.shippingAddress || "",
          trackingNumber: orderData.trackingNumber || "",
          carrierName: orderData.carrierName || "",
        });

        // Toplam tutarı hesapla
        const itemsTotal = orderData.items.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
        setSubtotal(itemsTotal);
        setTotal(orderData.totalAmount);
      } catch (error) {
        console.error("Veriler yüklenirken hata:", error);
        setError("Veriler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [router, user, authLoading, params.id, form]);

  // Form değişikliklerinde toplam tutarı yeniden hesapla
  useEffect(() => {
    const items = form.watch("items") || [];
    const shippingFee = form.watch("shippingFee") || 0;
    const discount = form.watch("discount") || 0;
    const tax = form.watch("tax") || 0;

    const calculatedSubtotal = items.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    );

    setSubtotal(calculatedSubtotal);
    setTotal(calculatedSubtotal + shippingFee + tax - discount);
  }, [form.watch()]);

  const handleProductSelect = (productId: string, index: number) => {
    const selectedProduct = products.find((p) => p.id === productId);
    if (selectedProduct) {
      form.setValue(`items.${index}.productName`, selectedProduct.name);
      form.setValue(`items.${index}.productSku`, selectedProduct.sku);
      form.setValue(`items.${index}.unitPrice`, selectedProduct.price);
      updateItemTotal(index);
    }
  };

  const updateItemTotal = (index: number) => {
    const quantity = form.getValues(`items.${index}.quantity`) || 1;
    const unitPrice = form.getValues(`items.${index}.unitPrice`) || 0;
    const discount = form.getValues(`items.${index}.discount`) || 0;
    const totalPrice = quantity * unitPrice - discount;
    form.setValue(`items.${index}.totalPrice`, totalPrice);
  };

  const handleAddItem = () => {
    append({
      productId: "",
      productName: "",
      productSku: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      discount: 0,
      taxRate: 0,
    });
  };

  const onSubmit = async (data: OrderFormValues) => {
    try {
      setLoading(true);
      setError(null);

      // API'ye gönderilecek veriyi hazırla
      const orderInput: Partial<OrderInput> = {
        customerId: data.customerId,
        items: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          taxRate: item.taxRate,
        })),
        paymentType: data.paymentType as PaymentTypeEnum,
        paymentStatus: data.paymentStatus,
        status: data.status as OrderStatusEnum,
        shippingFee: data.shippingFee,
        tax: data.tax,
        discount: data.discount,
        notes: data.notes,
        shippingAddress: data.shippingAddress,
        trackingNumber: data.trackingNumber,
        carrierName: data.carrierName,
      };

      await updateOrder(params.id, orderInput);
      router.push(`/orders/${params.id}`);
    } catch (err: any) {
      console.error("Sipariş güncellenirken hata:", err);
      setError(
        err.response?.data?.message || "Sipariş güncellenirken bir hata oluştu."
      );
      setLoading(false);
    }
  };

  // Sayfa yüklenirken veya kullanıcı giriş yapmamışsa
  if (authLoading || fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa
  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Yetkisiz Erişim</AlertTitle>
        <AlertDescription>
          Bu sayfayı görüntülemek için giriş yapmalısınız.
        </AlertDescription>
      </Alert>
    );
  }

  // Sipariş bulunamadıysa
  if (!order) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Hata</AlertTitle>
        <AlertDescription>Sipariş bulunamadı.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Siparişi Düzenle</h1>
        <Button
          variant="outline"
          onClick={() => router.push(`/orders/${params.id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Siparişe Dön
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ana Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Müşteri Bilgileri */}
              <Card>
                <CardHeader>
                  <CardTitle>Müşteri Bilgileri</CardTitle>
                  <CardDescription>Sipariş için müşteri seçin</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Müşteri</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Müşteri seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {getFullName(customer)}{" "}
                                {customer.email && `(${customer.email})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Sipariş Kalemleri */}
              <Card>
                <CardHeader>
                  <CardTitle>Sipariş Kalemleri</CardTitle>
                  <CardDescription>
                    Sipariş için ürünleri ve miktarlarını belirleyin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fields.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-md border-muted">
                        <Package className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground mb-4">
                          Henüz ürün eklenmemiş
                        </p>
                        <Button type="button" onClick={handleAddItem}>
                          Ürün Ekle
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Ürün</TableHead>
                              <TableHead>Miktar</TableHead>
                              <TableHead>Birim Fiyat</TableHead>
                              <TableHead>İndirim</TableHead>
                              <TableHead>Toplam</TableHead>
                              <TableHead className="w-10"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {fields.map((field, index) => (
                              <TableRow key={field.id}>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.productId`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <Select
                                          onValueChange={(value) => {
                                            field.onChange(value);
                                            handleProductSelect(value, index);
                                          }}
                                          value={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Ürün seçin" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {products.map((product) => (
                                              <SelectItem
                                                key={product.id}
                                                value={product.id}
                                              >
                                                {product.name} ({product.sku})
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="mt-1 flex flex-col">
                                    <FormField
                                      control={form.control}
                                      name={`items.${index}.productName`}
                                      render={({ field }) => (
                                        <Input {...field} className="hidden" />
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name={`items.${index}.productSku`}
                                      render={({ field }) => (
                                        <Input {...field} className="hidden" />
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name={`items.${index}.totalPrice`}
                                      render={({ field }) => (
                                        <Input {...field} className="hidden" />
                                      )}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                      {form.watch(`items.${index}.productSku`)}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.quantity`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            type="number"
                                            min={1}
                                            onChange={(e) => {
                                              field.onChange(
                                                parseInt(e.target.value)
                                              );
                                              updateItemTotal(index);
                                            }}
                                            className="w-16"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.unitPrice`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <div className="flex items-center">
                                            <Input
                                              {...field}
                                              type="number"
                                              min={0}
                                              step={0.01}
                                              onChange={(e) => {
                                                field.onChange(
                                                  parseFloat(e.target.value)
                                                );
                                                updateItemTotal(index);
                                              }}
                                              className="w-24"
                                            />
                                            <span className="ml-1">₺</span>
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.discount`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <div className="flex items-center">
                                            <Input
                                              {...field}
                                              type="number"
                                              min={0}
                                              step={0.01}
                                              onChange={(e) => {
                                                field.onChange(
                                                  parseFloat(e.target.value)
                                                );
                                                updateItemTotal(index);
                                              }}
                                              className="w-24"
                                            />
                                            <span className="ml-1">₺</span>
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  {form
                                    .watch(`items.${index}.totalPrice`)
                                    .toFixed(2)}{" "}
                                  ₺
                                </TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={handleAddItem}
                    >
                      + Ürün Ekle
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Adres ve Kargo Bilgileri */}
              <Card>
                <CardHeader>
                  <CardTitle>Teslimat Bilgileri</CardTitle>
                  <CardDescription>
                    Sipariş için teslimat adresini ve kargo bilgilerini girin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teslimat Adresi</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Teslimat adresi girin"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="trackingNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Takip Numarası</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Kargo takip numarası"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="carrierName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kargo Firması</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Kargo firması adı"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notlar */}
              <Card>
                <CardHeader>
                  <CardTitle>Notlar</CardTitle>
                  <CardDescription>
                    Sipariş ile ilgili ekstra bilgiler
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Sipariş ile ilgili notlar"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Yan Panel */}
            <div className="space-y-6">
              {/* Sipariş Durumu */}
              <Card>
                <CardHeader>
                  <CardTitle>Sipariş Durumu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durum</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Durum seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={OrderStatusEnum.PENDING}>
                              Beklemede
                            </SelectItem>
                            <SelectItem value={OrderStatusEnum.PROCESSING}>
                              İşleniyor
                            </SelectItem>
                            <SelectItem value={OrderStatusEnum.PAID}>
                              Ödendi
                            </SelectItem>
                            <SelectItem value={OrderStatusEnum.SHIPPED}>
                              Kargoya Verildi
                            </SelectItem>
                            <SelectItem value={OrderStatusEnum.DELIVERED}>
                              Teslim Edildi
                            </SelectItem>
                            <SelectItem value={OrderStatusEnum.COMPLETED}>
                              Tamamlandı
                            </SelectItem>
                            <SelectItem value={OrderStatusEnum.CANCELLED}>
                              İptal Edildi
                            </SelectItem>
                            <SelectItem value={OrderStatusEnum.RETURNED}>
                              İade Edildi
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Ödeme Bilgileri */}
              <Card>
                <CardHeader>
                  <CardTitle>Ödeme Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ödeme Yöntemi</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Ödeme yöntemi seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={PaymentTypeEnum.CASH}>
                              Nakit
                            </SelectItem>
                            <SelectItem value={PaymentTypeEnum.CREDIT_CARD}>
                              Kredi Kartı
                            </SelectItem>
                            <SelectItem value={PaymentTypeEnum.BANK_TRANSFER}>
                              Banka Havalesi
                            </SelectItem>
                            <SelectItem value={PaymentTypeEnum.OTHER}>
                              Diğer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentStatus"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Ödeme Tamamlandı</FormLabel>
                          <FormDescription>
                            Eğer ödeme alındıysa işaretleyin
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Toplam Hesaplama */}
              <Card>
                <CardHeader>
                  <CardTitle>Sipariş Toplamı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ara Toplam:</span>
                      <span>{subtotal.toFixed(2)} ₺</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="shippingFee"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <FormLabel>Kargo Ücreti:</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Input
                                    {...field}
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-24"
                                  />
                                  <span className="ml-1">₺</span>
                                </div>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tax"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <FormLabel>Vergi:</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Input
                                    {...field}
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-24"
                                  />
                                  <span className="ml-1">₺</span>
                                </div>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <FormLabel>İndirim:</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Input
                                    {...field}
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-24"
                                  />
                                  <span className="ml-1">₺</span>
                                </div>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold text-lg">
                      <span>Toplam:</span>
                      <span>{total.toFixed(2)} ₺</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Siparişi Güncelle
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
