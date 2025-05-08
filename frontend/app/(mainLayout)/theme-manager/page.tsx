"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface StoreTheme {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  isActive: boolean;
  isDefault: boolean;
  globalStyles: Record<string, any>;
  colorScheme: Record<string, any>;
  typography: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export default function ThemeManager() {
  const router = useRouter();
  const [themes, setThemes] = useState<StoreTheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<StoreTheme | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/store-themes");
        setThemes(response.data);
      } catch (error) {
        console.error("Temalar yüklenirken hata oluştu:", error);
        setMessage({
          type: "error",
          text: "Temalar yüklenirken bir hata oluştu.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const handleSetDefaultTheme = async (themeId: string) => {
    try {
      await axios.put(`/api/store-themes/${themeId}/set-default`);

      // UI'ı güncelle
      setThemes((prev) =>
        prev.map((theme) => ({
          ...theme,
          isDefault: theme.id === themeId,
        }))
      );

      setMessage({
        type: "success",
        text: "Varsayılan tema başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Varsayılan tema ayarlanırken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Varsayılan tema ayarlanırken bir hata oluştu.",
      });
    }
  };

  const handleToggleActive = async (themeId: string, isActive: boolean) => {
    try {
      await axios.put(`/api/store-themes/${themeId}`, { isActive });

      // UI'ı güncelle
      setThemes((prev) =>
        prev.map((theme) =>
          theme.id === themeId ? { ...theme, isActive } : theme
        )
      );

      setMessage({
        type: "success",
        text: `Tema ${isActive ? "aktifleştirildi" : "devre dışı bırakıldı"}.`,
      });
    } catch (error) {
      console.error("Tema durumu güncellenirken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Tema durumu güncellenirken bir hata oluştu.",
      });
    }
  };

  const handleDeleteTheme = async (themeId: string) => {
    try {
      await axios.delete(`/api/store-themes/${themeId}`);

      // UI'ı güncelle
      setThemes((prev) => prev.filter((theme) => theme.id !== themeId));

      setIsDeleteDialogOpen(false);
      setThemeToDelete(null);
      setMessage({ type: "success", text: "Tema başarıyla silindi." });
    } catch (error) {
      console.error("Tema silinirken hata oluştu:", error);
      setMessage({ type: "error", text: "Tema silinirken bir hata oluştu." });
    }
  };

  const handleApplyTheme = async (themeId: string) => {
    try {
      await axios.post(`/api/stores/current/apply-theme`, { themeId });
      setMessage({
        type: "success",
        text: "Tema mağazaya başarıyla uygulandı.",
      });
    } catch (error) {
      console.error("Tema uygulanırken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Tema mağazaya uygulanırken bir hata oluştu.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">Yükleniyor...</div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tema Yönetimi</h1>
        <Button onClick={() => router.push("/theme-editor/new")}>
          Yeni Tema Oluştur
        </Button>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${message.type === "success" ? "bg-green-100 border-green-600" : "bg-red-100 border-red-600"}`}
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-muted rounded-md">
            <p className="text-muted-foreground">Henüz tema bulunmuyor.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/theme-editor/new")}
            >
              İlk Temayı Oluştur
            </Button>
          </div>
        ) : (
          themes.map((theme) => (
            <Card key={theme.id} className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                {theme.thumbnail ? (
                  <Image
                    src={theme.thumbnail}
                    alt={theme.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Önizleme yok
                  </div>
                )}
                {theme.isDefault && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary">Varsayılan</Badge>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{theme.name}</CardTitle>
                  <Switch
                    checked={theme.isActive}
                    onCheckedChange={(checked) =>
                      handleToggleActive(theme.id, checked)
                    }
                    aria-label={theme.isActive ? "Aktif" : "Pasif"}
                  />
                </div>
                <CardDescription>{theme.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTheme(theme)}
                    >
                      Detaylar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    {selectedTheme && (
                      <>
                        <DialogHeader>
                          <DialogTitle>{selectedTheme.name}</DialogTitle>
                          <DialogDescription>
                            {selectedTheme.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative h-48 bg-muted mt-4">
                          {selectedTheme.thumbnail ? (
                            <Image
                              src={selectedTheme.thumbnail}
                              alt={selectedTheme.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                              Önizleme yok
                            </div>
                          )}
                        </div>

                        <Tabs defaultValue="colors" className="mt-6">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="colors">Renkler</TabsTrigger>
                            <TabsTrigger value="typography">
                              Tipografi
                            </TabsTrigger>
                            <TabsTrigger value="styles">Stiller</TabsTrigger>
                          </TabsList>

                          <TabsContent
                            value="colors"
                            className="space-y-4 mt-4"
                          >
                            <h3 className="font-medium">Renk Şeması</h3>
                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(
                                selectedTheme.colorScheme || {}
                              ).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center space-x-2"
                                >
                                  <div
                                    className="w-6 h-6 rounded-full"
                                    style={{ backgroundColor: value as string }}
                                  />
                                  <div>
                                    <p className="text-sm font-medium">{key}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {value as string}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent
                            value="typography"
                            className="space-y-4 mt-4"
                          >
                            <h3 className="font-medium">Tipografi</h3>
                            <div className="space-y-4">
                              {Object.entries(
                                selectedTheme.typography || {}
                              ).map(([key, value]) => (
                                <div key={key}>
                                  <h4 className="text-sm font-medium">{key}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {typeof value === "object"
                                      ? JSON.stringify(value)
                                      : (value as string)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent
                            value="styles"
                            className="space-y-4 mt-4"
                          >
                            <h3 className="font-medium">Global Stiller</h3>
                            <Textarea
                              readOnly
                              value={JSON.stringify(
                                selectedTheme.globalStyles,
                                null,
                                2
                              )}
                              rows={10}
                              className="font-mono text-sm"
                            />
                          </TabsContent>
                        </Tabs>

                        <DialogFooter className="mt-6">
                          <Button
                            variant="outline"
                            onClick={() =>
                              router.push(`/theme-editor/${selectedTheme.id}`)
                            }
                          >
                            Düzenle
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setThemeToDelete(theme.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    Sil
                  </Button>
                  <Button onClick={() => handleApplyTheme(theme.id)}>
                    Uygula
                  </Button>
                </div>
              </CardFooter>
              {!theme.isDefault && (
                <div className="px-6 pb-4">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => handleSetDefaultTheme(theme.id)}
                  >
                    Varsayılan Yap
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Temayı Sil</DialogTitle>
            <DialogDescription>
              Bu temayı silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setThemeToDelete(null);
              }}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={() => themeToDelete && handleDeleteTheme(themeToDelete)}
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
