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
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LuLayers,
  LuPencil,
  LuTrash2,
  LuPlus,
  LuEye,
  LuEyeOff,
  LuMove,
  LuSettings,
  LuHouse,
  LuGlobe,
  LuArrowLeft,
  LuSave,
  LuLayoutTemplate,
  LuCheck,
  LuTriangleAlert,
  LuExternalLink,
  LuSearch,
  LuRefreshCw,
  LuType,
  LuPalette,
  LuImage,
  LuLink,
  LuToggleLeft,
  LuList,
  LuHash,
} from "react-icons/lu";

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
  code: string;
  schema: any; // Bileşenin şeması
  preview?: string;
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

// Özellik türünü belirleyen fonksiyon
const getPropertyType = (propSchema: any): string => {
  if (!propSchema.type) return "Metin";

  switch (propSchema.type) {
    case "string":
      if (propSchema.format === "color") return "Renk";
      if (propSchema.format === "url") return "Bağlantı";
      if (propSchema.format === "email") return "E-posta";
      if (propSchema.format === "date") return "Tarih";
      if (propSchema.format === "time") return "Saat";
      if (propSchema.format === "image") return "Resim";
      if (propSchema.enum) return "Liste";
      if (propSchema.maxLength && propSchema.maxLength > 100)
        return "Uzun Metin";
      return "Metin";
    case "number":
    case "integer":
      return "Sayı";
    case "boolean":
      return "Açık/Kapalı";
    case "array":
      return "Liste";
    case "object":
      return "Nesne";
    default:
      return propSchema.type;
  }
};

