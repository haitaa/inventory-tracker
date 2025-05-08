"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  Bell,
  Lock,
  User,
  Shield,
  Store,
  Mail,
  Smartphone,
  Globe,
  Save,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profil");

  const [profile, setProfile] = useState({
    name: "Mustafa Haita",
    email: "mustafahaita@example.com",
    phone: "+90 555 123 4567",
    bio: "Sistem yöneticisi",
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyReport: true,
      orderUpdates: true,
      productAlerts: true,
    },
  });

  const handleProfileChange = (field: string, value: string | boolean) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setProfile((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
  };

  const handleSaveProfile = () => {
    // API isteği burada yapılacak
    console.log("Profil kaydedildi:", profile);
    // Başarılı mesajı göster
  };

  return (
    <div className="space-y-6 p-6 pt-0">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
          Ayarlar
        </h1>
        <p className="text-muted-foreground">
          Hesap ayarlarınızı ve uygulama tercihlerinizi yönetin
        </p>
      </div>

      <Tabs
        defaultValue="profil"
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6 bg-muted/50 p-1">
          <TabsTrigger value="profil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="bildirimler" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Bildirimler</span>
          </TabsTrigger>
          <TabsTrigger value="guvenlik" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Güvenlik</span>
          </TabsTrigger>
          <TabsTrigger value="firma" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span>Firma Bilgileri</span>
          </TabsTrigger>
        </TabsList>

        {/* Profil Sekmesi */}
        <TabsContent value="profil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Bilgileri</CardTitle>
              <CardDescription>
                Kişisel bilgilerinizi güncelleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder-user.jpg" alt="Profil" />
                    <AvatarFallback className="text-lg">MH</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Fotoğraf Değiştir
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) =>
                          handleProfileChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          handleProfileChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          handleProfileChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Hakkında</Label>
                    <Textarea
                      id="bio"
                      placeholder="Kendiniz hakkında kısa bir açıklama yazın"
                      rows={4}
                      value={profile.bio}
                      onChange={(e) =>
                        handleProfileChange("bio", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="default"
                className="gap-2"
                onClick={handleSaveProfile}
              >
                <Save className="h-4 w-4" />
                Kaydet
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Bildirimler Sekmesi */}
        <TabsContent value="bildirimler" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Tercihleri</CardTitle>
              <CardDescription>
                Hangi bildirimler almak istediğinizi seçin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Bildirim Kanalları</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="email-notifications">
                        E-posta Bildirimleri
                      </Label>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={profile.notifications.email}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("email", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="push-notifications">
                        Uygulama Bildirimleri
                      </Label>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={profile.notifications.push}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("push", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="sms-notifications">
                        SMS Bildirimleri
                      </Label>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={profile.notifications.sms}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("sms", checked)
                      }
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <h3 className="text-sm font-medium">Bildirim Türleri</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="order-updates">
                        Sipariş Güncellemeleri
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Siparişlerin durumu değiştiğinde bildirim alın
                      </p>
                    </div>
                    <Switch
                      id="order-updates"
                      checked={profile.notifications.orderUpdates}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("orderUpdates", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="product-alerts">Ürün Uyarıları</Label>
                      <p className="text-xs text-muted-foreground">
                        Stok azaldığında veya yeni ürünler eklendiğinde bildirim
                        alın
                      </p>
                    </div>
                    <Switch
                      id="product-alerts"
                      checked={profile.notifications.productAlerts}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("productAlerts", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-reports">Haftalık Raporlar</Label>
                      <p className="text-xs text-muted-foreground">
                        Haftalık performans ve satış raporları alın
                      </p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={profile.notifications.weeklyReport}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("weeklyReport", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="default"
                className="gap-2"
                onClick={handleSaveProfile}
              >
                <Save className="h-4 w-4" />
                Tercihlerimi Kaydet
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Güvenlik Sekmesi */}
        <TabsContent value="guvenlik" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Güvenlik Ayarları</CardTitle>
              <CardDescription>Hesap güvenliğinizi yönetin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mevcut Şifre</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Yeni Şifre</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Şifreyi Tekrarla</Label>
                  <Input id="confirm-password" type="password" />
                </div>

                <Alert className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Güvenlik İpucu</AlertTitle>
                  <AlertDescription>
                    Güçlü bir şifre en az 8 karakter içermeli ve büyük/küçük
                    harf, rakam ve özel karakterler içermelidir.
                  </AlertDescription>
                </Alert>

                <Separator className="my-4" />

                <h3 className="text-sm font-medium">
                  İki Faktörlü Doğrulama (2FA)
                </h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm">2FA Koruma</p>
                    <p className="text-xs text-muted-foreground">
                      Ek bir güvenlik katmanı eklemek için etkinleştirin
                    </p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="default" className="gap-2">
                <Shield className="h-4 w-4" />
                Güvenlik Ayarlarını Güncelle
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Firma Bilgileri Sekmesi */}
        <TabsContent value="firma" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Firma Bilgileri</CardTitle>
              <CardDescription>
                Şirket detaylarınızı ve iletişim bilgilerinizi güncelleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Firma Adı</Label>
                  <Input
                    id="company-name"
                    placeholder="ABC Ticaret Ltd. Şti."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Vergi Numarası</Label>
                  <Input id="tax-id" placeholder="1234567890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Firma E-posta</Label>
                  <Input
                    id="company-email"
                    type="email"
                    placeholder="info@firmaniz.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Firma Telefon</Label>
                  <Input id="company-phone" placeholder="+90 212 123 4567" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-address">Adres</Label>
                <Textarea
                  id="company-address"
                  placeholder="Firma adresini girin"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-city">İl</Label>
                  <Input id="company-city" placeholder="İstanbul" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-district">İlçe</Label>
                  <Input id="company-district" placeholder="Kadıköy" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-postal">Posta Kodu</Label>
                  <Input id="company-postal" placeholder="34000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Web Sitesi</Label>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Input id="website" placeholder="www.firmaniz.com" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="default" className="gap-2">
                <Save className="h-4 w-4" />
                Firma Bilgilerini Kaydet
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
