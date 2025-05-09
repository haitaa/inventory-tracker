"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  LuPencil,
  LuExternalLink,
  LuArrowLeft,
  LuGlobe,
  LuEyeOff,
  LuHouse,
  LuMonitor,
  LuSmartphone,
  LuTablet,
  LuInfo,
  LuSettings,
  LuLayoutTemplate,
  LuLayers,
  LuCode,
  LuCheck,
  LuTriangleAlert,
} from "react-icons/lu";

interface Component {
  id: string;
  name: string;
  description: string;
  type: string;
}

interface ComponentVersion {
  id: string;
  componentId: string;
  version: string;
  code: string;
  schema: any;
  preview?: string;
  isActive: boolean;
  template?: string;
  style?: string;
  script?: string;
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
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  isHomePage: boolean;
  sections: PageSection[];
  updatedAt: string;
}

export default function StorePreview() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [page, setPage] = useState<StorePage | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [storePages, setStorePages] = useState<StorePage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [renderedHTML, setRenderedHTML] = useState<string>("");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);

        // Sayfa bilgilerini al
        const pageResponse = await axios.get(`/api/store-pages/${pageId}`);
        setPage(pageResponse.data);

        // Sayfa bölümlerini al
        const sectionsResponse = await axios.get(
          `/api/store-pages/${pageId}/sections`
        );

        // Bölümleri sıralama değerine göre sırala
        const sortedSections = [...sectionsResponse.data].sort(
          (a, b) => a.order - b.order
        );
        setSections(sortedSections);

        // Tüm mağaza sayfalarını al
        const storePagesResponse = await axios.get("/api/store-pages");
        setStorePages(storePagesResponse.data);
        console.log("Tüm mağaza sayfaları:", storePagesResponse.data);

        // Bölüm verilerini kullanarak HTML oluştur
        generateHTML(sortedSections);
      } catch (error) {
        console.error("Önizleme verisi yüklenirken hata oluştu:", error);
        setMessage({
          type: "error",
          text: "Önizleme yüklenirken bir hata oluştu.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [pageId]);

  const generateHTML = async (pageSections: PageSection[]) => {
    if (!pageSections.length) {
      setRenderedHTML(
        '<div class="preview-empty">Bu sayfada henüz içerik yok.</div>'
      );
      return;
    }

    try {
      // Debug ekle - Bölümleri kontrol et
      console.log("Önizlemede işlenecek bölümler:", pageSections);

      // Bölümlerin bileşen versiyonlarını almak için istekleri toplu yap
      const versionsPromises = pageSections.map((section) =>
        axios.get(`/api/component-versions/${section.componentVersionId}`)
      );

      const versionResponses = await Promise.all(versionsPromises);
      const versions = versionResponses.map((response) => response.data);

      // Debug ekle - Bileşen versiyonlarını kontrol et
      console.log("Bileşen versiyonları:", versions);

      // Her bölüm için bileşen versiyon verilerini eşleştir
      const sectionsWithVersions = pageSections.map((section, index) => ({
        ...section,
        componentVersion: versions[index],
      }));

      // Debug ekle - Eşleştirilmiş bölümleri kontrol et
      console.log("Eşleştirilmiş bölümler:", sectionsWithVersions);

      // Her bileşenin code alanını ayrıştır
      const enhancedSections = sectionsWithVersions.map((section) => {
        // Varsayılan boş değerler
        let template = "";
        let style = "";
        let script = "";

        // code değerinden HTML, CSS ve JS'yi ayrıştır
        if (section.componentVersion?.code) {
          const codeContent = section.componentVersion.code;

          // HTML şablonunu ayrıştır
          const htmlMatch = codeContent.match(
            /<!-- HTML Template -->\s*([^<]*<[\s\S]*?>[\s\S]*?)(?=\s*<!-- CSS Styles -->|$)/
          );
          if (htmlMatch && htmlMatch[1]) {
            template = htmlMatch[1].trim();
          }

          // CSS stillerini ayrıştır
          const cssMatch = codeContent.match(
            /<style>\s*([\s\S]*?)\s*<\/style>/
          );
          if (cssMatch && cssMatch[1]) {
            style = cssMatch[1].trim();
          }

          // JavaScript ayrıştır
          const jsMatch = codeContent.match(
            /<script>\s*([\s\S]*?)\s*<\/script>/
          );
          if (jsMatch && jsMatch[1]) {
            script = jsMatch[1].trim();
          }
        }

        console.log(`Bölüm ${section.id} için ayrıştırılan şablon:`, template);
        console.log(`Bölüm ${section.id} için ayrıştırılan stil:`, style);

        return {
          ...section,
          componentVersion: {
            ...section.componentVersion,
            template,
            style,
            script,
          },
        };
      });

      // HTML, CSS ve JS kodlarını birleştir
      let htmlContent = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${page?.title || "Önizleme"}</title>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; 
            }
            .preview-container {
              width: 100%;
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 20px;
              display: grid;
              grid-template-columns: 1fr;
              grid-gap: 20px;
            }
            .page-layout {
              display: grid;
              grid-template-columns: 1fr;
              grid-gap: 20px;
            }
            /* Sidebar içeren düzen için grid yapısını değiştir */
            .with-sidebar {
              display: grid;
              grid-template-columns: 280px 1fr;
              grid-gap: 20px;
            }
            /* Sidebar container için yapışkan stil */
            .sidebar-container {
              position: sticky;
              top: 20px;
              max-height: calc(100vh - 40px);
              overflow-y: auto;
              padding: 16px;
              background-color: #f9f9f9;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            /* Sidebar içindeki sayfa listesi */
            .sidebar-pages {
              margin-top: 20px;
            }
            .sidebar-pages h3 {
              font-size: 16px;
              margin-bottom: 12px;
              font-weight: 600;
              color: #333;
            }
            .sidebar-pages ul {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            .sidebar-pages li {
              margin-bottom: 8px;
              padding: 6px 8px;
              border-radius: 4px;
            }
            .sidebar-pages li.active {
              background-color: rgba(0,0,0,0.05);
              font-weight: 500;
            }
            .sidebar-pages a {
              color: #333;
              text-decoration: none;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .sidebar-pages .home-badge {
              background-color: #e3f2fd;
              color: #1976d2;
              font-size: 10px;
              padding: 2px 6px;
              border-radius: 4px;
              font-weight: normal;
            }
            /* Mobil cihazlar için responsive düzen */
            @media (max-width: 768px) {
              .with-sidebar {
                grid-template-columns: 1fr;
              }
              .sidebar-container {
                position: relative;
                top: 0;
                max-height: none;
                display: none; /* Mobil görünümde sidebar'ı gizle */
              }
            }
            .preview-empty {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 300px;
              border: 2px dashed #ccc;
              border-radius: 8px;
              margin: 20px 0;
              color: #666;
            }
            /* Bileşenlerin stillerini ekle */
            ${enhancedSections
              .filter((section) => section.isVisible)
              .map((section) => section.componentVersion?.style || "")
              .join("\n")}
            /* Özel stil geçersiz kılmaları */
            ${enhancedSections
              .filter((section) => section.isVisible)
              .map((section) => {
                const customStyles = section.styleOverrides
                  ? Object.entries(section.styleOverrides)
                      .map(
                        ([selector, rules]) =>
                          `#section-${section.id} ${selector} { ${rules} }`
                      )
                      .join("\n")
                  : "";
                return customStyles;
              })
              .join("\n")}
          </style>
        </head>
        <body>
          <div class="preview-container">
            <!-- Sayfa içeriğini sidebar ve ana içerik şeklinde düzenleme -->
            <div class="page-layout ${hasSidebar(enhancedSections) ? "with-sidebar" : ""}">
              ${renderSidebar(enhancedSections)}
              <div class="main-content">
                ${renderMainContent(enhancedSections)}
              </div>
            </div>
          </div>
          <script>
            ${enhancedSections
              .filter((section) => section.isVisible)
              .map((section) => section.componentVersion?.script || "")
              .join("\n")}
          </script>
        </body>
        </html>
      `;

      // Debug ekle - Oluşturulan HTML'i kontrol et
      console.log("Oluşturulan HTML:", htmlContent);

      setRenderedHTML(htmlContent);
    } catch (error) {
      console.error("HTML oluşturulurken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Önizleme oluşturulurken bir hata oluştu.",
      });
    }
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      await axios.put(`/api/store-pages/${pageId}/publish`, {
        isPublished: true,
      });
      setMessage({ type: "success", text: "Sayfa başarıyla yayınlandı!" });

      // Sayfanın durumunu güncelle
      if (page) {
        setPage({ ...page, isPublished: true });
      }
    } catch (error) {
      console.error("Sayfa yayınlanırken hata oluştu:", error);
      setMessage({
        type: "error",
        text: "Sayfa yayınlanırken bir hata oluştu.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    // Iframe'in içeriğini güncelle
    if (iframeRef.current && renderedHTML) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(renderedHTML);
        doc.close();
      }
    }
  }, [renderedHTML, viewMode]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Sayfa yükleniyor...</p>
      </div>
    );
  }

  const getIframeWidth = () => {
    switch (viewMode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      case "desktop":
        return "100%";
      default:
        return "100%";
    }
  };

  // Sidebar var mı kontrol et
  function hasSidebar(sections: PageSection[]): boolean {
    return sections.some(
      (section: PageSection) =>
        section.isVisible &&
        section.componentVersion?.code &&
        section.componentVersion.code.toLowerCase().includes("sidebar")
    );
  }

  // Sidebar bileşenini render et
  function renderSidebar(sections: PageSection[]): string {
    const sidebarSection = sections.find(
      (section: PageSection) =>
        section.isVisible &&
        section.componentVersion?.code &&
        section.componentVersion.code.toLowerCase().includes("sidebar")
    );

    if (sidebarSection) {
      let template = sidebarSection.componentVersion?.template || "";

      // Özellikleri işle
      if (sidebarSection.props) {
        Object.entries(sidebarSection.props).forEach(([key, value]) => {
          const regex = new RegExp(`{{{${key}}}}`, "g");
          template = template.replace(regex, String(value));
        });
      }

      // Tüm mağaza sayfalarını sidebar'a ekle
      let pagesListHTML = '<div class="sidebar-pages"><h3>Sayfalar</h3><ul>';
      storePages.forEach((storePage) => {
        const isActive = storePage.id === pageId;
        pagesListHTML += `
          <li class="${isActive ? "active" : ""}">
            <a href="/store-preview/${storePage.id}" title="${storePage.title}">
              ${storePage.title}
              ${storePage.isHomePage ? '<span class="home-badge">Ana Sayfa</span>' : ""}
            </a>
          </li>
        `;
      });
      pagesListHTML += "</ul></div>";

      // Sayfa listesini sidebar şablonuna ekle
      template += pagesListHTML;

      // Koşullu içeriği işle ({{{showContact}}} vb.)
      template = template.replace(/{{{[^}]+}}}/g, "");

      return `<aside id="section-${sidebarSection.id}" class="sidebar-container">${template}</aside>`;
    }

    return "";
  }

  // Ana içerik bölümlerini render et (sidebar hariç)
  function renderMainContent(sections: PageSection[]): string {
    return sections
      .filter(
        (section: PageSection) =>
          section.isVisible &&
          !(
            section.componentVersion?.code &&
            section.componentVersion.code.toLowerCase().includes("sidebar")
          )
      )
      .map((section: PageSection) => {
        // Her bölüm için bileşenin HTML şablonunu al
        let template = section.componentVersion?.template || "";

        // Handlebars koşullu ifadeleri işle ({{#condition}} içerik {{/condition}})
        if (section.props) {
          // Önce koşullu ifadeleri işle
          const conditionalRegex = /{{#([a-zA-Z0-9_]+)}}([\s\S]*?){{\/\1}}/g;
          template = template.replace(
            conditionalRegex,
            (match, condition, content) => {
              // Koşul değerini props'tan al
              const conditionValue = section.props[condition];
              // Koşul doğruysa içeriği göster, değilse boş string döndür
              return conditionValue ? content : "";
            }
          );

          // Sonra normal değişkenleri işle
          Object.entries(section.props).forEach(([key, value]) => {
            const regex = new RegExp(`{{{${key}}}}`, "g");
            template = template.replace(
              regex,
              value !== undefined ? String(value) : ""
            );
          });
        }

        // Kalan yer tutucuları temizle
        template = template.replace(/{{{[^}]+}}}/g, "");

        // Kalan Handlebars ifadelerini temizle
        template = template.replace(/{{[^}]+}}/g, "");

        return `<div id="section-${section.id}" class="section">${template}</div>`;
      })
      .join("\n");
  }

  return (
    <div className="container mx-auto py-6">
      {/* Başlık Bölümü */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <LuLayoutTemplate className="h-8 w-8 text-blue-600" />
              {page?.title || "Sayfa Önizleme"}
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl flex items-center">
              <span className="text-blue-500 font-medium mr-2">
                /{page?.slug || ""}
              </span>
              {page?.isPublished ? (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 border-green-300 ml-2 gap-1 font-medium"
                >
                  <LuGlobe className="h-3 w-3" />
                  Yayında
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 border-amber-300 ml-2 gap-1 font-medium"
                >
                  <LuEyeOff className="h-3 w-3" />
                  Taslak
                </Badge>
              )}
              {page?.isHomePage && (
                <Badge
                  variant="outline"
                  className="bg-purple-100 text-purple-800 border-purple-300 ml-2 gap-1 font-medium"
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
                onClick={() => router.push(`/page-editor/${pageId}`)}
              >
                <LuPencil className="h-4 w-4" />
                Düzenleyiciye Dön
              </Button>
            </motion.div>
            {!page?.isPublished && (
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="shadow-sm gap-2"
                >
                  <LuGlobe className="h-4 w-4" />
                  {isPublishing ? "Yayınlanıyor..." : "Yayınla"}
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-indigo-600 mt-4 rounded-full opacity-50"></div>
      </motion.div>

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

      {/* SEO Bilgileri Kartı */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="mb-6 p-4 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold flex items-center gap-2 text-gray-700">
                <LuInfo className="h-4 w-4 text-blue-600" />
                SEO Bilgileri
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium">Meta Başlık:</span>{" "}
                {page?.metaTitle || page?.title || "Belirtilmemiş"}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Meta Açıklama:</span>{" "}
                {page?.metaDescription || "Belirtilmemiş"}
              </p>
            </div>
            <Tabs
              defaultValue="desktop"
              value={viewMode}
              onValueChange={(value) =>
                setViewMode(value as "desktop" | "tablet" | "mobile")
              }
              className="w-auto"
            >
              <TabsList className="grid w-auto grid-cols-3 bg-gray-100">
                <TabsTrigger
                  value="desktop"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <div className="flex items-center gap-1.5">
                    <LuMonitor className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:inline-block text-xs">
                      Masaüstü
                    </span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="tablet"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <div className="flex items-center gap-1.5">
                    <LuTablet className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:inline-block text-xs">
                      Tablet
                    </span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="mobile"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <div className="flex items-center gap-1.5">
                    <LuSmartphone className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:inline-block text-xs">
                      Mobil
                    </span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Card>
      </motion.div>

      {/* İframe Önizleme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div
          className="border rounded-md overflow-hidden bg-gray-100 shadow-md"
          style={{
            height: "calc(100vh - 250px)",
            display: "flex",
            justifyContent: "center",
            padding: viewMode !== "desktop" ? "20px" : "0",
          }}
        >
          <iframe
            ref={iframeRef}
            style={{
              width: getIframeWidth(),
              height: "100%",
              border: "none",
              backgroundColor: "white",
              boxShadow:
                viewMode !== "desktop" ? "0 0 20px rgba(0,0,0,0.1)" : "none",
              borderRadius: viewMode !== "desktop" ? "8px" : "0",
              transition: "all 0.3s ease",
            }}
            title="Sayfa Önizleme"
          />
        </div>
      </motion.div>

      <Separator className="my-6" />

      {/* Bilgi Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="p-4 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="font-semibold mb-2 flex items-center gap-2 text-gray-700">
              <LuLayers className="h-4 w-4 text-blue-600" />
              Sayfa Bilgileri
            </h2>
            <div className="space-y-1 mt-3">
              <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Bölüm Sayısı</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {sections.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-1 px-2 rounded">
                <span className="text-sm text-gray-600">Görünür Bölümler</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {sections.filter((s) => s.isVisible).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Son Güncelleme</span>
                <span className="text-xs font-medium text-gray-700">
                  {page?.updatedAt
                    ? new Date(page.updatedAt).toLocaleString()
                    : "Bilinmiyor"}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="p-4 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="font-semibold mb-2 flex items-center gap-2 text-gray-700">
              <LuSettings className="h-4 w-4 text-blue-600" />
              Hızlı İşlemler
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:border-blue-300 hover:bg-blue-50 gap-1.5"
                onClick={() => router.push(`/page-editor/${pageId}`)}
              >
                <LuPencil className="h-3.5 w-3.5" />
                Düzenle
              </Button>
              {!page?.isPublished ? (
                <Button
                  className="text-sm gap-1.5"
                  size="sm"
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  <LuGlobe className="h-3.5 w-3.5" />
                  {isPublishing ? "Yayınlanıyor..." : "Yayınla"}
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  className="text-sm gap-1.5"
                  size="sm"
                  onClick={async () => {
                    try {
                      await axios.put(`/api/store-pages/${pageId}/publish`, {
                        isPublished: false,
                      });
                      setMessage({
                        type: "success",
                        text: "Sayfa yayından kaldırıldı.",
                      });
                      if (page) {
                        setPage({ ...page, isPublished: false });
                      }
                    } catch (error) {
                      setMessage({
                        type: "error",
                        text: "Sayfa yayından kaldırılırken bir hata oluştu.",
                      });
                    }
                  }}
                >
                  <LuEyeOff className="h-3.5 w-3.5" />
                  Yayından Kaldır
                </Button>
              )}
              <Button
                variant="outline"
                className="text-sm gap-1.5 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                size="sm"
                onClick={() => {
                  if (page) {
                    window.open(`/store/${page.slug}`, "_blank");
                  }
                }}
              >
                <LuExternalLink className="h-3.5 w-3.5" />
                Canlı Sayfayı Görüntüle
              </Button>
              <Button
                variant="outline"
                className="text-sm gap-1.5 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                size="sm"
                onClick={() => router.push("/store-pages")}
              >
                <LuArrowLeft className="h-3.5 w-3.5" />
                Sayfalara Dön
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
