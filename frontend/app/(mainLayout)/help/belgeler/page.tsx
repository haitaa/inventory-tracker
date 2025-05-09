"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Users,
  ClipboardList,
  ArrowLeft,
  ShoppingCart,
  FileText,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Settings,
  File,
  FilePlus,
  Receipt,
  CreditCard,
  FileSpreadsheet,
  FileCheck,
  FileOutput,
  FileX,
  FileSearch,
  Printer,
  Share2,
  Download,
  UploadCloud,
  Mail,
  Clock,
  CheckCircle2,
  CheckSquare,
  PenTool,
  Stamp,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

interface CardFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CardFeature: React.FC<CardFeatureProps> = ({
  icon,
  title,
  description,
}) => (
  <motion.div variants={itemVariants}>
    <Card className="h-full relative group border-0 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-blue-50/0 dark:from-indigo-950/0 dark:to-blue-950/0 group-hover:from-indigo-50/80 group-hover:to-blue-50/80 dark:group-hover:from-indigo-950/40 dark:group-hover:to-blue-950/40 transition-all duration-300"></div>
      <div className="absolute h-full w-1 bg-transparent group-hover:bg-gradient-to-b group-hover:from-indigo-400 group-hover:to-blue-500 left-0 top-0 transition-all duration-300"></div>

      <div className="relative p-6 flex items-start gap-5 z-10">
        <div className="flex-shrink-0">
          <motion.div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-950/50 flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-900/50"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-indigo-500 dark:text-indigo-400">{icon}</div>
          </motion.div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {description}
          </p>
        </div>
      </div>
    </Card>
  </motion.div>
);

