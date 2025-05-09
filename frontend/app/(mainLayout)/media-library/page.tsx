"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Media {
  id: string;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  path: string;
  type: string;
  alt: string | null;
  title: string | null;
  description: string | null;
  folderId: string | null;
  createdAt: string;
}

interface MediaFolder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function MediaLibrary() {
  const router = useRouter();
  const [media, setMedia] = useState<Media[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [fileType, setFileType] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editMedia, setEditMedia] = useState<{
    alt: string;
    title: string;
    description: string;
  }>({
    alt: "",
    title: "",
    description: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (fileType) {
        params.type = fileType;
      }

      if (currentFolder) {
        params.folderId = currentFolder;
      }

      const response = await axios.get("/api/media", { params });
      setMedia(response.data.media);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Medya dosyaları yüklenirken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Medya dosyaları yüklenirken bir hata oluştu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await axios.get("/api/media/folders/all");
      setFolders(response.data);
    } catch (error) {
      console.error("Klasörler yüklenirken hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchMedia();
    fetchFolders();
  }, [pagination.page, fileType, currentFolder]);

  useEffect(() => {
    if (searchQuery) {
      const delaySearch = setTimeout(() => {
        fetchMedia();
      }, 500);
      return () => clearTimeout(delaySearch);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  const handleFileTypeChange = (type: string | null) => {
    setFileType(type);
    setPagination({ ...pagination, page: 1 });
  };

  const handleFolderChange = (folderId: string | null) => {
    setCurrentFolder(folderId);
    setPagination({ ...pagination, page: 1 });
  };

  const handleCreateFolder = async () => {
    try {
      if (!newFolderName.trim()) {
        setMessage({
          type: "error",
          text: "Klasör adı boş olamaz.",
        });
        return;
      }

      await axios.post("/api/media/folders", {
        name: newFolderName,
        parentId: currentFolder,
      });

      setNewFolderName("");
      setIsNewFolderDialogOpen(false);
      fetchFolders();
      setMessage({
        type: "success",
        text: "Klasör başarıyla oluşturuldu.",
      });
    } catch (error) {
      console.error("Klasör oluşturulurken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Klasör oluşturulurken bir hata oluştu.",
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        if (currentFolder) {
          formData.append("folderId", currentFolder);
        }

        await axios.post("/api/media/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        });

        // Son dosya için progress'i 100 yap
        if (i === files.length - 1) {
          setUploadProgress(100);
        }
      }

      setIsUploadDialogOpen(false);
      fetchMedia();
      setMessage({
        type: "success",
        text: `${files.length} dosya başarıyla yüklendi.`,
      });
    } catch (error) {
      console.error("Dosya yüklenirken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Dosya yüklenirken bir hata oluştu.",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEditMedia = (media: Media) => {
    setSelectedMedia(media);
    setEditMedia({
      alt: media.alt || "",
      title: media.title || "",
      description: media.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMedia = async () => {
    if (!selectedMedia) return;

    try {
      await axios.put(`/api/media/${selectedMedia.id}`, editMedia);
      fetchMedia();
      setIsEditDialogOpen(false);
      setMessage({
        type: "success",
        text: "Medya bilgileri başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Medya güncellenirken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Medya güncellenirken bir hata oluştu.",
      });
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm("Bu dosyayı silmek istediğinizden emin misiniz?")) return;

    try {
      await axios.delete(`/api/media/${id}`);
      fetchMedia();
      setMessage({
        type: "success",
        text: "Medya başarıyla silindi.",
      });
    } catch (error) {
      console.error("Medya silinirken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Medya silinirken bir hata oluştu.",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderBreadcrumbs = () => {
    if (!currentFolder) {
      return (
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            className="text-lg font-semibold"
            onClick={() => handleFolderChange(null)}
          >
            Ana Klasör
          </Button>
        </div>
      );
    }

    // Mevcut klasörü bul
    const folder = folders.find((f) => f.id === currentFolder);
    if (!folder) return null;

    return (
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          className="text-sm"
          onClick={() => handleFolderChange(null)}
        >
          Ana Klasör
        </Button>
        {" > "}
        <Button
          variant="ghost"
          className="text-sm font-semibold"
          onClick={() => handleFolderChange(folder.id)}
        >
          {folder.name}
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Medya Kütüphanesi</h1>
        <div className="flex space-x-2">
          <Dialog
            open={isNewFolderDialogOpen}
            onOpenChange={setIsNewFolderDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">Klasör Oluştur</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Klasör</DialogTitle>
                <DialogDescription>
                  Yeni bir klasör oluşturmak için klasör adını girin.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="folderName">Klasör Adı</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Klasör adı girin"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsNewFolderDialogOpen(false)}
                >
                  İptal
                </Button>
                <Button onClick={handleCreateFolder}>Oluştur</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>Dosya Yükle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dosya Yükleme</DialogTitle>
                <DialogDescription>
                  Yüklemek istediğiniz dosyaları seçin. JPG, PNG, GIF, WEBP, SVG
                  ve PDF dosyalarını yükleyebilirsiniz.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="files">Dosyalar</Label>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,application/pdf"
                    disabled={isUploading}
                  />
                </div>
                {isUploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                  disabled={isUploading}
                >
                  İptal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${message.type === "success" ? "bg-green-100 border-green-600" : "bg-red-100 border-red-600"}`}
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filtreler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Ara</Label>
                <Input
                  id="search"
                  placeholder="Dosya adı, başlık veya açıklama ara..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              <div className="space-y-2">
                <Label>Dosya Türü</Label>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant={fileType === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFileTypeChange(null)}
                  >
                    Tümü
                  </Button>
                  <Button
                    variant={fileType === "image" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFileTypeChange("image")}
                  >
                    Resimler
                  </Button>
                  <Button
                    variant={fileType === "document" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFileTypeChange("document")}
                  >
                    Dokümanlar
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Klasörler</Label>
                <ScrollArea className="h-[200px]">
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant={currentFolder === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFolderChange(null)}
                    >
                      Ana Klasör
                    </Button>
                    {folders.map((folder) => (
                      <Button
                        key={folder.id}
                        variant={
                          currentFolder === folder.id ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleFolderChange(folder.id)}
                      >
                        {folder.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Medya Dosyaları</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Toplam: {pagination.total} dosya | Sayfa: {pagination.page}/
                  {pagination.totalPages}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderBreadcrumbs()}

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  Yükleniyor...
                </div>
              ) : media.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <p className="text-muted-foreground mb-4">
                    Bu klasörde henüz medya dosyası yok.
                  </p>
                  <Button onClick={() => setIsUploadDialogOpen(true)}>
                    Dosya Yükle
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {media.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square bg-gray-100 relative">
                        {item.type === "image" ? (
                          <img
                            src={item.path}
                            alt={item.alt || item.originalName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full">
                            <svg
                              width="64"
                              height="64"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mb-2"
                            >
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span className="text-sm">
                              {item.originalName
                                .split(".")
                                .pop()
                                ?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <Badge
                          className="absolute top-2 right-2"
                          variant="secondary"
                        >
                          {formatFileSize(item.size)}
                        </Badge>
                      </div>
                      <CardFooter className="flex justify-between p-4">
                        <div className="truncate">
                          <p className="font-medium text-sm truncate">
                            {item.title || item.originalName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditMedia(item)}
                            >
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteMedia(item.id)}
                              className="text-red-600"
                            >
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {/* Sayfalama */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: Math.max(1, pagination.page - 1),
                      })
                    }
                    disabled={pagination.page === 1}
                  >
                    Önceki
                  </Button>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={pagination.page === page ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setPagination({ ...pagination, page: page })
                      }
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: Math.min(
                          pagination.totalPages,
                          pagination.page + 1
                        ),
                      })
                    }
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Sonraki
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medya Düzenle</DialogTitle>
            <DialogDescription>
              Medya bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                value={editMedia.title}
                onChange={(e) =>
                  setEditMedia({ ...editMedia, title: e.target.value })
                }
                placeholder="Medya başlığı"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt">Alt Metin</Label>
              <Input
                id="alt"
                value={editMedia.alt}
                onChange={(e) =>
                  setEditMedia({ ...editMedia, alt: e.target.value })
                }
                placeholder="Alt metin (SEO için önemli)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Input
                id="description"
                value={editMedia.description}
                onChange={(e) =>
                  setEditMedia({ ...editMedia, description: e.target.value })
                }
                placeholder="Medya açıklaması"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              İptal
            </Button>
            <Button onClick={handleUpdateMedia}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
