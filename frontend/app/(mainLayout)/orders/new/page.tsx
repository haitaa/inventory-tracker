"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2, ArrowLeft, Save, Package } from "lucide-react";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  createOrder,
  OrderInput,
  OrderItemInput,
} from "@/app/lib/orderService";
import { PaymentTypeEnum, CustomerType } from "@/types/schema";
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
  shippingFee: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  notes: z.string().optional(),
  shippingAddress: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export default function NewOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId");
  const { user, isLoading: authLoading } = useAuth();

  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Form oluştur
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema) as any,
    defaultValues: {
      customerId: customerId || "",
      items: [],
      paymentType: PaymentTypeEnum.CASH,
      paymentStatus: false,
      shippingFee: 0,
      tax: 0,
      discount: 0,
      notes: "",
      shippingAddress: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Müşterileri ve ürünleri yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        setError(null);

        // Kullanıcı kontrolü
        if (authLoading) return;
        if (!user) {
          router.push("/auth/sign-in");
          return;
        }

        const [customersData, productsData] = await Promise.all([
          getCustomers(),
          getProducts(),
        ]);

        setCustomers(customersData);
        setProducts(productsData);
      } catch (error) {
        console.error("Veriler yüklenirken hata:", error);
        setError("Veriler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [router, user, authLoading]);

  // Toplam tutarı hesapla
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
      const orderInput: OrderInput = {
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
        shippingFee: data.shippingFee,
        tax: data.tax,
        discount: data.discount,
        notes: data.notes,
        shippingAddress: data.shippingAddress,
      };

      const order = await createOrder(orderInput);
      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      console.error("Sipariş oluşturulurken hata:", err);
      setError(
        err.response?.data?.message || "Sipariş oluşturulurken bir hata oluştu."
      );
      setLoading(false);
    }
  };

  // Sayfa yüklenirken veya kullanıcı giriş yapmamışsa
  if (authLoading || isLoadingData) {
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
          Bu sayfayı görüntülemek için giriş yapmanız gerekmektedir.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Yeni Sipariş</h1>
        <Button variant="outline" onClick={() => router.push("/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Sipariş Listesine Dön
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sipariş Detayları */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Sipariş Detayları</CardTitle>
                <CardDescription>Sipariş bilgilerini girin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Müşteri Seçimi */}
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Müşteri*</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Müşteri seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {getFullName(customer)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sipariş Kalemleri */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel>Ürünler*</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddItem}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Ürün Ekle
                    </Button>
                  </div>

                  {fields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 border rounded-md border-dashed">
                      <Package className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm mb-4">
                        Henüz ürün eklenmedi
                      </p>
                      <Button type="button" onClick={handleAddItem}>
                        <Plus className="mr-2 h-4 w-4" /> Ürün Ekle
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ürün</TableHead>
                            <TableHead className="w-[80px]">Miktar</TableHead>
                            <TableHead className="w-[120px]">Fiyat</TableHead>
                            <TableHead className="w-[120px]">İndirim</TableHead>
                            <TableHead className="w-[120px]">Toplam</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
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
                                        value={field.value}
                                        onValueChange={(value) => {
                                          field.onChange(value);
                                          handleProductSelect(value, index);
                                        }}
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
                                              {product.name} -{" "}
                                              {product.price.toFixed(2)} ₺
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <input
                                  type="hidden"
                                  {...form.register(
                                    `items.${index}.productName`
                                  )}
                                />
                                <input
                                  type="hidden"
                                  {...form.register(
                                    `items.${index}.productSku`
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`items.${index}.quantity`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          min="1"
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(
                                              parseInt(e.target.value) || 1
                                            );
                                            updateItemTotal(index);
                                          }}
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
                                        <Input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(
                                              parseFloat(e.target.value) || 0
                                            );
                                            updateItemTotal(index);
                                          }}
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
                                  name={`items.${index}.discount`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(
                                              parseFloat(e.target.value) || 0
                                            );
                                            updateItemTotal(index);
                                          }}
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
                                  name={`items.${index}.totalPrice`}
                                  render={({ field }) => (
                                    <div className="font-medium">
                                      {field.value?.toFixed(2)} ₺
                                      <input type="hidden" {...field} />
                                    </div>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  <FormMessage>
                    {form.formState.errors.items?.message}
                  </FormMessage>
                </div>

                {/* Notlar */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notlar</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Sipariş ile ilgili notlar"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Teslimat Adresi */}
                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teslimat Adresi</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Teslimat adresi" {...field} />
                      </FormControl>
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
                <CardDescription>Ödeme detaylarını girin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ödeme Tipi */}
                <FormField
                  control={form.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ödeme Tipi</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Ödeme tipi seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(PaymentTypeEnum).map((type) => (
                            <SelectItem key={type} value={type}>
                              {(() => {
                                switch (type) {
                                  case PaymentTypeEnum.CASH:
                                    return "Nakit";
                                  case PaymentTypeEnum.CREDIT_CARD:
                                    return "Kredi Kartı";
                                  case PaymentTypeEnum.BANK_TRANSFER:
                                    return "Banka Havalesi";
                                  case PaymentTypeEnum.OTHER:
                                    return "Diğer";
                                  default:
                                    return type;
                                }
                              })()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ödeme Durumu */}
                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel>Ödeme Alındı</FormLabel>
                        <FormDescription>
                          Ödeme alındıysa işaretleyin
                        </FormDescription>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded-md border border-input"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Kargo Ücreti */}
                <FormField
                  control={form.control}
                  name="shippingFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kargo Ücreti</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vergi */}
                <FormField
                  control={form.control}
                  name="tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vergi</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* İndirim */}
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İndirim</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Sipariş Özeti */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ara Toplam:</span>
                    <span>{subtotal.toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kargo:</span>
                    <span>{(form.watch("shippingFee") || 0).toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vergi:</span>
                    <span>{(form.watch("tax") || 0).toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">İndirim:</span>
                    <span>-{(form.watch("discount") || 0).toFixed(2)} ₺</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-bold">Toplam:</span>
                    <span className="font-bold text-lg">
                      {total.toFixed(2)} ₺
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push("/orders")}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Kaydediliyor...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Siparişi Oluştur
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
