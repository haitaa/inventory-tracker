"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { WarehouseType } from "@/types/schema";
import { getWarehouseById, updateWarehouse } from "@/app/lib/warehouseService";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Building2,
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
  Warehouse,
} from "lucide-react";

const warehouseFormSchema = z.object({
  name: z.string().min(1, "Depo adı gereklidir"),
  code: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .email("Geçerli bir e-posta adresi girin")
    .optional()
    .or(z.literal("")),
  managerName: z.string().optional(),
  capacity: z.string().optional(),
});

type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;

interface EditWarehousePageProps {
  params: { warehouseId: string };
}

export default function EditWarehousePage({
  params: { warehouseId },
}: EditWarehousePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [warehouse, setWarehouse] = useState<WarehouseType | null>(null);

  // Form tanımı
  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      name: "",
      code: "",
      address: "",
      city: "",
      district: "",
      postalCode: "",
      country: "",
      phone: "",
      email: "",
      managerName: "",
      capacity: "",
    },
  });

  // Depo bilgilerini getir
  useEffect(() => {
    const fetchWarehouse = async () => {
      setLoading(true);
      try {
        const data = await getWarehouseById(warehouseId);
        if (!data) {
          toast.error("Depo bulunamadı");
          router.replace("/warehouses");
          return;
        }

        setWarehouse(data);

        // Form değerlerini güncelle
        form.reset({
          name: data.name,
          code: data.code || "",
          address: data.address || "",
          city: data.city || "",
          district: data.district || "",
          postalCode: data.postalCode || "",
          country: data.country || "",
          phone: data.phone || "",
          email: data.email || "",
          managerName: data.managerName || "",
          capacity: data.capacity ? String(data.capacity) : "",
        });
      } catch (error) {
        console.error("Depo bilgileri alınırken hata:", error);
        toast.error("Depo bilgileri yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouse();
  }, [warehouseId, form, router]);

  // Form gönderildiğinde
  const onSubmit = async (data: WarehouseFormValues) => {
    setSubmitting(true);
    try {
      await updateWarehouse(warehouseId, data);
      toast.success("Depo başarıyla güncellendi");
      router.push(`/warehouses/${warehouseId}`);
    } catch (error) {
      console.error("Depo güncellenirken hata:", error);
      toast.error("Depo güncellenirken bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Depo Düzenle</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-muted-foreground" />
            {warehouse?.name} - Düzenleme
          </CardTitle>
          <CardDescription>
            Depo bilgilerini güncellemek için aşağıdaki formu kullanın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Temel Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depo Adı*</FormLabel>
                        <FormControl>
                          <Input placeholder="Depo adı girin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depo Kodu</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Depo kodu (opsiyonel)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Depo için eşsiz bir tanımlayıcı kod
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kapasite</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Depo kapasitesi (opsiyonel)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Deponun toplam stok kapasitesi
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Konum Bilgileri</h3>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Depo adresi (opsiyonel)"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şehir</FormLabel>
                        <FormControl>
                          <Input placeholder="Şehir (opsiyonel)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İlçe</FormLabel>
                        <FormControl>
                          <Input placeholder="İlçe (opsiyonel)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Posta Kodu</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Posta kodu (opsiyonel)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">İletişim Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="managerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depo Sorumlusu</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Sorumlu kişi adı (opsiyonel)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="İletişim telefonu (opsiyonel)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-posta</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="İletişim e-posta adresi (opsiyonel)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={submitting} className="gap-1">
                  {submitting && (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  )}
                  Depoyu Güncelle
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
