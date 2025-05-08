"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Phone as PhoneIcon, ChevronDown } from "lucide-react";
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
import { createCustomer } from "@/app/lib/customerService";

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

// Telefon numarası formatlama fonksiyonu
function formatPhoneNumber(value: string): string {
  if (!value) return value;

  // Sadece sayıları al
  const phoneNumber = value.replace(/[^\d]/g, "");

  // Telefon uzunluğunu kontrol et
  const phoneLength = phoneNumber.length;

  // Formatlama
  if (phoneLength < 4) {
    return phoneNumber;
  } else if (phoneLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else if (phoneLength < 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
}

// Popüler ülke kodları listesi
const countryCodes = [
  { code: "+90", country: "TR" },
  { code: "+1", country: "US" },
  { code: "+44", country: "GB" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
  { code: "+39", country: "IT" },
  { code: "+7", country: "RU" },
  { code: "+86", country: "CN" },
  { code: "+91", country: "IN" },
  { code: "+81", country: "JP" },
];

export default function NewCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("+90");
  const [showCountryList, setShowCountryList] = useState(false);

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

  const onSubmit = async (data: CustomerFormValues) => {
    setLoading(true);
    setError(null);

    try {
      await createCustomer(data);
      router.push("/customers");
    } catch (err: any) {
      console.error("Müşteri eklenirken hata:", err);
      setError(
        err.response?.data?.message || "Müşteri eklenirken bir hata oluştu."
      );
      setLoading(false);
    }
  };

  // Ülke kodu seçici bileşeni
  const CountryCodeSelector = () => (
    <div className="relative">
      <button
        type="button"
        className="bg-muted flex items-center px-3 border border-r-0 rounded-l-md border-input text-muted-foreground h-10"
        onClick={() => setShowCountryList(!showCountryList)}
      >
        <span>{countryCode}</span>
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>

      {showCountryList && (
        <div className="absolute top-full left-0 mt-1 z-10 bg-background border border-input rounded-md shadow-md py-1 w-40 max-h-60 overflow-y-auto">
          {countryCodes.map((item) => (
            <button
              key={item.code}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-muted flex items-center justify-between"
              onClick={() => {
                setCountryCode(item.code);
                setShowCountryList(false);
              }}
            >
              <span>{item.code}</span>
              <span className="text-xs text-muted-foreground">
                {item.country}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Yeni Müşteri Ekle</h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
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
          <CardDescription>Yeni müşteri bilgilerini girin</CardDescription>
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
                        <div className="flex relative">
                          <CountryCodeSelector />
                          <Input
                            className="rounded-l-none pl-3"
                            placeholder="(555) 123-4567"
                            {...field}
                            value={formatPhoneNumber(field.value || "")}
                            onChange={(e) => {
                              const formattedValue = formatPhoneNumber(
                                e.target.value
                              );
                              field.onChange(formattedValue);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Ülke kodu ile birlikte telefon numarası
                      </FormDescription>
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
                  onClick={() => router.push("/customers")}
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
                      <Save className="mr-2 h-4 w-4" /> Müşteriyi Kaydet
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
