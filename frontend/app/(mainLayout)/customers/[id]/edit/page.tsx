"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
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
  CardContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getCustomerById, updateCustomer } from "@/app/lib/customerService";
import { CustomerType } from "@/types/schema";

// Müşteri formu için doğrulama şeması
const customerSchema = z.object({
  firstName: z.string().min(2, { message: "Ad en az 2 karakter olmalıdır" }),
  lastName: z.string().min(2, { message: "Soyad en az 2 karakter olmalıdır" }),
  email: z
    .string()
    .email({ message: "Geçerli bir e-posta adresi girin" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function EditCustomerPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form oluştur
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      notes: "",
    },
  });

  // Müşteri verilerini yükle
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCustomerById(params.id);
        setCustomer(data);

        // Form değerlerini doldur
        form.reset({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          postalCode: data.postalCode || "",
          country: data.country || "",
          notes: data.notes || "",
        });
      } catch (err: any) {
        console.error("Müşteri bilgileri yüklenirken hata:", err);
        setError(
          err.response?.data?.message || "Müşteri bilgileri yüklenemedi."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [params.id, form]);

  const onSubmit = async (data: CustomerFormValues) => {
    setSaving(true);
    setError(null);

    try {
      await updateCustomer(params.id, data);
      router.push(`/customers/${params.id}`);
    } catch (err: any) {
      console.error("Müşteri güncellenirken hata:", err);
      setError(
        err.response?.data?.message || "Müşteri güncellenirken bir hata oluştu."
      );
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!customer && !loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Müşteri Düzenle</h1>
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
        <h1 className="text-2xl font-bold">Müşteri Düzenle</h1>
        <Button
          variant="outline"
          onClick={() => router.push(`/customers/${params.id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Detaylara Dön
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
          <CardTitle>Müşteri Bilgileri</CardTitle>
          <CardDescription>Müşteri bilgilerini güncelleyin</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kişisel Bilgiler */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad*</FormLabel>
                      <FormControl>
                        <Input placeholder="Müşteri adı" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soyad*</FormLabel>
                      <FormControl>
                        <Input placeholder="Müşteri soyadı" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-posta</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ornek@mail.com"
                          type="email"
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
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Adres Bilgileri */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Adres bilgileri" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şehir</FormLabel>
                      <FormControl>
                        <Input placeholder="Şehir" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İlçe/Bölge</FormLabel>
                      <FormControl>
                        <Input placeholder="İlçe/Bölge" {...field} />
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
                        <Input placeholder="Posta kodu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ülke</FormLabel>
                      <FormControl>
                        <Input placeholder="Ülke" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notlar */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Notlar</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Müşteri hakkında notlar"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/customers/${params.id}`)}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Kaydediliyor...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
