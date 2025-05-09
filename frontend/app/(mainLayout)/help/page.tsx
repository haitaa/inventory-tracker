"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Search,
  Package,
  Users,
  ShoppingCart,
  BarChart,
  Settings,
  FileText,
  BookOpen,
  LifeBuoy,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  ArrowRight,
  HelpCircle,
  Send,
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

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("hizli-baslangic");

  const quickStartGuides = [
    {
      title: "Envanter Yönetimi",
      icon: <Package className="h-8 w-8 text-indigo-500" />,
      description: "Stok yönetimi ve envanter takibi ile ilgili temel bilgiler",
      link: "/help/envanter",
    },
    {
      title: "Müşteri Yönetimi",
      icon: <Users className="h-8 w-8 text-emerald-500" />,
      description: "Müşteri kaydı, takibi ve raporlaması",
      link: "/help/musteriler",
    },
    {
      title: "Sipariş İşlemleri",
      icon: <ShoppingCart className="h-8 w-8 text-amber-500" />,
      description: "Sipariş oluşturma, güncelleme ve takip etme",
      link: "/help/siparisler",
    },
    {
      title: "Raporlar",
      icon: <BarChart className="h-8 w-8 text-blue-500" />,
      description: "Detaylı rapor oluşturma ve analiz etme",
      link: "/help/raporlar",
    },
    {
      title: "Sistem Ayarları",
      icon: <Settings className="h-8 w-8 text-purple-500" />,
      description: "Kullanıcı, mağaza ve genel sistem ayarları",
      link: "/help/ayarlar",
    },
    {
      title: "Belgeler",
      icon: <FileText className="h-8 w-8 text-rose-500" />,
      description: "Fatura, irsaliye ve diğer belgeler",
      link: "/help/belgeler",
    },
  ];

  const faqs = [
    {
      question: "Yeni bir ürün nasıl eklerim?",
      answer:
        "Yeni ürün eklemek için sol menüden 'Ürünler' seçeneğine tıklayın. Açılan sayfada sağ üst köşedeki 'Yeni Ürün' butonuna tıklayarak ürün ekleme formunu açabilirsiniz. Gerekli bilgileri doldurduktan sonra 'Kaydet' butonuna tıklayarak yeni ürününüzü ekleyebilirsiniz.",
    },
    {
      question: "Stok seviyesi düşük olan ürünleri nasıl görebilirim?",
      answer:
        "Stok seviyesi düşük olan ürünleri görmek için 'Kontrol Paneli' sayfasındaki 'Düşük Stoklu Ürünler' kartını inceleyebilirsiniz. Ayrıca, 'Ürünler' sayfasında bulunan filtreleme özelliğini kullanarak 'Düşük Stok' filtresini seçebilirsiniz.",
    },
    {
      question: "Yeni müşteri kaydı nasıl oluşturulur?",
      answer:
        "Yeni müşteri kaydı oluşturmak için sol menüden 'Müşteriler' seçeneğine tıklayın. Açılan sayfada 'Yeni Müşteri' butonuna tıklayarak müşteri bilgilerini girebileceğiniz formu açabilirsiniz. Müşteri bilgilerini doldurduktan sonra 'Kaydet' butonuna tıklayarak yeni müşteri kaydını tamamlayabilirsiniz.",
    },
    {
      question: "Aylık satış raporunu nasıl alabilirim?",
      answer:
        "Aylık satış raporunu almak için 'Raporlar' menüsüne gidin ve 'Satış Raporları' seçeneğini tıklayın. Açılan sayfada tarih aralığını belirleyerek (örneğin: 01.08.2023 - 31.08.2023) 'Raporu Oluştur' butonuna tıklayın. Oluşan raporu Excel, PDF veya CSV formatında indirebilirsiniz.",
    },
    {
      question: "E-fatura nasıl kesilir?",
      answer:
        "E-fatura kesmek için öncelikle 'Ayarlar' menüsündeki 'E-Fatura Ayarları' bölümünden e-fatura entegrasyonunuzu tamamlamanız gerekmektedir. Entegrasyon sonrası, 'Siparişler' sayfasından ilgili siparişi seçip 'E-Fatura Oluştur' seçeneğine tıklayabilir veya 'Belgeler' menüsündeki 'Yeni E-Fatura' butonuyla yeni bir e-fatura oluşturabilirsiniz.",
    },
    {
      question: "Kullanıcı yetkilerini nasıl yönetebilirim?",
      answer:
        "Kullanıcı yetkilerini yönetmek için 'Ayarlar' menüsünden 'Kullanıcı Yönetimi' sayfasına gidin. Bu sayfada mevcut kullanıcıları görebilir, yeni kullanıcı ekleyebilir ve kullanıcı rollerini düzenleyebilirsiniz. Kullanıcıya tıklayarak detaylı yetki ayarlarına erişebilirsiniz.",
    },
    {
      question: "Birden fazla depo nasıl yönetilir?",
      answer:
        "Birden fazla depo yönetimi için 'Ayarlar' menüsünden 'Depo Yönetimi' sayfasına gidin. Bu sayfada yeni depo ekleyebilir ve mevcut depoları düzenleyebilirsiniz. Ürün eklerken veya stok güncellerken ilgili depoyu seçerek işlem yapabilirsiniz.",
    },
    {
      question: "Sistem üzerinden SMS gönderimi yapılabilir mi?",
      answer:
        "Evet, SMS gönderimi yapılabilir. 'Ayarlar' menüsünden 'SMS Ayarları' sayfasına giderek SMS entegrasyonunuzu tamamlamanız gerekmektedir. Entegrasyon sonrası, müşterilere sipariş bildirimleri, stok uyarıları gibi durumlarda otomatik SMS gönderimi sağlanabilir veya 'Müşteriler' sayfasından toplu SMS gönderimi yapılabilir.",
    },
  ];

  const contactInfo = [
    {
      title: "Teknik Destek",
      icon: <LifeBuoy className="h-6 w-6" />,
      details: "7/24 teknik destek ekibimize ulaşın",
      contactMethod: "+90 123 456 7890",
      contactIcon: <Phone className="h-4 w-4" />,
    },
    {
      title: "E-posta Desteği",
      icon: <Mail className="h-6 w-6" />,
      details: "Sorularınız için e-posta gönderin",
      contactMethod: "destek@sirketiniz.com",
      contactIcon: <Mail className="h-4 w-4" />,
    },
    {
      title: "Canlı Sohbet",
      icon: <MessageSquare className="h-6 w-6" />,
      details: "Hızlı yanıt için canlı sohbeti kullanın",
      contactMethod: "Sohbeti Başlat",
      contactIcon: <MessageSquare className="h-4 w-4" />,
    },
    {
      title: "Bilgi Merkezi",
      icon: <Globe className="h-6 w-6" />,
      details: "Kapsamlı bilgi merkezimizi ziyaret edin",
      contactMethod: "Bilgi Merkezine Git",
      contactIcon: <ArrowRight className="h-4 w-4" />,
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 px-6 py-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-900/30 overflow-auto relative">
      {/* Dekoratif Elementler */}
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.5),rgba(255,255,255,0.7))] dark:bg-grid-slate-700/20"></div>
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-full h-16 bg-gradient-to-l from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"></div>

      <div className="relative z-10">
        {/* Başlık */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
            Yardım ve Destek Merkezi
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Sistemi en verimli şekilde kullanmanız için ihtiyaç duyacağınız tüm
            bilgiler burada. İhtiyacınız olan konuyu kolayca arayabilir veya
            aşağıdaki kategorilere göz atabilirsiniz.
          </p>
        </div>

        {/* Hero Bölümü */}
        <div className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-0 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-400/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"></div>

          <div className="relative p-8">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-4">
                  Nasıl yardımcı olabiliriz?
                </h2>
              </motion.div>
              <motion.p
                className="mb-6 text-white/90 text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Envanter ve müşteri yönetim sistemi hakkında aradığınız
                bilgileri buradan bulabilirsiniz
              </motion.p>
              <motion.div
                className="relative flex items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Search className="absolute left-4 h-5 w-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Sormak istediğiniz soruyu yazın..."
                  className="pl-11 pr-4 py-6 rounded-xl border-0 w-full bg-white/95 backdrop-blur text-gray-800 shadow-lg focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  variant="ghost"
                  className="absolute right-4 hover:bg-transparent transition-all duration-300 text-gray-500 hover:text-indigo-600"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8 mt-8"
        >
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl p-1 border border-gray-200 dark:border-gray-700 max-w-fit shadow-sm">
            <TabsList className="grid grid-cols-3 gap-1">
              <TabsTrigger
                value="hizli-baslangic"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white px-6 py-3 rounded-lg transition-all duration-300"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Hızlı Başlangıç
              </TabsTrigger>
              <TabsTrigger
                value="sikca-sorulanlar"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white px-6 py-3 rounded-lg transition-all duration-300"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                SSS
              </TabsTrigger>
              <TabsTrigger
                value="iletisim"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white px-6 py-3 rounded-lg transition-all duration-300"
              >
                <Phone className="h-4 w-4 mr-2" />
                İletişim
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Hızlı Başlangıç */}
          <TabsContent value="hizli-baslangic">
            <motion.div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {quickStartGuides.map((guide, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Link href={guide.link}>
                    <Card className="h-full relative group overflow-hidden border-0 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-blue-50/0 dark:from-indigo-950/0 dark:to-blue-950/0 group-hover:from-indigo-50/80 group-hover:to-blue-50/80 dark:group-hover:from-indigo-950/40 dark:group-hover:to-blue-950/40 transition-all duration-300"></div>
                      <div className="absolute h-full w-1 bg-transparent group-hover:bg-gradient-to-b group-hover:from-indigo-400 group-hover:to-blue-500 left-0 top-0 transition-all duration-300"></div>

                      <div className="relative p-6 flex items-start gap-5 z-10">
                        <div className="flex-shrink-0">
                          <motion.div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-950/50 flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-900/50"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                          >
                            <div className="text-indigo-500 dark:text-indigo-400">
                              {guide.icon}
                            </div>
                          </motion.div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-medium text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                            {guide.title}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {guide.description}
                          </p>
                          <div className="pt-2">
                            <span className="inline-flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-300">
                              Daha fazla bilgi
                              <ArrowRight className="ml-1.5 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Sıkça Sorulan Sorular */}
          <TabsContent value="sikca-sorulanlar">
            <Card className="border-0 shadow-sm bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="flex items-center text-xl font-medium">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-3 shadow-sm">
                    <HelpCircle className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  Sıkça Sorulan Sorular
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Kullanıcılarımızın en çok sorduğu sorular ve cevapları
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {searchTerm && (
                  <div className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Search className="h-3 w-3 mr-2 text-indigo-400" />
                      <span>
                        {filteredFaqs.length} sonuç bulundu: "
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">
                          {searchTerm}
                        </span>
                        "
                      </span>
                    </p>
                  </div>
                )}

                {filteredFaqs.length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-2">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border border-transparent data-[state=open]:bg-indigo-50/50 dark:data-[state=open]:bg-indigo-900/10 rounded-lg transition-all duration-300 overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline text-base flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
                          <div className="flex items-center w-full">
                            <div className="w-7 h-7 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center mr-3 shadow-sm group-data-[state=open]:border-indigo-200 dark:group-data-[state=open]:border-indigo-800 transition-colors">
                              <HelpCircle className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 group-data-[state=open]:text-indigo-500 dark:group-data-[state=open]:text-indigo-400 transition-colors" />
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-300 group-data-[state=open]:text-indigo-700 dark:group-data-[state=open]:text-indigo-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {faq.question}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-3 px-4 text-sm leading-relaxed ml-10 text-gray-600 dark:text-gray-300 data-[state=open]:animate-fadeIn">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-2 border-indigo-300 dark:border-indigo-700 shadow-sm">
                            {faq.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <motion.div
                    className="flex flex-col items-center justify-center py-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 mb-5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-400 dark:text-indigo-300">
                      <HelpCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      Sonuç bulunamadı
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md text-sm">
                      Aramanıza uygun soru bulunamadı. Farklı anahtar kelimeler
                      deneyebilir veya bizimle iletişime geçebilirsiniz.
                    </p>
                    <Button
                      variant="default"
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 font-medium px-4 py-2 text-sm rounded-full shadow hover:shadow-md transition-all duration-300"
                      onClick={() => {
                        setSearchTerm("");
                        setActiveTab("iletisim");
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      İletişime Geç
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* İletişim */}
          <TabsContent value="iletisim">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Phone className="h-5 w-5 mr-2 text-indigo-500" />
                      Destek İletişim Bilgileri
                    </CardTitle>
                    <CardDescription className="text-base">
                      Teknik destek ve genel sorularınız için iletişim
                      kanallarımız
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contactInfo.map((contact, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-700 bg-white dark:bg-gray-800"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 4px 20px -5px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 rounded-full flex items-center justify-center mr-4 text-indigo-600 dark:text-indigo-400 shadow-inner">
                          {contact.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">
                            {contact.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {contact.details}
                          </p>
                        </div>
                        <div>
                          {contact.title === "Bilgi Merkezi" ? (
                            <Link href="/help/bilgi-merkezi">
                              <Button
                                variant="outline"
                                className="flex items-center gap-2 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-300"
                              >
                                {contact.contactIcon}
                                <span className="ml-1">
                                  {contact.contactMethod}
                                </span>
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              variant="outline"
                              className="flex items-center gap-2 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-300"
                            >
                              {contact.contactIcon}
                              <span className="ml-1">
                                {contact.contactMethod}
                              </span>
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                      Kullanım Kılavuzları
                    </CardTitle>
                    <CardDescription className="text-base">
                      Kapsamlı kullanım kılavuzlarımıza göz atın
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        title: "Kullanım Kılavuzu",
                        icon: (
                          <FileText className="h-5 w-5 text-indigo-500 mr-3" />
                        ),
                        badge: { text: "PDF", color: "blue" },
                      },
                      {
                        title: "API Dokümantasyonu",
                        icon: (
                          <FileText className="h-5 w-5 text-indigo-500 mr-3" />
                        ),
                        badge: { text: "JSON", color: "emerald" },
                      },
                      {
                        title: "Hızlı Başlangıç Rehberi",
                        icon: (
                          <FileText className="h-5 w-5 text-indigo-500 mr-3" />
                        ),
                        badge: { text: "PDF", color: "amber" },
                      },
                    ].map((doc, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-700 bg-white dark:bg-gray-800"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 4px 20px -5px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div className="flex items-center">
                          {doc.icon}
                          <span className="font-medium">{doc.title}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`border-${doc.badge.color}-200 bg-${doc.badge.color}-50 text-${doc.badge.color}-700 dark:border-${doc.badge.color}-800 dark:bg-${doc.badge.color}-900/20 dark:text-${doc.badge.color}-400`}
                        >
                          {doc.badge.text}
                        </Badge>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card className="border-gray-200 dark:border-gray-700 shadow-md h-fit bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <MessageSquare className="h-5 w-5 mr-2 text-indigo-500" />
                    Bize Ulaşın
                  </CardTitle>
                  <CardDescription className="text-base">
                    Sorularınız için formu doldurarak bizimle iletişime
                    geçebilirsiniz
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium flex items-center"
                    >
                      <Users className="h-4 w-4 mr-2 text-indigo-500" />
                      Ad Soyad
                    </label>
                    <Input
                      id="name"
                      placeholder="Adınız ve soyadınız"
                      className="w-full border-gray-300 dark:border-gray-700 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium flex items-center"
                    >
                      <Mail className="h-4 w-4 mr-2 text-indigo-500" />
                      E-posta Adresi
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="E-posta adresiniz"
                      className="w-full border-gray-300 dark:border-gray-700 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-2 text-indigo-500" />
                      Konu
                    </label>
                    <Input
                      id="subject"
                      placeholder="Mesajınızın konusu"
                      className="w-full border-gray-300 dark:border-gray-700 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium flex items-center"
                    >
                      <MessageSquare className="h-4 w-4 mr-2 text-indigo-500" />
                      Mesaj
                    </label>
                    <textarea
                      id="message"
                      className="w-full min-h-32 rounded-lg border border-gray-300 dark:border-gray-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>
                  <Button className="w-full py-6 text-base font-medium bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-300">
                    <Send className="h-5 w-5 mr-2" />
                    Mesajı Gönder
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Alt Bilgi */}
        <Separator className="my-8 opacity-50" />
        <div className="flex flex-col md:flex-row justify-between text-sm text-muted-foreground pb-6">
          <div className="mb-4 md:mb-0 flex items-center">
            <LifeBuoy className="h-4 w-4 mr-2 text-indigo-500" />© 2023
            Envanter ve Müşteri Yönetim Sistemi. Tüm hakları saklıdır.
          </div>
          <div className="flex space-x-6">
            <Link
              href="#"
              className="hover:text-indigo-600 transition-colors flex items-center"
            >
              <FileText className="h-4 w-4 mr-1 text-indigo-500" />
              <span>Gizlilik Politikası</span>
            </Link>
            <Link
              href="#"
              className="hover:text-indigo-600 transition-colors flex items-center"
            >
              <FileText className="h-4 w-4 mr-1 text-indigo-500" />
              <span>Kullanım Koşulları</span>
            </Link>
            <Link
              href="#"
              className="hover:text-indigo-600 transition-colors flex items-center"
            >
              <FileText className="h-4 w-4 mr-1 text-indigo-500" />
              <span>Cookie Politikası</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
