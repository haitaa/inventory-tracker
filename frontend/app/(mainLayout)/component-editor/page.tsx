"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ComponentCategory {
  id: string;
  name: string;
  description: string;
}

interface ComponentData {
  id?: string;
  name: string;
  description: string;
  categoryId: string;
  type: string;
  thumbnail: string;
  schema: Record<string, any>;
  defaultProps: Record<string, any>;
  isGlobal: boolean;
  isActive: boolean;
}

interface ComponentVersionData {
  id?: string;
  componentId?: string;
  version: string;
  template: string;
  script: string;
  style: string;
  isActive: boolean;
}

export default function ComponentEditor() {
  const router = useRouter();
  const [categories, setCategories] = useState<ComponentCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [componentData, setComponentData] = useState<ComponentData>({
    name: "",
    description: "",
    categoryId: "",
    type: "basic",
    thumbnail: "",
    schema: {},
    defaultProps: {},
    isGlobal: false,
    isActive: true,
  });

  const [versionData, setVersionData] = useState<ComponentVersionData>({
    version: "1.0.0",
    template: "",
    script: "",
    style: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/component-categories");
        setCategories(response.data);
        if (response.data.length > 0) {
          setComponentData((prev) => ({
            ...prev,
            categoryId: response.data[0].id,
          }));
        }
      } catch (error) {
        console.error("Kategori verileri yüklenirken hata oluştu:", error);
        setMessage({
          type: "error",
          text: "Kategoriler yüklenirken bir hata oluştu.",
        });
      }
    };

    fetchCategories();
  }, []);

  const handleComponentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setComponentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setComponentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setComponentData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleVersionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVersionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSchemaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const schema = JSON.parse(e.target.value);
      setComponentData((prev) => ({ ...prev, schema }));
      setMessage(null);
    } catch (error) {
      setMessage({ type: "error", text: "Geçersiz JSON formatı." });
    }
  };

  const handleDefaultPropsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    try {
      const defaultProps = JSON.parse(e.target.value);
      setComponentData((prev) => ({ ...prev, defaultProps }));
      setMessage(null);
    } catch (error) {
      setMessage({ type: "error", text: "Geçersiz JSON formatı." });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Önce bileşeni kaydet
      const componentResponse = await axios.post(
        "/api/components",
        componentData
      );
      const newComponentId = componentResponse.data.id;

      // Sonra versiyon bilgisini kaydet
      const versionPayload = {
        ...versionData,
        componentId: newComponentId,
      };
      await axios.post("/api/component-versions", versionPayload);

      setMessage({ type: "success", text: "Bileşen başarıyla oluşturuldu!" });
      setTimeout(() => {
        router.push("/component-gallery");
      }, 2000);
    } catch (error) {
      console.error("Bileşen kaydedilirken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Bileşen kaydedilirken bir hata oluştu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Yeni Bileşen Oluştur</h1>
        <Button onClick={() => router.push("/component-gallery")}>
          Galeri'ye Dön
        </Button>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${message.type === "success" ? "bg-green-100 border-green-600" : "bg-red-100 border-red-600"}`}
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Bileşen Detayları</TabsTrigger>
          <TabsTrigger value="code">Kod ve Tasarım</TabsTrigger>
          <TabsTrigger value="schema">Şema ve Özellikler</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
              <CardDescription>
                Bileşeninizin temel özelliklerini girin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Bileşen Adı</Label>
                  <Input
                    id="name"
                    name="name"
                    value={componentData.name}
                    onChange={handleComponentChange}
                    placeholder="Örn: Hero Bölümü"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select
                    value={componentData.categoryId}
                    onValueChange={(value) =>
                      handleSelectChange("categoryId", value)
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={componentData.description}
                  onChange={handleComponentChange}
                  placeholder="Bileşeniniz hakkında kısa bir açıklama yazın."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Bileşen Türü</Label>
                  <Select
                    value={componentData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Tür seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Temel</SelectItem>
                      <SelectItem value="layout">Düzen</SelectItem>
                      <SelectItem value="container">Konteyner</SelectItem>
                      <SelectItem value="data">Veri Gösterimi</SelectItem>
                      <SelectItem value="interactive">Etkileşimli</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Önizleme Görseli URL</Label>
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    value={componentData.thumbnail}
                    onChange={handleComponentChange}
                    placeholder="https://örnek.com/resim.jpg"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isGlobal" className="text-base">
                      Global Bileşen
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Tüm temalarda kullanılabilir.
                    </p>
                  </div>
                  <Switch
                    id="isGlobal"
                    checked={componentData.isGlobal}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("isGlobal", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isActive" className="text-base">
                      Aktif
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Bileşenin kullanılabilir olup olmadığını belirler.
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={componentData.isActive}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("isActive", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kod ve Tasarım</CardTitle>
              <CardDescription>
                Bileşeninizin HTML, CSS ve JavaScript kodlarını yazın.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="version">Versiyon</Label>
                  <Badge variant="outline">{versionData.version}</Badge>
                </div>
                <Input
                  id="version"
                  name="version"
                  value={versionData.version}
                  onChange={handleVersionChange}
                  placeholder="1.0.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">HTML Şablonu</Label>
                <Textarea
                  id="template"
                  name="template"
                  value={versionData.template}
                  onChange={handleVersionChange}
                  placeholder="<div class='hero'>...</div>"
                  rows={8}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">CSS Stil</Label>
                <Textarea
                  id="style"
                  name="style"
                  value={versionData.style}
                  onChange={handleVersionChange}
                  placeholder=".hero { ... }"
                  rows={6}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="script">JavaScript</Label>
                <Textarea
                  id="script"
                  name="script"
                  value={versionData.script}
                  onChange={handleVersionChange}
                  placeholder="document.addEventListener('DOMContentLoaded', function() { ... });"
                  rows={6}
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Şema ve Özellikler</CardTitle>
              <CardDescription>
                Bileşeninizin özelleştirilebilir ayarlarını tanımlayın.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schema">Özellik Şeması (JSON)</Label>
                <Textarea
                  id="schema"
                  name="schema"
                  defaultValue={JSON.stringify(componentData.schema, null, 2)}
                  onChange={handleSchemaChange}
                  placeholder={`{
  "properties": {
    "title": {
      "type": "string",
      "description": "Başlık metni"
    },
    "subtitle": {
      "type": "string",
      "description": "Alt başlık metni"
    }
  }
}`}
                  rows={8}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultProps">
                  Varsayılan Özellikler (JSON)
                </Label>
                <Textarea
                  id="defaultProps"
                  name="defaultProps"
                  defaultValue={JSON.stringify(
                    componentData.defaultProps,
                    null,
                    2
                  )}
                  onChange={handleDefaultPropsChange}
                  placeholder={`{
  "title": "Merhaba Dünya",
  "subtitle": "Hoş geldiniz"
}`}
                  rows={6}
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6 space-x-2">
        <Button
          variant="outline"
          onClick={() => router.push("/component-gallery")}
        >
          İptal
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Kaydediliyor..." : "Bileşeni Kaydet"}
        </Button>
      </div>
    </div>
  );
}
