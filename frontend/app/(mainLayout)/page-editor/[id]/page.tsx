"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Component {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  type: string;
  thumbnail: string;
  isGlobal: boolean;
  isActive: boolean;
  defaultProps?: Record<string, any>;
}

interface ComponentVersion {
  id: string;
  componentId: string;
  version: string;
  template: string;
  script: string;
  style: string;
  isActive: boolean;
}

interface PageSection {
  id: string;
  pageId: string;
  componentVersionId: string;
  name: string;
  props: Record<string, any>;
  order: number;
  parentSectionId: string | null;
  containerSettings: Record<string, any>;
  styleOverrides: Record<string, any>;
  isVisible: boolean;
  component?: Component;
  componentVersion?: ComponentVersion;
}

interface StorePage {
  id: string;
  storeId: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  isHomePage: boolean;
  sections: PageSection[];
}

// Önce bileşenin props arayüzünü tanımlıyoruz
interface SortableSectionProps {
  section: PageSection;
  activeId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

const SortableSection = ({
  section,
  activeId,
  onEdit,
  onDelete,
  onToggleVisibility,
}: SortableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-2">
      <Card
        className={`border ${activeId === section.id ? "border-primary" : ""}`}
      >
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-move p-2 hover:bg-muted rounded"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.5 4.625C5.5 4.97018 5.22018 5.25 4.875 5.25C4.52982 5.25 4.25 4.97018 4.25 4.625C4.25 4.27982 4.52982 4 4.875 4C5.22018 4 5.5 4.27982 5.5 4.625ZM5.5 7.625C5.5 7.97018 5.22018 8.25 4.875 8.25C4.52982 8.25 4.25 7.97018 4.25 7.625C4.25 7.27982 4.52982 7 4.875 7C5.22018 7 5.5 7.27982 5.5 7.625ZM5.5 10.625C5.5 10.9702 5.22018 11.25 4.875 11.25C4.52982 11.25 4.25 10.9702 4.25 10.625C4.25 10.2798 4.52982 10 4.875 10C5.22018 10 5.5 10.2798 5.5 10.625ZM10.5 4.625C10.5 4.97018 10.2202 5.25 9.875 5.25C9.52982 5.25 9.25 4.97018 9.25 4.625C9.25 4.27982 9.52982 4 9.875 4C10.2202 4 10.5 4.27982 10.5 4.625ZM10.5 7.625C10.5 7.97018 10.2202 8.25 9.875 8.25C9.52982 8.25 9.25 7.97018 9.25 7.625C9.25 7.27982 9.52982 7 9.875 7C10.2202 7 10.5 7.27982 10.5 7.625ZM10.5 10.625C10.5 10.9702 10.2202 11.25 9.875 11.25C9.52982 11.25 9.25 10.9702 9.25 10.625C9.25 10.2798 9.52982 10 9.875 10C10.2202 10 10.5 10.2798 10.5 10.625Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <CardTitle className="text-md">{section.name}</CardTitle>
              <CardDescription>
                {section.component?.name || "Bileşen bulunamadı"}
              </CardDescription>
            </div>
          </div>
          <div className="flex space-x-2">
            <Switch
              checked={section.isVisible}
              onCheckedChange={() => onToggleVisibility(section.id)}
              title={section.isVisible ? "Görünür" : "Gizli"}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(section.id)}
            >
              Düzenle
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(section.id)}
            >
              Sil
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default function PageEditor() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [page, setPage] = useState<StorePage | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<PageSection | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isComponentDialogOpen, setIsComponentDialogOpen] = useState(false);

  const fetchPageData = useCallback(async () => {
    try {
      setIsLoading(true);
      const pageResponse = await axios.get(`/api/store-pages/${pageId}`);
      setPage(pageResponse.data);

      const sectionsResponse = await axios.get(
        `/api/store-pages/${pageId}/sections`
      );
      setSections(sectionsResponse.data);

      const componentsResponse = await axios.get("/api/components");
      setComponents(componentsResponse.data);
    } catch (error) {
      console.error("Sayfa verileri yüklenirken hata oluştu:", error);
      setMessage({ type: "error", text: "Sayfa yüklenirken bir hata oluştu." });
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(
        (section) => section.id === active.id
      );
      const newIndex = sections.findIndex((section) => section.id === over.id);

      const updatedSections = [...sections];
      const movedSection = updatedSections.splice(oldIndex, 1)[0];
      updatedSections.splice(newIndex, 0, movedSection);

      // Sıralama güncellemesi
      const reorderedSections = updatedSections.map((section, index) => ({
        ...section,
        order: index + 1,
      }));

      setSections(reorderedSections);

      try {
        await axios.put(`/api/store-pages/${pageId}/sections/reorder`, {
          sectionIds: reorderedSections.map((section) => section.id),
        });
      } catch (error) {
        console.error("Bölüm sıralaması güncellenirken hata oluştu:", error);
        setMessage({
          type: "error",
          text: "Sıralama güncellenirken bir hata oluştu.",
        });
        fetchPageData(); // Hata durumunda orijinal veriyi geri yükle
      }
    }
  };

  const handleAddSection = async (componentId: string) => {
    try {
      // Bileşenin en son versiyonunu al
      const versionsResponse = await axios.get(
        `/api/components/${componentId}/versions`
      );
      const latestVersion = versionsResponse.data[0]; // En son versiyon ilk sırada olmalı

      if (!latestVersion) {
        setMessage({ type: "error", text: "Bileşen versiyonu bulunamadı." });
        return;
      }

      const component = components.find((comp) => comp.id === componentId);

      const newSection = {
        pageId,
        componentVersionId: latestVersion.id,
        name: component?.name || "Yeni Bölüm",
        props: component?.defaultProps || {},
        order: sections.length + 1,
        parentSectionId: null,
        containerSettings: {},
        styleOverrides: {},
        isVisible: true,
      };

      const response = await axios.post(`/api/page-sections`, newSection);

      // Yeni bölümü sayfaya ekle
      setSections((prev) => [
        ...prev,
        {
          ...response.data,
          component,
          componentVersion: latestVersion,
        },
      ]);

      setIsComponentDialogOpen(false);
      setMessage({ type: "success", text: "Bölüm başarıyla eklendi." });
    } catch (error) {
      console.error("Bölüm eklenirken hata oluştu:", error);
      setMessage({ type: "error", text: "Bölüm eklenirken bir hata oluştu." });
    }
  };

  const handleEditSection = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      setEditingSection(section);
      setActiveSection(sectionId);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await axios.delete(`/api/page-sections/${sectionId}`);
      setSections(sections.filter((section) => section.id !== sectionId));
      setMessage({ type: "success", text: "Bölüm başarıyla silindi." });

      if (activeSection === sectionId) {
        setActiveSection(null);
        setEditingSection(null);
      }
    } catch (error) {
      console.error("Bölüm silinirken hata oluştu:", error);
      setMessage({ type: "error", text: "Bölüm silinirken bir hata oluştu." });
    }
  };

  const handleToggleSectionVisibility = async (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const updatedSection = { ...section, isVisible: !section.isVisible };

    try {
      await axios.put(`/api/page-sections/${sectionId}`, {
        isVisible: updatedSection.isVisible,
      });

      setSections(
        sections.map((s) => (s.id === sectionId ? updatedSection : s))
      );
    } catch (error) {
      console.error("Bölüm görünürlüğü güncellenirken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Bölüm görünürlüğü güncellenirken bir hata oluştu.",
      });
    }
  };

  const handlePageSettingsSave = async (data: Partial<StorePage>) => {
    try {
      await axios.put(`/api/store-pages/${pageId}`, data);
      setPage((prev) => (prev ? { ...prev, ...data } : null));
      setMessage({
        type: "success",
        text: "Sayfa ayarları başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Sayfa ayarları güncellenirken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Sayfa ayarları güncellenirken bir hata oluştu.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">Yükleniyor...</div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto py-6">
        <Alert className="bg-red-100 border-red-600">
          <AlertDescription>Sayfa bulunamadı.</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push("/store-pages")}>
          Sayfalara Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{page.title} - Sayfa Düzenleyici</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/store-preview/${pageId}`)}
          >
            Önizleme
          </Button>
          <Button onClick={() => router.push("/store-pages")}>
            Sayfalara Dön
          </Button>
        </div>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${message.type === "success" ? "bg-green-100 border-green-600" : "bg-red-100 border-red-600"}`}
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="px-6 py-4 flex flex-row items-center justify-between">
              <CardTitle>Sayfa Bölümleri</CardTitle>
              <Dialog
                open={isComponentDialogOpen}
                onOpenChange={setIsComponentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>Bölüm Ekle</Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Bölüm Ekle</DialogTitle>
                    <DialogDescription>
                      Eklemek istediğiniz bileşeni seçin
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] mt-4">
                    <div className="grid grid-cols-2 gap-4 p-1">
                      {components.map((component) => (
                        <Card
                          key={component.id}
                          className="cursor-pointer hover:border-primary"
                          onClick={() => handleAddSection(component.id)}
                        >
                          <CardHeader className="p-4">
                            <CardTitle className="text-md">
                              {component.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {component.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0 pb-4 px-4">
                            <div className="flex gap-2">
                              <Badge variant="outline">{component.type}</Badge>
                              {component.isGlobal && <Badge>Global</Badge>}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-6">
              {sections.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-md">
                  <p className="text-muted-foreground">
                    Henüz bölüm eklenmemiş.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsComponentDialogOpen(true)}
                  >
                    İlk Bölümü Ekle
                  </Button>
                </div>
              ) : (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext
                    items={sections.map((section) => section.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {sections.map((section) => (
                      <SortableSection
                        key={section.id}
                        section={section}
                        activeId={activeSection}
                        onEdit={handleEditSection}
                        onDelete={handleDeleteSection}
                        onToggleVisibility={handleToggleSectionVisibility}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sayfa Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Sayfa Başlığı</Label>
                  <Input
                    id="title"
                    value={page.title}
                    onChange={(e) =>
                      setPage((prev) =>
                        prev ? { ...prev, title: e.target.value } : null
                      )
                    }
                    onBlur={() => handlePageSettingsSave({ title: page.title })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={page.slug}
                    onChange={(e) =>
                      setPage((prev) =>
                        prev ? { ...prev, slug: e.target.value } : null
                      )
                    }
                    onBlur={() => handlePageSettingsSave({ slug: page.slug })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Başlık</Label>
                <Input
                  id="metaTitle"
                  value={page.metaTitle}
                  onChange={(e) =>
                    setPage((prev) =>
                      prev ? { ...prev, metaTitle: e.target.value } : null
                    )
                  }
                  onBlur={() =>
                    handlePageSettingsSave({ metaTitle: page.metaTitle })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Açıklama</Label>
                <Input
                  id="metaDescription"
                  value={page.metaDescription}
                  onChange={(e) =>
                    setPage((prev) =>
                      prev ? { ...prev, metaDescription: e.target.value } : null
                    )
                  }
                  onBlur={() =>
                    handlePageSettingsSave({
                      metaDescription: page.metaDescription,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isHomePage" className="text-base">
                      Ana Sayfa
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Bu sayfayı mağazanın ana sayfası olarak ayarla
                    </p>
                  </div>
                  <Switch
                    id="isHomePage"
                    checked={page.isHomePage}
                    onCheckedChange={(checked) =>
                      handlePageSettingsSave({ isHomePage: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPublished" className="text-base">
                      Yayında
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Sayfa ziyaretçilere görünür olacak
                    </p>
                  </div>
                  <Switch
                    id="isPublished"
                    checked={page.isPublished}
                    onCheckedChange={(checked) =>
                      handlePageSettingsSave({ isPublished: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {editingSection ? (
            <Card>
              <CardHeader>
                <CardTitle>Bölüm Düzenle: {editingSection.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sectionName">Bölüm Adı</Label>
                  <Input
                    id="sectionName"
                    value={editingSection.name}
                    onChange={(e) =>
                      setEditingSection((prev) =>
                        prev ? { ...prev, name: e.target.value } : null
                      )
                    }
                  />
                </div>

                {/* Bileşen özelliklerini dinamik olarak render etme kısmı */}
                <div className="space-y-4">
                  <h3 className="font-medium">Bileşen Özellikleri</h3>
                  {Object.entries(editingSection.props || {}).map(
                    ([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={`prop-${key}`}>{key}</Label>
                        <Input
                          id={`prop-${key}`}
                          value={
                            typeof value === "string"
                              ? value
                              : JSON.stringify(value)
                          }
                          onChange={(e) => {
                            setEditingSection((prev) => {
                              if (!prev) return null;
                              return {
                                ...prev,
                                props: {
                                  ...prev.props,
                                  [key]: e.target.value,
                                },
                              };
                            });
                          }}
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingSection(null);
                      setActiveSection(null);
                    }}
                  >
                    İptal
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        await axios.put(
                          `/api/page-sections/${editingSection.id}`,
                          {
                            name: editingSection.name,
                            props: editingSection.props,
                          }
                        );

                        setSections((prev) =>
                          prev.map((s) =>
                            s.id === editingSection.id ? editingSection : s
                          )
                        );

                        setMessage({
                          type: "success",
                          text: "Bölüm başarıyla güncellendi.",
                        });
                        setEditingSection(null);
                        setActiveSection(null);
                      } catch (error) {
                        console.error(
                          "Bölüm güncellenirken hata oluştu:",
                          error
                        );
                        setMessage({
                          type: "error",
                          text: "Bölüm güncellenirken bir hata oluştu.",
                        });
                      }
                    }}
                  >
                    Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Düzenleme Yardımı</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Düzenlemek için sol taraftan bir bölüm seçin.
                </p>
                <p className="text-muted-foreground mt-2">
                  Sürükle ve bırak ile bölümlerin sırasını değiştirebilirsiniz.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