// Özellik tipine göre uygun giriş bileşenini döndüren fonksiyon
const getPropertyInput = (
  key: string,
  propSchema: any,
  editingSection: PageSection,
  setEditingSection: React.Dispatch<React.SetStateAction<PageSection | null>>
) => {
  const value =
    (editingSection.props && editingSection.props[key]) !== undefined
      ? editingSection.props[key]
      : propSchema.default || "";

  const handleChange = (newValue: any) => {
    setEditingSection((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        props: {
          ...prev.props,
          [key]: newValue,
        },
      };
    });
  };

  // Özellik tipine göre uygun giriş bileşeni
  switch (propSchema.type) {
    case "string":
      // Renk seçici
      if (propSchema.format === "color") {
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-md border border-gray-300"
              style={{ backgroundColor: value || "#ffffff" }}
            />
            <Input
              id={`prop-${key}`}
              type="color"
              value={value || "#ffffff"}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full h-10 border-gray-300 focus:border-blue-400"
            />
          </div>
        );
      }

      // URL giriş alanı
      if (propSchema.format === "url") {
        return (
          <div className="relative">
            <Input
              id={`prop-${key}`}
              type="url"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className="border-gray-300 focus:border-blue-400 pl-9"
              placeholder="https://example.com"
            />
            <LuLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        );
      }

      // Resim seçici
      if (propSchema.format === "image") {
        return (
          <div className="relative">
            <Input
              id={`prop-${key}`}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className="border-gray-300 focus:border-blue-400 pl-9"
              placeholder="/images/example.jpg"
            />
            <LuImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        );
      }

      // Seçenek listesi
      if (propSchema.enum) {
        return (
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger className="border-gray-300 focus:border-blue-400">
              <SelectValue placeholder="Seçiniz..." />
            </SelectTrigger>
            <SelectContent>
              {propSchema.enum.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      // Çok satırlı metin
      if (propSchema.maxLength && propSchema.maxLength > 100) {
        return (
          <Textarea
            id={`prop-${key}`}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="border-gray-300 focus:border-blue-400 min-h-[100px]"
            placeholder={propSchema.placeholder || ""}
          />
        );
      }

      // Standart metin girişi
      return (
        <div className="relative">
          <Input
            id={`prop-${key}`}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="border-gray-300 focus:border-blue-400 pl-9"
            placeholder={propSchema.placeholder || ""}
          />
          <LuType className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      );

    case "number":
    case "integer":
      return (
        <div className="relative">
          <Input
            id={`prop-${key}`}
            type="number"
            value={value}
            onChange={(e) => handleChange(parseFloat(e.target.value))}
            className="border-gray-300 focus:border-blue-400 pl-9"
            min={propSchema.minimum}
            max={propSchema.maximum}
            step={propSchema.type === "integer" ? 1 : 0.1}
          />
          <LuHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
          <span className="text-sm text-gray-700">
            {value ? "Aktif" : "Pasif"}
          </span>
          <Switch
            id={`prop-${key}`}
            checked={value === true}
            onCheckedChange={(checked) => handleChange(checked)}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>
      );

    default:
      return (
        <Input
          id={`prop-${key}`}
          value={typeof value === "string" ? value : JSON.stringify(value)}
          onChange={(e) => {
            try {
              // JSON formatında ise parse etmeyi dene
              if (
                e.target.value.startsWith("{") ||
                e.target.value.startsWith("[")
              ) {
                handleChange(JSON.parse(e.target.value));
              } else {
                handleChange(e.target.value);
              }
            } catch (error) {
              // Parse edilemezse string olarak kaydet
              handleChange(e.target.value);
            }
          }}
          className="border-gray-300 focus:border-blue-400"
        />
      );
  }
};

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

  // Bileşen tipine göre ikon belirleme
  const getComponentIcon = () => {
    const type = section.component?.type?.toLowerCase() || "";

    if (type.includes("header"))
      return <LuLayoutTemplate className="h-4 w-4" />;
    if (type.includes("footer"))
      return <LuLayoutTemplate className="h-4 w-4" />;
    if (type.includes("sidebar"))
      return <LuLayoutTemplate className="h-4 w-4" />;
    return <LuLayers className="h-4 w-4" />;
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`border ${
          activeId === section.id
            ? "border-blue-500 ring-2 ring-blue-100"
            : "border-gray-200 hover:border-gray-300"
        } transition-all duration-200 shadow-sm hover:shadow`}
      >
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-move p-2 hover:bg-gray-100 rounded text-gray-600"
              title="Sürükle"
            >
              <LuMove className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-md flex items-center gap-2">
                  {section.name}
                  <Badge
                    variant="outline"
                    className="text-xs px-1.5 py-0 h-5 bg-blue-50 text-blue-600 border-blue-200"
                  >
                    {getComponentIcon()}
                  </Badge>
                </CardTitle>
              </div>
              <CardDescription className="flex items-center gap-1">
                <span>{section.component?.name || "Bileşen bulunamadı"}</span>
                {section.component?.type && (
                  <Badge
                    variant="outline"
                    className="ml-1 text-xs px-1.5 py-0 h-5 bg-gray-50 text-gray-600 border-gray-200"
                  >
                    {section.component.type}
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 mr-2">
              <span className="text-xs text-gray-500">Görünür</span>
              <Switch
                checked={section.isVisible}
                onCheckedChange={() => onToggleVisibility(section.id)}
                title={section.isVisible ? "Görünür" : "Gizli"}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2 gap-1 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              onClick={() => onEdit(section.id)}
            >
              <LuPencil className="h-3.5 w-3.5" />
              Düzenle
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2 gap-1 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              onClick={() => onDelete(section.id)}
            >
              <LuTrash2 className="h-3.5 w-3.5" />
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
      const sectionsData = sectionsResponse.data;

      // Bölümlere ait bileşen versiyonlarını almak için istekleri toplu yap
      const versionsPromises = sectionsData.map((section: PageSection) =>
        axios.get(`/api/component-versions/${section.componentVersionId}`)
      );

      const versionResponses = await Promise.all(versionsPromises);
      const versions = versionResponses.map((response) => response.data);

      // Her bölüm için bileşen versiyon bilgilerini eşleştir
      const sectionsWithVersions = sectionsData.map(
        (section: PageSection, index: number) => ({
          ...section,
          componentVersion: versions[index],
        })
      );

      setSections(sectionsWithVersions);

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

      // Bileşen şemasından varsayılan props'ları oluştur
      let defaultProps = {};
      if (latestVersion.schema?.properties) {
        Object.entries(latestVersion.schema.properties).forEach(
          ([key, value]: [string, any]) => {
            defaultProps = {
              ...defaultProps,
              [key]: value.default || "",
            };
          }
        );
      }

      const newSection = {
        pageId,
        componentVersionId: latestVersion.id,
        name: component?.name || "Yeni Bölüm",
        props: defaultProps,
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
      // Bileşen versiyonunun schema bilgisini alıyoruz
      if (section.componentVersion?.schema?.properties) {
        // Eğer props tanımlı değilse veya boşsa, schema'dan varsayılan değerleri kullanabiliriz
        if (!section.props || Object.keys(section.props).length === 0) {
          const defaultProps: Record<string, any> = {};

          // Schema'dan varsayılan değerleri alıyoruz
          Object.entries(section.componentVersion.schema.properties).forEach(
            ([key, value]: [string, any]) => {
              defaultProps[key] = value.default || "";
            }
          );

          // Props'ları güncelliyoruz
          section.props = defaultProps;
        }
      }

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
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Sayfa yükleniyor...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto py-8">
        <Alert className="bg-red-50 border-l-4 border-red-500">
          <div className="flex items-center">
            <LuTriangleAlert className="h-5 w-5 mr-2 text-red-500" />
            <AlertDescription className="text-red-800">
              Sayfa bulunamadı.
            </AlertDescription>
          </div>
        </Alert>
        <Button
          className="mt-6 gap-2"
          onClick={() => router.push("/store-pages")}
        >
          <LuArrowLeft className="h-4 w-4" />
          Sayfalara Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Üst Başlık Bölümü */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <LuLayoutTemplate className="h-8 w-8 text-blue-600" />
              {page.title}
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl flex items-center">
              <span className="text-blue-500 font-medium mr-2">
                /{page.slug}
              </span>
              {page.isPublished ? (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 border-green-300 ml-2 gap-1"
                >
                  <LuGlobe className="h-3 w-3" />
                  Yayında
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 border-amber-300 ml-2 gap-1"
                >
                  <LuEyeOff className="h-3 w-3" />
                  Taslak
                </Badge>
              )}
              {page.isHomePage && (
                <Badge
                  variant="outline"
                  className="bg-purple-100 text-purple-800 border-purple-300 ml-2 gap-1"
                >
                  <LuHouse className="h-3 w-3" />
                  Ana Sayfa
                </Badge>
              )}
            </p>
          </div>
          <div className="flex space-x-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                className="gap-2 shadow-sm border-gray-300 hover:border-gray-400"
                onClick={() => router.push(`/store-preview/${pageId}`)}
              >
                <LuExternalLink className="h-4 w-4" />
                Önizleme
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => router.push("/store-pages")}
                className="gap-2 shadow-sm"
              >
                <LuArrowLeft className="h-4 w-4" />
                Sayfalara Dön
              </Button>
            </motion.div>
          </div>
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
                <LuTriangleAlert className="h-5 w-5 mr-2" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </div>
          </Alert>
        </motion.div>
      )}

      {/* Ana içerik düzeni */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol taraf: Sayfa bölümleri ve sayfanın genel ayarları */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sayfa bölümleri kartı */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <LuLayers className="h-5 w-5 text-blue-600" />
                  <CardTitle>Sayfa Bölümleri</CardTitle>
                </div>
                <Dialog
                  open={isComponentDialogOpen}
                  onOpenChange={setIsComponentDialogOpen}
                >
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <LuPlus className="h-4 w-4" />
                        Bölüm Ekle
                      </Button>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl flex items-center gap-2">
                        <LuPlus className="h-5 w-5 text-blue-600" />
                        Bölüm Ekle
                      </DialogTitle>
                      <DialogDescription className="text-base">
                        Eklemek istediğiniz bileşeni seçin. Seçtiğiniz bileşen
                        sayfanızda bir bölüm olarak görünecektir.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="my-2 relative">
                      <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Bileşen ara..."
                        className="pl-10 bg-gray-50 border-gray-200"
                      />
                    </div>
                    <ScrollArea className="h-[400px] mt-4 pr-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                        {components.map((component) => (
                          <motion.div
                            key={component.id}
                            whileHover={{ y: -5, scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card
                              className="cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200"
                              onClick={() => handleAddSection(component.id)}
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {component.name}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                  {component.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0 pb-3">
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge
                                    variant="outline"
                                    className="bg-gray-100 text-gray-700"
                                  >
                                    {component.type}
                                  </Badge>
                                  {component.isGlobal && (
                                    <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                                      Global
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                              <CardFooter className="pt-0 border-t border-gray-100 flex justify-end">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-600 hover:text-blue-700 gap-1"
                                >
                                  <LuPlus className="h-4 w-4" />
                                  Ekle
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-6">
                {sections.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-md border border-dashed border-gray-300">
                    <div className="bg-white p-4 rounded-full shadow-sm border inline-block mb-4">
                      <LuLayers className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Henüz bölüm eklenmemiş
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Sayfanızın içeriğini oluşturmak için bileşenler ekleyin.
                      Sürükle ve bırak ile düzenleyebilirsiniz.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => setIsComponentDialogOpen(true)}
                      >
                        <LuPlus className="h-4 w-4" />
                        İlk Bölümü Ekle
                      </Button>
                    </motion.div>
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
                      <div className="space-y-3">
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
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sayfa Ayarları Kartı */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <LuSettings className="h-5 w-5 text-blue-600" />
                  <CardTitle>Sayfa Ayarları</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-medium">
                      Sayfa Başlığı
                    </Label>
                    <Input
                      id="title"
                      value={page.title}
                      onChange={(e) =>
                        setPage((prev) =>
                          prev ? { ...prev, title: e.target.value } : null
                        )
                      }
                      onBlur={() =>
                        handlePageSettingsSave({ title: page.title })
                      }
                      className="border-gray-300 focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="font-medium">
                      URL Slug
                    </Label>
                    <div className="relative">
                      <Input
                        id="slug"
                        value={page.slug}
                        onChange={(e) =>
                          setPage((prev) =>
                            prev ? { ...prev, slug: e.target.value } : null
                          )
                        }
                        onBlur={() =>
                          handlePageSettingsSave({ slug: page.slug })
                        }
                        className="border-gray-300 focus:border-blue-400 pl-8"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        /
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaTitle" className="font-medium">
                    Meta Başlık (SEO)
                  </Label>
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
                    className="border-gray-300 focus:border-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription" className="font-medium">
                    Meta Açıklama (SEO)
                  </Label>
                  <Input
                    id="metaDescription"
                    value={page.metaDescription}
                    onChange={(e) =>
                      setPage((prev) =>
                        prev
                          ? { ...prev, metaDescription: e.target.value }
                          : null
                      )
                    }
                    onBlur={() =>
                      handlePageSettingsSave({
                        metaDescription: page.metaDescription,
                      })
                    }
                    className="border-gray-300 focus:border-blue-400"
                  />
                  <p className="text-xs text-gray-500">
                    Bu açıklama, arama motorlarında ve sosyal medya
                    paylaşımlarında görünecektir.
                  </p>
                </div>

                <Separator className="my-2" />

                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <div>
                      <Label
                        htmlFor="isHomePage"
                        className="text-base font-medium flex items-center gap-2"
                      >
                        <LuHouse className="h-4 w-4 text-purple-600" />
                        Ana Sayfa
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        Bu sayfayı mağazanın ana sayfası olarak ayarla
                      </p>
                    </div>
                    <Switch
                      id="isHomePage"
                      checked={page.isHomePage}
                      onCheckedChange={(checked) =>
                        handlePageSettingsSave({ isHomePage: checked })
                      }
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <div>
                      <Label
                        htmlFor="isPublished"
                        className="text-base font-medium flex items-center gap-2"
                      >
                        <LuGlobe className="h-4 w-4 text-green-600" />
                        Yayında
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        Sayfa ziyaretçilere görünür olacak
                      </p>
                    </div>
                    <Switch
                      id="isPublished"
                      checked={page.isPublished}
                      onCheckedChange={(checked) =>
                        handlePageSettingsSave({ isPublished: checked })
                      }
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sağ taraf: Bölüm düzenleme paneli */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {editingSection ? (
              <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 sticky top-4">
                <CardHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <LuPencil className="h-5 w-5 text-blue-600" />
                    Bölüm Düzenle: {editingSection.name}
                  </CardTitle>
                  <CardDescription>
                    {editingSection.component?.name || "Bileşen"} özelliklerini
                    özelleştirin
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="sectionName" className="font-medium">
                      Bölüm Adı
                    </Label>
                    <Input
                      id="sectionName"
                      value={editingSection.name}
                      onChange={(e) =>
                        setEditingSection((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                      className="border-gray-300 focus:border-blue-400"
                    />
                  </div>

                  {/* Bileşen özelliklerini dinamik olarak render etme kısmı */}
                  <div className="space-y-5 mt-2">
                    <h3 className="font-medium text-xl flex items-center gap-2 text-blue-700 mb-3">
                      <LuSettings className="h-5 w-5 text-blue-600" />
                      Bileşen Özellikleri
                    </h3>

                    <div className="rounded-xl overflow-hidden">
                      {editingSection.componentVersion?.schema?.properties ? (
                        Object.entries(
                          editingSection.componentVersion.schema.properties
                        ).map(([key, propSchema]: [string, any], index) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={`p-4 ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } border-b border-gray-200 last:border-0 transition-all hover:bg-blue-50 group/item`}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <Label
                                  htmlFor={`prop-${key}`}
                                  className="font-medium text-blue-800 flex items-center gap-2"
                                >
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                    {index + 1}
                                  </span>
                                  {propSchema.title || key}
                                  {propSchema.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                  )}
                                </Label>
                                <div className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded group-hover/item:bg-blue-100 group-hover/item:text-blue-700 transition-colors">
                                  {getPropertyType(propSchema)}
                                </div>
                              </div>

                              {getPropertyInput(
                                key,
                                propSchema,
                                editingSection,
                                setEditingSection
                              )}

                              {propSchema.description && (
                                <p className="text-xs text-gray-500 italic flex items-center gap-1 mt-1">
                                  <LuTriangleAlert className="h-3 w-3 text-blue-400" />
                                  {propSchema.description}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                          <div className="bg-white p-3 inline-flex rounded-full shadow-sm mb-3">
                            <LuSettings className="h-6 w-6 text-gray-400" />
                          </div>
                          <h4 className="text-gray-600 font-medium">
                            Özellik bulunamadı
                          </h4>
                          <p className="text-gray-500 text-sm mt-1">
                            Bu bileşen için ayarlanabilir özellik
                            bulunmamaktadır.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardFooter className="px-0 pt-5 flex justify-end space-x-3 border-t border-gray-100 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingSection(null);
                        setActiveSection(null);
                      }}
                      className="gap-2 border-gray-300"
                    >
                      <LuTrash2 className="h-4 w-4" />
                      İptal
                    </Button>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
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
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <LuSave className="h-4 w-4" />
                        Kaydet
                      </Button>
                    </motion.div>
                  </CardFooter>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 sticky top-4">
                <CardHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <LuPencil className="h-5 w-5 text-blue-600" />
                    Düzenleme Yardımı
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Nasıl düzenlerim?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Sol taraftan bir bölümü seçerek düzenlemeye
                      başlayabilirsiniz.
                    </p>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 rounded-full p-2 text-blue-600 mt-1">
                        <LuMove className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">
                          Sürükle & Bırak
                        </h4>
                        <p className="text-gray-600 mt-1">
                          Bölümleri sürükleyerek sıralamalarını
                          değiştirebilirsiniz.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 rounded-full p-2 text-blue-600 mt-1">
                        <LuEye className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">
                          Görünürlük
                        </h4>
                        <p className="text-gray-600 mt-1">
                          Bölümleri açıp kapatarak görünürlüğünü kontrol
                          edebilirsiniz.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 rounded-full p-2 text-blue-600 mt-1">
                        <LuPlus className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">
                          Bölüm Ekle
                        </h4>
                        <p className="text-gray-600 mt-1">
                          "Bölüm Ekle" butonuyla yeni içerikler
                          ekleyebilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