export default function BelgelerPage() {
  return (
    <div className="flex-1 space-y-6 px-6 py-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-900/30 overflow-auto relative">
      {/* Dekoratif Elementler */}
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.5),rgba(255,255,255,0.7))] dark:bg-grid-slate-700/20"></div>
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-full h-16 bg-gradient-to-l from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"></div>

      <div className="relative z-10">
        {/* Geri Butonu */}
        <Link href="/help">
          <Button
            variant="ghost"
            className="mb-6 group hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Yardım Merkezine Dön
          </Button>
        </Link>

        {/* Başlık */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 flex items-center justify-center shadow p-3">
              <FileText className="h-10 w-10 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              Belgeler
            </h1>
          </div>
          <p className="text-muted-foreground max-w-3xl leading-relaxed mt-2 pl-2">
            Fatura, irsaliye, makbuz ve diğer iş belgelerinin oluşturulması,
            düzenlenmesi ve yönetimi. İşletmenizin tüm resmi evrakları için
            eksiksiz çözüm.
          </p>
        </div>

        {/* Ana İçerik */}
        <div className="mt-8">
          <Tabs defaultValue="genel-bakis" className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl p-1 border border-gray-200 dark:border-gray-700 max-w-fit shadow-sm">
              <TabsList className="grid grid-cols-3 gap-1">
                <TabsTrigger
                  value="genel-bakis"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Genel Bakış
                </TabsTrigger>
                <TabsTrigger
                  value="ozellikler"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Özellikler
                </TabsTrigger>
                <TabsTrigger
                  value="ipuclari"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  İpuçları
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Genel Bakış İçeriği */}
            <TabsContent value="genel-bakis">
              <div className="space-y-6">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-0 text-white overflow-hidden relative shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10"></div>
                  <div className="relative p-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                      <div className="flex-shrink-0 w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center">
                        <FileText className="h-16 w-16 text-white" />
                      </div>
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Belgeler Nedir?</h2>
                        <p className="text-white/80 max-w-2xl">
                          Belgeler modülü, işletmenizin ihtiyaç duyduğu tüm
                          yasal ve ticari evrakları oluşturmanızı, düzenlemenizi
                          ve yönetmenizi sağlar. Faturalar, irsaliyeler,
                          makbuzlar, teklifler ve daha fazlası için entegre bir
                          çözüm sunar. Yasal uyumluluk, dijital imza ve otomatik
                          evrak oluşturma özellikleriyle iş süreçlerinizi
                          hızlandırır.
                        </p>
                        <div className="flex space-x-4 pt-2">
                          <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                            <Receipt className="h-4 w-4 mr-2" />
                            E-Fatura Oluştur
                          </Button>
                          <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                            <FileSearch className="h-4 w-4 mr-2" />
                            Belgeleri Görüntüle
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="mt-8">
                  <h3 className="text-xl font-medium mb-4 pl-2 text-gray-800 dark:text-gray-200">
                    Temel Belge Türleri
                  </h3>
                  <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <CardFeature
                      icon={<Receipt className="h-5 w-5" />}
                      title="Faturalar"
                      description="Satış faturaları, e-faturalar, e-arşiv faturaları ve masraf faturaları oluşturun ve yönetin."
                    />
                    <CardFeature
                      icon={<File className="h-5 w-5" />}
                      title="İrsaliyeler"
                      description="Sevk irsaliyeleri ve teslimat belgeleri oluşturup takip edin."
                    />
                    <CardFeature
                      icon={<CheckSquare className="h-5 w-5" />}
                      title="Makbuzlar"
                      description="Tahsilat ve ödeme makbuzları ile nakit akışınızı belgelendirin."
                    />
                    <CardFeature
                      icon={<FileSpreadsheet className="h-5 w-5" />}
                      title="Teklifler ve Sözleşmeler"
                      description="Müşterilerinize profesyonel teklifler ve sözleşmeler hazırlayın."
                    />
                    <CardFeature
                      icon={<CreditCard className="h-5 w-5" />}
                      title="Ödeme Belgeleri"
                      description="Kredi kartı slip'leri, ödeme dekontları ve banka işlem belgeleri."
                    />
                    <CardFeature
                      icon={<Stamp className="h-5 w-5" />}
                      title="Resmi Belgeler"
                      description="Vergi beyannameleri, bordro ve diğer resmi evraklar için şablonlar ve takip sistemi."
                    />
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            {/* Özellikler İçeriği */}
            <TabsContent value="ozellikler">
              <div className="space-y-6">
                <Card className="border-0 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-3 shadow-sm">
                        <FileText className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                      </div>
                      Belge Yönetimi Özellikleri
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      Belge oluşturma, düzenleme ve yönetim özellikleri
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        {
                          icon: (
                            <FilePlus className="h-4 w-4 text-indigo-500" />
                          ),
                          title: "Hızlı Belge Oluşturma",
                          description:
                            "Önceden hazırlanmış şablonlarla tek tıklamayla profesyonel belgeler oluşturun.",
                        },
                        {
                          icon: <PenTool className="h-4 w-4 text-indigo-500" />,
                          title: "Dijital İmza Entegrasyonu",
                          description:
                            "Belgeleri elektronik olarak imzalayarak yasal geçerlilik kazandırın.",
                        },
                        {
                          icon: <Share2 className="h-4 w-4 text-indigo-500" />,
                          title: "Kolay Paylaşım",
                          description:
                            "Belgeleri e-posta, SMS veya link olarak güvenli bir şekilde paylaşın.",
                        },
                        {
                          icon: <Printer className="h-4 w-4 text-indigo-500" />,
                          title: "Toplu Yazdırma",
                          description:
                            "Birden fazla belgeyi tek seferde yazdırarak zaman kazanın.",
                        },
                        {
                          icon: <Clock className="h-4 w-4 text-indigo-500" />,
                          title: "Otomatik Belge Oluşturma",
                          description:
                            "Belirli olaylar tetiklendiğinde otomatik belge oluşturma ve gönderme.",
                        },
                        {
                          icon: (
                            <FileSearch className="h-4 w-4 text-indigo-500" />
                          ),
                          title: "Gelişmiş Arama",
                          description:
                            "Tüm belgelerinizde içerik bazlı arama yaparak ihtiyacınız olan bilgilere hızlıca ulaşın.",
                        },
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex p-4 border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
                        >
                          <div className="mr-4 mt-1">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                              {feature.icon}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-base mb-1">
                              {feature.title}
                            </h4>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                      <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white border-0 px-6 py-2 rounded-full shadow">
                        <FileText className="h-4 w-4 mr-2" />
                        Tüm Belge Özelliklerini Keşfedin
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* İpuçları İçeriği */}
            <TabsContent value="ipuclari">
              <div className="space-y-6">
                <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border-0">
                  <h3 className="text-xl font-medium mb-4 flex items-center text-gray-800 dark:text-gray-200">
                    <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mr-3 shadow-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                    </div>
                    Etkili Belge Yönetimi İpuçları
                  </h3>

                  <div className="space-y-4 mt-6">
                    {[
                      {
                        title: "Tutarlı Belge Numaralandırması Kullanın",
                        description:
                          "Tüm belgeleriniz için anlaşılır ve tutarlı bir numaralandırma sistemi belirleyin. Bu, belgelerin takibini kolaylaştırır ve yasal uyumluluk sağlar.",
                      },
                      {
                        title: "Otomatik Şablonlar Oluşturun",
                        description:
                          "Sık kullandığınız belge türleri için özelleştirilmiş şablonlar hazırlayın. Bu, zaman kazandırır ve marka tutarlılığı sağlar.",
                      },
                      {
                        title: "Belge Arşivini Düzenli Olarak Yedekleyin",
                        description:
                          "Önemli belgelerinizi düzenli aralıklarla yedekleyin ve farklı depolama alanlarında saklayın. Bu, veri kaybını önler.",
                      },
                      {
                        title: "Yasal Saklama Sürelerini Takip Edin",
                        description:
                          "Her belge türü için yasal saklama sürelerini bilin ve bu süreleri belge yönetim sisteminizde işaretleyin.",
                      },
                      {
                        title: "Etkin Etiketleme Sistemi Kullanın",
                        description:
                          "Belgelerinizi müşteri, proje, departman gibi kategorilere göre etiketleyerek arama ve filtreleme işlemlerini kolaylaştırın.",
                      },
                    ].map((tip, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/80 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex group"
                      >
                        <div className="mr-4 mt-1 flex-shrink-0">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/40 transition-colors">
                            <span className="text-xs font-medium">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-base mb-1 text-gray-900 dark:text-gray-100">
                            {tip.title}
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {tip.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-base mb-1 text-indigo-700 dark:text-indigo-300">
                          Profesyonel İpucu
                        </h4>
                        <p className="text-indigo-600/80 dark:text-indigo-400/80 text-sm">
                          Belge onay akışı oluşturun. Özellikle önemli
                          belgelerin hazırlanması, incelenmesi ve onaylanması
                          için bir süreç tanımlayın. Bu, hataları azaltır ve
                          belgelerin zamanında tamamlanmasını sağlar. Her adımda
                          kimin sorumlu olduğunu ve normal tamamlanma süresini
                          belirleyin.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* İlgili Konular */}
        <div className="mt-12">
          <h3 className="text-lg font-medium mb-4 pl-2 text-gray-800 dark:text-gray-200">
            İlgili Konular
          </h3>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {[
              {
                title: "Envanter Yönetimi",
                icon: <Package className="h-4 w-4" />,
                link: "/help/envanter",
              },
              {
                title: "Müşteri Yönetimi",
                icon: <Users className="h-4 w-4" />,
                link: "/help/musteriler",
              },
              {
                title: "Sipariş İşlemleri",
                icon: <ShoppingCart className="h-4 w-4" />,
                link: "/help/siparisler",
              },
              {
                title: "Sistem Ayarları",
                icon: <Settings className="h-4 w-4" />,
                link: "/help/ayarlar",
              },
            ].map((item, index) => (
              <Link href={item.link} key={index}>
                <Button
                  variant="outline"
                  className="w-full justify-start border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 shadow-sm hover:shadow"
                >
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mr-3 shadow-sm">
                    {item.icon}
                  </div>
                  <span>{item.title}</span>
                  <ArrowRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Alt Bilgi */}
        <Separator className="my-8 opacity-50" />
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground pb-6">
          <div className="mb-4 md:mb-0">Son Güncelleme: 25 Mayıs 2023</div>
          <div className="flex space-x-6">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Önceki Konu</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 hover:text-indigo-600 transition-colors"
            >
              <span>Sonraki Konu</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
