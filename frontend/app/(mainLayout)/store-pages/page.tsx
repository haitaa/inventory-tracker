"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface StorePage {
  id: string;
  storeId: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  isHomePage: boolean;
  createdAt: string;
  updatedAt: string;
  sectionsCount?: number;
}

export default function StorePages() {
  const router = useRouter();
  const [pages, setPages] = useState<StorePage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewPageDialogOpen, setIsNewPageDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);

  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    isHomePage: false,
  });

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/store-pages");
        setPages(response.data);
      } catch (error) {
        console.error("Sayfalar yüklenirken hata oluştu:", error);
        setMessage({
          type: "error",
          text: "Sayfalar yüklenirken bir hata oluştu.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPage((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePage = async () => {
    try {
      const response = await axios.post("/api/store-pages", {
        ...newPage,
        isPublished: false,
      });

      setPages((prev) => [...prev, response.data]);
      setIsNewPageDialogOpen(false);
      setNewPage({
        title: "",
        slug: "",
        metaTitle: "",
        metaDescription: "",
        isHomePage: false,
      });

      setMessage({ type: "success", text: "Sayfa başarıyla oluşturuldu." });

      // Yeni oluşturulan sayfayı düzenlemek için yönlendir
      router.push(`/page-editor/${response.data.id}`);
    } catch (error) {
      console.error("Sayfa oluşturulurken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Sayfa oluşturulurken bir hata oluştu.",
      });
    }
  };

  const handleDeletePage = async (pageId: string) => {
    try {
      await axios.delete(`/api/store-pages/${pageId}`);
      setPages(pages.filter((page) => page.id !== pageId));
      setIsDeleteDialogOpen(false);
      setPageToDelete(null);
      setMessage({ type: "success", text: "Sayfa başarıyla silindi." });
    } catch (error) {
      console.error("Sayfa silinirken hata oluştu:", error);
      setMessage({ type: "error", text: "Sayfa silinirken bir hata oluştu." });
    }
  };

  const handleTogglePublished = async (
    pageId: string,
    isPublished: boolean
  ) => {
    try {
      await axios.put(`/api/store-pages/${pageId}`, { isPublished });
      setPages(
        pages.map((page) =>
          page.id === pageId ? { ...page, isPublished } : page
        )
      );
      setMessage({
        type: "success",
        text: `Sayfa ${isPublished ? "yayınlandı" : "yayından kaldırıldı"}.`,
      });
    } catch (error) {
      console.error("Sayfa durumu güncellenirken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Sayfa durumu güncellenirken bir hata oluştu.",
      });
    }
  };

  const handleSetHomePage = async (pageId: string) => {
    try {
      await axios.put(`/api/store-pages/${pageId}/set-home`);
      setPages(
        pages.map((page) => ({
          ...page,
          isHomePage: page.id === pageId,
        }))
      );
      setMessage({ type: "success", text: "Ana sayfa başarıyla güncellendi." });
    } catch (error) {
      console.error("Ana sayfa ayarlanırken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Ana sayfa ayarlanırken bir hata oluştu.",
      });
    }
  };

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">Yükleniyor...</div>
    );
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Slug'ı otomatik olarak formatla (boşlukları tirelere çevir, özel karakterleri kaldır)
    const formattedSlug = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    setNewPage((prev) => ({ ...prev, slug: formattedSlug }));
  };

  // Sayfa başlığı değiştiğinde otomatik slug oluştur
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPage((prev) => ({
      ...prev,
      title: value,
      // Eğer kullanıcı daha önce slug'ı değiştirmediyse otomatik slug oluştur
      slug:
        prev.slug === ""
          ? value
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")
          : prev.slug,
      // Eğer meta başlık boşsa, başlıkla doldur
      metaTitle: prev.metaTitle === "" ? value : prev.metaTitle,
    }));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mağaza Sayfaları</h1>
        <Button onClick={() => setIsNewPageDialogOpen(true)}>
          Yeni Sayfa Oluştur
        </Button>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${message.type === "success" ? "bg-green-100 border-green-600" : "bg-red-100 border-red-600"}`}
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <Input
          placeholder="Sayfa ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-muted rounded-md">
            <p className="text-muted-foreground">Henüz sayfa bulunmuyor.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsNewPageDialogOpen(true)}
            >
              İlk Sayfayı Oluştur
            </Button>
          </div>
        ) : (
          filteredPages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      {page.title}
                      {page.isHomePage && (
                        <Badge className="ml-2 bg-primary">Ana Sayfa</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>/{page.slug}</CardDescription>
                  </div>
                  <Switch
                    checked={page.isPublished}
                    onCheckedChange={(checked) =>
                      handleTogglePublished(page.id, checked)
                    }
                    aria-label={page.isPublished ? "Yayında" : "Taslak"}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Bölüm: {page.sectionsCount || 0}</span>
                  <span>
                    Son Güncelleme:{" "}
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/page-editor/${page.id}`)}
                >
                  Düzenle
                </Button>
                <div className="space-x-2">
                  {!page.isHomePage && (
                    <Button
                      variant="ghost"
                      onClick={() => handleSetHomePage(page.id)}
                    >
                      Ana Sayfa Yap
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setPageToDelete(page.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    Sil
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Yeni Sayfa Oluşturma Dialog */}
      <Dialog open={isNewPageDialogOpen} onOpenChange={setIsNewPageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Sayfa Oluştur</DialogTitle>
            <DialogDescription>
              Mağazanız için yeni bir sayfa oluşturun.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Sayfa Başlığı</Label>
              <Input
                id="title"
                name="title"
                value={newPage.title}
                onChange={handleTitleChange}
                placeholder="Örn: Hakkımızda"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={newPage.slug}
                onChange={handleSlugChange}
                placeholder="Örn: hakkimizda"
              />
              <p className="text-xs text-muted-foreground">
                Bu sayfa şu URL'de görüntülenecek: /pages/
                {newPage.slug || "sayfa-slug"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Başlık (SEO)</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                value={newPage.metaTitle}
                onChange={handleInputChange}
                placeholder="SEO için sayfa başlığı"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Açıklama (SEO)</Label>
              <Input
                id="metaDescription"
                name="metaDescription"
                value={newPage.metaDescription}
                onChange={handleInputChange}
                placeholder="SEO için sayfa açıklaması"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isHomePage"
                checked={newPage.isHomePage}
                onCheckedChange={(checked) =>
                  setNewPage((prev) => ({ ...prev, isHomePage: checked }))
                }
              />
              <Label htmlFor="isHomePage">Ana sayfa olarak ayarla</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewPageDialogOpen(false)}
            >
              İptal
            </Button>
            <Button
              onClick={handleCreatePage}
              disabled={!newPage.title || !newPage.slug}
            >
              Oluştur ve Düzenle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sayfa Silme Onay Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sayfayı Sil</DialogTitle>
            <DialogDescription>
              Bu sayfayı silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setPageToDelete(null);
              }}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={() => pageToDelete && handleDeletePage(pageToDelete)}
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
