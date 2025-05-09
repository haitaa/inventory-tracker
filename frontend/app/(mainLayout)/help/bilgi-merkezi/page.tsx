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
  Globe,
  Book,
  BookOpen,
  Compass,
  GraduationCap,
  Video,
  FileQuestion,
  MessageCircle,
  Award,
  FolderOpen,
  TerminalSquare,
  Lightbulb,
  Youtube,
  CalendarDays,
  Share2,
  CheckCircle2,
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

export default function BilgiMerkeziPage() {
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
              <Globe className="h-10 w-10 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              Bilgi Merkezi
            </h1>
          </div>
          <p className="text-muted-foreground max-w-3xl leading-relaxed mt-2 pl-2">
            Uygulamanın tüm özellikleri hakkında detaylı bilgiler, eğitimler ve
            en güncel kaynaklar. Sistem hakkında bilgi edinmek ve
            yeteneklerinizi geliştirmek için kapsamlı kaynak merkezi.
          </p>
        </div>

        {/* Ana İçerik */}
        <div className="mt-8">
          <Tabs defaultValue="kaynaklar" className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl p-1 border border-gray-200 dark:border-gray-700 max-w-fit shadow-sm">
              <TabsList className="grid grid-cols-3 gap-1">
                <TabsTrigger
                  value="kaynaklar"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Kaynaklar
                </TabsTrigger>
                <TabsTrigger
                  value="egitimler"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Eğitimler
                </TabsTrigger>
                <TabsTrigger
                  value="topluluk"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Topluluk
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Kaynaklar İçeriği */}
            <TabsContent value="kaynaklar">
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
                        <Book className="h-16 w-16 text-white" />
                      </div>
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Bilgi Kaynakları</h2>
                        <p className="text-white/80 max-w-2xl">
                          Envanter ve müşteri yönetim sistemimizin tüm
                          özellikleri hakkında kapsamlı dokümantasyon, kullanım
                          kılavuzları, teknik belgeler ve referans materyalleri.
                          İhtiyacınız olan tüm bilgilere kolayca erişin.
                        </p>
                        <div className="flex space-x-4 pt-2">
                          <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                            <FileText className="h-4 w-4 mr-2" />
                            Kullanım Kılavuzu
                          </Button>
                          <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                            <FileQuestion className="h-4 w-4 mr-2" />
                            SSS
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="mt-8">
                  <h3 className="text-xl font-medium mb-4 pl-2 text-gray-800 dark:text-gray-200">
                    Doküman Türleri
                  </h3>
                  <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <CardFeature
                      icon={<BookOpen className="h-5 w-5" />}
                      title="Kullanım Kılavuzları"
                      description="Sistemin her modülü için adım adım kullanım talimatları içeren kapsamlı kılavuzlar."
                    />
                    <CardFeature
                      icon={<Compass className="h-5 w-5" />}
                      title="Hızlı Başlangıç Rehberleri"
                      description="Yeni kullanıcılar için temel özellikleri hızlıca öğrenme rehberleri."
                    />
                    <CardFeature
                      icon={<TerminalSquare className="h-5 w-5" />}
                      title="API Dokümantasyonu"
                      description="Geliştiriciler için entegrasyon ve özelleştirme seçenekleri sunan teknik dokümanlar."
                    />
                    <CardFeature
                      icon={<Video className="h-5 w-5" />}
                      title="Video Eğitimleri"
                      description="Görsel öğrenme için adım adım ekran kayıtları ve demo videoları."
                    />
                    <CardFeature
                      icon={<FolderOpen className="h-5 w-5" />}
                      title="Örnek Senaryolar"
                      description="Gerçek dünya senaryoları ile sistemin farklı kullanım biçimlerini gösteren örnekler."
                    />
                    <CardFeature
                      icon={<CalendarDays className="h-5 w-5" />}
                      title="Sürüm Notları"
                      description="Her güncelleme ile gelen yeni özellikler, iyileştirmeler ve hata düzeltmeleri."
                    />
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            {/* Eğitimler İçeriği */}
            <TabsContent value="egitimler">
              <div className="space-y-6">
                <Card className="border-0 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-3 shadow-sm">
                        <GraduationCap className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                      </div>
                      Eğitim Programları
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      Sistem kullanımını geliştirmek için kapsamlı eğitim
                      seçenekleri
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        {
                          icon: <Youtube className="h-4 w-4 text-indigo-500" />,
                          title: "Video Eğitim Serisi",
                          description:
                            "Başlangıç, orta ve ileri seviye kullanıcılar için kapsamlı video eğitimlerimiz.",
                        },
                        {
                          icon: <Award className="h-4 w-4 text-indigo-500" />,
                          title: "Sertifika Programları",
                          description:
                            "Uzmanlığınızı belgeleyen resmi sertifika programlarımıza katılın.",
                        },
                        {
                          icon: (
                            <CalendarDays className="h-4 w-4 text-indigo-500" />
                          ),
                          title: "Canlı Webinarlar",
                          description:
                            "Uzmanlarımız tarafından düzenli olarak gerçekleştirilen interaktif eğitim oturumları.",
                        },
                        {
                          icon: <Book className="h-4 w-4 text-indigo-500" />,
                          title: "Eğitim Kitaplığı",
                          description:
                            "Özel konulara odaklanan eğitim materyalleri ve konular arası eğitim paketleri.",
                        },
                        {
                          icon: (
                            <Lightbulb className="h-4 w-4 text-indigo-500" />
                          ),
                          title: "Pratik Atölyeler",
                          description:
                            "Gerçek dünya senaryoları üzerinde pratik yaparak öğrenin.",
                        },
                        {
                          icon: <Users className="h-4 w-4 text-indigo-500" />,
                          title: "Ekip Eğitimleri",
                          description:
                            "Şirketinize özel hazırlanmış ekip eğitim programları.",
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
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Eğitim Takvimini Görüntüle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Topluluk İçeriği */}
            <TabsContent value="topluluk">
              <div className="space-y-6">
                <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border-0">
                  <h3 className="text-xl font-medium mb-4 flex items-center text-gray-800 dark:text-gray-200">
                    <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mr-3 shadow-sm">
                      <MessageCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                    </div>
                    Kullanıcı Topluluğumuz
                  </h3>

                  <div className="space-y-4 mt-6">
                    {[
                      {
                        title: "Topluluk Forumu",
                        description:
                          "Diğer kullanıcılarla bağlantı kurun, sorular sorun ve bilgi paylaşın. Aktif bir kullanıcı ağıyla deneyimlerinizi paylaşın.",
                      },
                      {
                        title: "Başarı Hikayeleri",
                        description:
                          "Sistemimizi kullanan işletmelerin başarı hikayelerini okuyun ve ilham alın. Gerçek dünya uygulamalarını keşfedin.",
                      },
                      {
                        title: "Aylık Topluluk Buluşmaları",
                        description:
                          "Her ay düzenlenen sanal buluşmalarımıza katılın. Yeni özellikler hakkında bilgi alın ve diğer kullanıcılarla tanışın.",
                      },
                      {
                        title: "İpucu ve Püf Noktaları",
                        description:
                          "Deneyimli kullanıcıların paylaştığı en iyi uygulamalar, ipuçları ve verimlilik artırıcı püf noktalarından faydalanın.",
                      },
                      {
                        title: "Özellik İstek Platformu",
                        description:
                          "Yeni özellik önerilerinizi paylaşın, oylamaya katılın ve ürün geliştirme sürecimize katkıda bulunun.",
                      },
                    ].map((item, index) => (
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
                            {item.title}
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                        <Share2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-base mb-1 text-indigo-700 dark:text-indigo-300">
                          Topluluğa Katılın
                        </h4>
                        <p className="text-indigo-600/80 dark:text-indigo-400/80 text-sm">
                          Aktif topluluğumuza katılarak deneyimlerinizi
                          paylaşın, sorular sorun ve diğer kullanıcılardan
                          öğrenin. Topluluğumuza katılım ücretsizdir ve zengin
                          bir öğrenme ve paylaşım ortamı sunar.
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
                title: "Belgeler",
                icon: <FileText className="h-4 w-4" />,
                link: "/help/belgeler",
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
          <div className="mb-4 md:mb-0">Son Güncelleme: 1 Haziran 2023</div>
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
