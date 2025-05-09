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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LuSearch,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuHouse,
  LuEye,
  LuEyeOff,
  LuCheck,
  LuFileText,
  LuExternalLink,
  LuCalendar,
} from "react-icons/lu";
import { motion } from "framer-motion";

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
  const [activeTab, setActiveTab] = useState<"all" | "published" | "drafts">(
    "all"
  );

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

        // Sayfaları alıp ardından her biri için bölüm sayısını al
        const pagesData = response.data;

        // Her sayfa için bölüm sayısını al
        const pagesWithSectionCounts = await Promise.all(
          pagesData.map(async (page: StorePage) => {
            try {
              const sectionsResponse = await axios.get(
                `/api/store-pages/${page.id}/sections`
              );
              return {
                ...page,
                sectionsCount: sectionsResponse.data.length,
              };
            } catch (error) {
              console.error(`${page.id} için bölüm sayısı alınamadı:`, error);
              return page; // Hata durumunda orijinal sayfayı döndür
            }
          })
        );

        setPages(pagesWithSectionCounts);
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

      // Yeni oluşturulan sayfayı bölüm sayısı ile birlikte ekle
      const newPageWithSections = {
        ...response.data,
        sectionsCount: 0, // Yeni sayfada henüz bölüm yoktur
      };

      setPages((prev) => [...prev, newPageWithSections]);
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

  const filteredPages = pages.filter((page) => {
    // Önce metin filtreleme
    const textMatch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());

    // Sonra sekme filtreleme
    if (activeTab === "published") return textMatch && page.isPublished;
    if (activeTab === "drafts") return textMatch && !page.isPublished;
    return textMatch; // "all" sekmesi
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Sayfalar yükleniyor...</p>
      </div>
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

  const getStatusColor = (page: StorePage) => {
    if (page.isHomePage)
      return "bg-purple-100 text-purple-800 border-purple-300";
    if (page.isPublished) return "bg-green-100 text-green-800 border-green-300";
    return "bg-amber-100 text-amber-800 border-amber-300";
  };

  const getStatusText = (page: StorePage) => {
    if (page.isHomePage) return "Ana Sayfa";
    if (page.isPublished) return "Yayında";
    return "Taslak";
  };

  const getStatusIcon = (page: StorePage) => {
    if (page.isHomePage) return <LuHouse className="w-3.5 h-3.5 mr-1" />;
    if (page.isPublished) return <LuEye className="w-3.5 h-3.5 mr-1" />;
    return <LuEyeOff className="w-3.5 h-3.5 mr-1" />;
  };

  return (
    <div className="container mx-auto px-6 sm:px-8 py-10 max-w-[1400px]">
      {/* Üst Başlık Alanı */}
      <div className="mb-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Mağaza Sayfaları
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl">
              Mağazanız için oluşturulan tüm sayfaları buradan yönetebilir,
              düzenleyebilir veya yenilerini ekleyebilirsiniz.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsNewPageDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
            >
              <LuPlus className="mr-2 h-4 w-4" />
              Yeni Sayfa Oluştur
            </Button>
          </motion.div>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-indigo-600 mt-4 rounded-full opacity-50"></div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            className={`mb-6 border-l-4 ${
              message.type === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : "bg-red-50 border-red-500 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {message.type === "success" ? (
                <LuCheck className="h-5 w-5 mr-2" />
              ) : (
                <LuTrash2 className="h-5 w-5 mr-2" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </div>
          </Alert>
        </motion.div>
      )}

      {/* Filtreleme Alanı */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-96 relative">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Sayfa adı veya URL'e göre ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "all" | "published" | "drafts")
            }
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="all">Tümü ({pages.length})</TabsTrigger>
              <TabsTrigger value="published">
                Yayında ({pages.filter((p) => p.isPublished).length})
              </TabsTrigger>
              <TabsTrigger value="drafts">
                Taslaklar ({pages.filter((p) => !p.isPublished).length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPages.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="bg-white p-4 rounded-full shadow-sm border mb-4">
              <LuFileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Sayfa Bulunamadı
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              {searchQuery
                ? `"${searchQuery}" için arama sonucu bulunamadı.`
                : "Henüz eklenen bir sayfa bulunmuyor. Yeni bir sayfa ekleyerek başlayabilirsiniz."}
            </p>
            <Button
              variant="outline"
              onClick={() => setIsNewPageDialogOpen(true)}
              className="gap-2"
            >
              <LuPlus className="h-4 w-4" />
              Yeni Sayfa Oluştur
            </Button>
          </div>
        ) : (
          filteredPages.map((page) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="overflow-hidden h-full border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 rounded-xl">
                <CardHeader className="pb-2 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl group flex items-center gap-2">
                        {page.title}
                        {page.isHomePage && (
                          <Badge
                            variant="outline"
                            className="bg-purple-100 text-purple-800 border-purple-300 group-hover:bg-purple-200 transition-colors"
                          >
                            <LuHouse className="mr-1 h-3 w-3" />
                            Ana Sayfa
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1 text-sm">
                        <span className="inline-flex items-center text-gray-500">
                          <LuExternalLink className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          /{page.slug}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(page)} flex items-center px-2 py-1`}
                      >
                        {getStatusIcon(page)}
                        {getStatusText(page)}
                      </Badge>
                      <Switch
                        checked={page.isPublished}
                        onCheckedChange={(checked) =>
                          handleTogglePublished(page.id, checked)
                        }
                        aria-label={page.isPublished ? "Yayında" : "Taslak"}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <div className="flex items-center">
                      <LuFileText className="h-3.5 w-3.5 mr-1 text-blue-500" />
                      <span>{page.sectionsCount || 0} bölüm</span>
                    </div>
                    <div className="flex items-center">
                      <LuCalendar className="h-3.5 w-3.5 mr-1 text-blue-500" />
                      <span>
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {page.metaDescription && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {page.metaDescription}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-4 border-t border-gray-100 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/page-editor/${page.id}`)}
                    className="gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <LuPencil className="h-4 w-4" />
                    Düzenle
                  </Button>
                  <div className="flex items-center gap-2">
                    {!page.isHomePage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetHomePage(page.id)}
                        className="gap-1 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                      >
                        <LuHouse className="h-4 w-4" />
                        Ana Sayfa Yap
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPageToDelete(page.id);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Yeni Sayfa Oluşturma Dialog */}
      <Dialog open={isNewPageDialogOpen} onOpenChange={setIsNewPageDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Yeni Sayfa Oluştur
            </DialogTitle>
            <DialogDescription>
              Mağazanız için yeni bir sayfa oluşturun. Bu sayfa daha sonra
              düzenleyici ile özelleştirilebilir.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium">
                Sayfa Başlığı
              </Label>
              <Input
                id="title"
                name="title"
                value={newPage.title}
                onChange={handleTitleChange}
                placeholder="Örn: Hakkımızda"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="font-medium">
                URL Slug
              </Label>
              <Input
                id="slug"
                name="slug"
                value={newPage.slug}
                onChange={handleSlugChange}
                placeholder="Örn: hakkimizda"
                className="border-gray-300"
              />
              <p className="text-xs text-gray-500 flex items-center">
                <LuExternalLink className="h-3.5 w-3.5 mr-1" />
                Bu sayfa şu URL'de görüntülenecek: /store/
                <span className="font-medium text-blue-600">
                  {newPage.slug || "sayfa-slug"}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaTitle" className="font-medium">
                Meta Başlık (SEO)
              </Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                value={newPage.metaTitle}
                onChange={handleInputChange}
                placeholder="SEO için sayfa başlığı"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription" className="font-medium">
                Meta Açıklama (SEO)
              </Label>
              <Input
                id="metaDescription"
                name="metaDescription"
                value={newPage.metaDescription}
                onChange={handleInputChange}
                placeholder="SEO için sayfa açıklaması"
                className="border-gray-300"
              />
              <p className="text-xs text-gray-500">
                Bu açıklama arama motorlarında ve sosyal medya paylaşımlarında
                görüntülenecektir.
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <Switch
                id="isHomePage"
                checked={newPage.isHomePage}
                onCheckedChange={(checked) =>
                  setNewPage((prev) => ({ ...prev, isHomePage: checked }))
                }
                className="data-[state=checked]:bg-purple-600"
              />
              <div>
                <Label
                  htmlFor="isHomePage"
                  className="font-medium flex items-center"
                >
                  <LuHouse className="mr-1 h-4 w-4 text-purple-600" />
                  Ana sayfa olarak ayarla
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Bu sayfayı mağazanızın landing sayfası yapacaktır.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsNewPageDialogOpen(false)}
              className="border-gray-300"
            >
              İptal
            </Button>
            <Button
              onClick={handleCreatePage}
              disabled={!newPage.title || !newPage.slug}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <LuPencil className="mr-2 h-4 w-4" />
              Oluştur ve Düzenle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sayfa Silme Onay Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 flex items-center">
              <LuTrash2 className="h-5 w-5 mr-2" />
              Sayfayı Sil
            </DialogTitle>
            <DialogDescription>
              Bu sayfayı silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz ve sayfaya ait tüm içerikler kalıcı olarak silinecektir.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 my-2">
            <p className="font-medium">Uyarı: Bu işlem geri alınamaz!</p>
            <p className="mt-1">Silinen sayfa ve içeriği geri getirilemez.</p>
          </div>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setPageToDelete(null);
              }}
              className="border-gray-300"
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={() => pageToDelete && handleDeletePage(pageToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              <LuTrash2 className="mr-2 h-4 w-4" />
              Sayfayı Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
