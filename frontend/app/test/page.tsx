"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Star,
  Download,
  Box,
  BarChart3,
  ShoppingCart,
  TrendingUp,
  Users,
  HeadphonesIcon,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppLandingPage() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Stil tanımlamaları */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">Haita</span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <Link
              href="#özellikler"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Özellikler
            </Link>
            <Link
              href="#nasil-calisir"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Nasıl Çalışır
            </Link>
            <Link
              href="#neden-biz"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Neden Biz
            </Link>
            <Link
              href="#yorumlar"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Yorumlar
            </Link>
            <Link
              href="#sss"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              SSS
            </Link>
          </div>

          <div>
            <Button className="rounded-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white">
              Ücretsiz Dene
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 to-white pointer-events-none z-0"></div>

        {/* Dekoratif arka plan şekilleri */}
        <div className="absolute top-0 right-0 w-1/3 h-screen pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="absolute top-0 left-0 w-1/3 h-screen pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-3000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div
                  variants={fadeInUp}
                  className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4"
                >
                  Envanter & E-Ticaret Çözümü
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
                >
                  İşletmenizi Tek Platformda{" "}
                  <span className="text-blue-600 relative">
                    Dijitalleştirin
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600/30 rounded-full"></span>
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl"
                >
                  İşletmenizi dijitalleştirin, stok takibini otomatikleştirin ve
                  satışlarınızı her kanaldan yönetin. Tam kapsamlı e-ticaret ve
                  envanter çözümü.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4 mb-12"
                >
                  <Button
                    size="lg"
                    className="rounded-full px-8 py-6 text-base bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-white flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Hemen Başlayın
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 py-6 text-base border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <BarChart3 size={18} />
                    Demo İsteyin
                  </Button>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="flex items-center gap-4"
                >
                  <div className="bg-white px-4 py-3 rounded-xl flex items-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                      <Users size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <span className="text-gray-800 font-semibold block leading-tight">
                        10.000+
                      </span>
                      <span className="text-gray-500 text-xs">
                        Aktif Kullanıcı
                      </span>
                    </div>
                  </div>

                  <div className="bg-white px-4 py-3 rounded-xl flex items-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-50 mr-3">
                      <CheckCircle2 size={16} className="text-green-600" />
                    </div>
                    <div>
                      <span className="text-gray-800 font-semibold block leading-tight">
                        99%
                      </span>
                      <span className="text-gray-500 text-xs">Memnuniyet</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-3xl opacity-10 transform -rotate-6"></div>

                {/* Telefon çerçevesi */}
                <div className="relative bg-white shadow-xl rounded-3xl border border-gray-100 p-3 overflow-hidden">
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1/4 h-1 bg-gray-200 rounded-full"></div>

                  <div className="w-full h-[550px] bg-gradient-to-b from-gray-50 to-white rounded-2xl relative overflow-hidden shadow-inner">
                    {/* Mockup içeriği */}
                    <div className="absolute inset-0">
                      <div className="h-12 bg-white border-b border-gray-100 flex items-center px-4">
                        <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            H
                          </span>
                        </div>
                        <span className="ml-2 font-medium text-gray-800">
                          Haita Dashboard
                        </span>
                        <div className="ml-auto flex space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                          <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="mb-4">
                          <div className="text-xl font-bold text-gray-900 mb-2">
                            Hoş Geldin, Kullanıcı
                          </div>
                          <div className="text-sm text-gray-500">
                            İşletmenizin güncel durumunu görüntüleyin
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="text-sm text-gray-500 mb-1">
                              Toplam Ürün
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                              248
                            </div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="text-sm text-gray-500 mb-1">
                              Aktif Sipariş
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                              36
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
                          <div className="text-sm font-medium text-gray-800 mb-2">
                            Stok Durumu
                          </div>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: "65%" }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              65%
                            </span>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
                          <div className="text-sm font-medium text-gray-800 mb-2">
                            Son Siparişler
                          </div>
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="flex items-center py-1 border-b border-gray-50"
                              >
                                <div className="w-8 h-8 rounded bg-gray-100"></div>
                                <div className="ml-2">
                                  <div className="text-xs font-medium text-gray-800">
                                    Sipariş #{i}00{i}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    2 saat önce
                                  </div>
                                </div>
                                <div className="ml-auto text-xs font-medium text-gray-800">
                                  ₺{i * 100 + 99}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 flex flex-col items-center"
          >
            <a
              href="#özellikler"
              className="group flex flex-col items-center text-gray-500 hover:text-blue-600 transition-colors"
            >
              <span className="mb-2 font-medium">Daha fazlasını keşfedin</span>
              <ChevronDown className="animate-bounce group-hover:bg-blue-100 rounded-full p-1" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Trusted Logos Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-3">
              Güven ve Kalite
            </span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Binlerce İşletme Tarafından Tercih Edilen Çözüm
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Farklı ölçek ve sektörlerden işletmeler, envanter ve e-ticaret
              yönetiminde Haita'ya güveniyor.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative py-10"
          >
            {/* Dekoratif arka plan öğeleri */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>

            <div className="relative">
              <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10">
                {[
                  {
                    name: "TechCorp",
                    logo: (
                      <div className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Tech<span className="text-gray-800">Corp</span>
                      </div>
                    ),
                  },
                  {
                    name: "Innovate",
                    logo: (
                      <div className="font-bold italic text-3xl text-gray-800">
                        <span className="text-green-600">i</span>nnovate
                      </div>
                    ),
                  },
                  {
                    name: "Global Shop",
                    logo: (
                      <div className="font-bold text-3xl">
                        <span className="text-blue-600">Global</span>
                        <span className="text-gray-800">Shop</span>
                      </div>
                    ),
                  },
                  {
                    name: "Market Plus",
                    logo: (
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-md bg-red-600 flex items-center justify-center mr-2">
                          <span className="text-white font-bold">M</span>
                        </div>
                        <span className="font-semibold text-xl text-gray-800">
                          Market Plus
                        </span>
                      </div>
                    ),
                  },
                  {
                    name: "EcoStore",
                    logo: (
                      <div className="flex items-center">
                        <div className="text-green-600 mr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            />
                          </svg>
                        </div>
                        <span className="font-semibold text-xl text-gray-800">
                          EcoStore
                        </span>
                      </div>
                    ),
                  },
                ].map((brand, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="w-40 h-16 flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                  >
                    {brand.logo}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap justify-center items-center gap-6 mt-16"
          >
            {[
              {
                icon: <Users className="w-8 h-8 text-blue-500" />,
                number: "500+",
                label: "Aktif İşletme",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: <Box className="w-8 h-8 text-indigo-500" />,
                number: "50K+",
                label: "Yönetilen Ürün",
                color: "bg-indigo-50 text-indigo-600",
              },
              {
                icon: <ShoppingCart className="w-8 h-8 text-violet-500" />,
                number: "10M+",
                label: "İşlenen Sipariş",
                color: "bg-violet-50 text-violet-600",
              },
              {
                icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
                number: "99%",
                label: "Müşteri Memnuniyeti",
                color: "bg-green-50 text-green-600",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="text-center p-5 bg-white rounded-2xl shadow-md border border-gray-100 min-w-[180px] flex flex-col items-center"
              >
                <div
                  className={`w-16 h-16 rounded-full ${stat.color} mb-4 flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
                <span className="text-gray-900 font-bold text-3xl">
                  {stat.number}
                </span>
                <span className="text-gray-600 text-sm mt-1">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="özellikler"
        className="py-24 bg-white relative overflow-hidden"
      >
        {/* Dekoratif arka plan öğeleri - daha subtil hale getirildi */}
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-3000"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
              Güçlü Özellikler
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 tracking-tight">
              Tam Kapsamlı Çözüm
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              İşletmenizin ihtiyaç duyduğu tüm dijital araçlar tek bir
              platformda. Karmaşık süreçlerinizi basitleştirip verimliliğinizi
              artırın.
            </p>

            {/* Başlık altındaki dekoratif çizgi - daha ince ve zarif */}
            <div className="w-16 h-px bg-blue-200 mx-auto mt-8"></div>
          </motion.div>

          <div className="mb-20">
            {/* Ana Özellik - daha rafine edilmiş tasarım */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-0 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group overflow-hidden mb-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-3 p-12">
                  <div className="flex items-center mb-8">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center shadow-sm">
                      <Box className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 ml-4">
                      Akıllı Envanter Yönetimi
                    </h3>
                  </div>

                  <p className="text-gray-500 mb-8 leading-relaxed text-base">
                    İşletmenizin tüm stok hareketlerini gerçek zamanlı olarak
                    takip edin ve tam kontrol sağlayın. Yapay zeka destekli
                    tahminlerle stok seviyelerinizi optimize edin, sezgisel
                    arayüz sayesinde karmaşık envanter işlemlerini
                    kolaylaştırın.
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      "Yapay zeka destekli stok tahminleme ve optimizasyon",
                      "Birden fazla lokasyon için gerçek zamanlı stok takibi",
                      "Otomatik sipariş yenileme ve tedarikçi entegrasyonu",
                      "Barkod tarama, QR kod ve RFID desteği",
                      "Çoklu para birimi ve dil desteği",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start">
                        <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        </div>
                        <span className="text-gray-600 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="#"
                    className="inline-flex items-center text-blue-500 font-medium hover:text-blue-600 transition-colors text-sm"
                  >
                    Daha fazla öğren{" "}
                    <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8 relative overflow-hidden">
                  <div className="relative z-10 text-center">
                    <div className="w-40 h-40 bg-white rounded-xl shadow-sm p-4 mx-auto mb-4 flex items-center justify-center">
                      <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center opacity-90">
                        <Box className="w-14 h-14 text-white" />
                      </div>
                    </div>
                    <p className="text-blue-600 font-medium text-sm">
                      Akıllı Envanter Kontrol Paneli
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Alt Özellikler - daha zarif düzen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Özellik 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group overflow-hidden"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-400 to-indigo-500 flex items-center justify-center shadow-sm">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-4">
                    Çok Kanallı Satış Yönetimi
                  </h3>
                </div>

                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                  Fiziksel mağazalardan dijital pazaryerlerine ve kendi
                  e-ticaret sitenize kadar tüm satış kanallarınızı tek merkezden
                  yönetin. Farklı kanallardaki envanterinizi otomatik senkronize
                  edin.
                </p>

                <div className="h-20 w-full bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg mb-6 flex items-center justify-center">
                  <div className="flex space-x-2 w-3/4">
                    {["🌐", "📱", "🏪", "📦"].map((emoji, i) => (
                      <div
                        key={i}
                        className="h-10 w-10 rounded bg-white shadow-sm flex items-center justify-center font-medium text-lg"
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {[
                    "Pazaryerleri ile tam entegrasyon",
                    "Sosyal medya satış kanalları desteği",
                    "Merkezi sipariş yönetimi",
                    "Kanal bazlı fiyatlandırma",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                      </div>
                      <span className="text-gray-600 text-xs">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="#"
                  className="inline-flex items-center text-indigo-500 font-medium hover:text-indigo-600 transition-colors text-sm"
                >
                  Daha fazla öğren{" "}
                  <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Özellik 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group overflow-hidden"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-violet-400 to-violet-500 flex items-center justify-center shadow-sm">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-4">
                    Gelişmiş Analitik ve Raporlama
                  </h3>
                </div>

                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                  Veriye dayalı kararlar almanızı sağlayan kapsamlı analitik
                  araçları keşfedin. İş zekası gösterge panelleri ile satış
                  performansınızı, envanter dönüş oranlarınızı ve müşteri
                  davranışlarınızı analiz edin.
                </p>

                <div className="h-20 w-full bg-gradient-to-br from-gray-50 to-violet-50 rounded-lg mb-6 flex items-center justify-center">
                  <div className="flex space-x-2 w-3/4 h-12">
                    {[60, 80, 40, 70].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-white rounded-md relative overflow-hidden shadow-sm"
                      >
                        <div
                          className="absolute bottom-0 left-0 w-full bg-violet-400 rounded-b-md"
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {[
                    "Detaylı satış analizi ve tahminleme",
                    "Envanter performansı metrikleri",
                    "Müşteri segmentasyonu",
                    "Özelleştirilebilir raporlar",
                    "Veri aktarım entegrasyonları",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-4 h-4 rounded-full bg-violet-50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                      </div>
                      <span className="text-gray-600 text-xs">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="#"
                  className="inline-flex items-center text-violet-500 font-medium hover:text-violet-600 transition-colors text-sm"
                >
                  Daha fazla öğren{" "}
                  <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Box className="w-8 h-8 text-white" />,
                color: "bg-gradient-to-br from-blue-400 to-blue-500",
                title: "Akıllı Envanter Yönetimi",
                description:
                  "Yapay zeka destekli stok optimizasyonu ve tedarikçi entegrasyonları ile doğru ürün miktarını bulundurun.",
                features: [
                  "Yapay zeka tahminleri",
                  "Çoklu lokasyon desteği",
                  "RFID entegrasyonu",
                ],
              },
              {
                icon: <ShoppingCart className="w-8 h-8 text-white" />,
                color: "bg-gradient-to-br from-indigo-400 to-indigo-500",
                title: "Çok Kanallı Satış",
                description:
                  "Tüm satış kanallarınızı kusursuz entegre edin ve merkezi olarak yönetin.",
                features: [
                  "Stok senkronizasyonu",
                  "Kanal bazlı fiyatlandırma",
                  "Merkezi sipariş yönetimi",
                ],
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-white" />,
                color: "bg-gradient-to-br from-violet-400 to-violet-500",
                title: "Gelişmiş Analitik",
                description:
                  "İş zekası paneliyle satış performansınızı, karlılığınızı ve büyüme fırsatlarınızı analiz edin.",
                features: [
                  "Özelleştirilebilir raporlar",
                  "Satış tahminleri",
                  "Müşteri segmentasyonu",
                ],
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-lg ${feature.color} flex items-center justify-center mb-6 group-hover:shadow-sm transition-all duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-2 mb-6">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      </div>
                      <span className="text-gray-600 text-xs">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 mt-3 border-t border-gray-50">
                  <Link
                    href="#"
                    className="inline-flex items-center text-gray-500 font-medium hover:text-blue-500 transition-colors text-xs"
                  >
                    Daha fazla öğren{" "}
                    <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        id="neden-biz"
        className="py-24 bg-white relative overflow-hidden"
      >
        {/* Dekoratif arka plan çizgileri */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-0 left-1/4 w-px h-full bg-blue-600"></div>
            <div className="absolute top-0 left-2/4 w-px h-full bg-blue-600"></div>
            <div className="absolute top-0 left-3/4 w-px h-full bg-blue-600"></div>
            <div className="absolute top-1/4 left-0 w-full h-px bg-blue-600"></div>
            <div className="absolute top-2/4 left-0 w-full h-px bg-blue-600"></div>
            <div className="absolute top-3/4 left-0 w-full h-px bg-blue-600"></div>
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              Fark Yaratan Özellikler
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden Bizi Seçmelisiniz?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              İşletmenizi büyütürken ihtiyacınız olan tüm güç ve esneklik.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <TrendingUp className="w-8 h-8 text-indigo-600" />,
                title: "Hızlı Büyüme",
                description:
                  "Satışlarınızı artırmanıza yardımcı olacak güçlü araçlar sunar.",
              },
              {
                icon: <Users className="w-8 h-8 text-green-600" />,
                title: "Kolay Kullanım",
                description:
                  "Kullanıcı dostu arayüz ile karmaşık işlemleri basitleştirir.",
              },
              {
                icon: <Shield className="w-8 h-8 text-red-600" />,
                title: "Güvenli Altyapı",
                description:
                  "End-to-end şifreleme ile verileriniz her zaman güvende.",
              },
              {
                icon: <HeadphonesIcon className="w-8 h-8 text-amber-600" />,
                title: "7/24 Destek",
                description:
                  "Uzman ekibimiz her zaman yanınızda ve yardıma hazır.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      100% Memnuniyet
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section id="yorumlar" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Binlerce işletme, Haita ile envanterlerini ve e-ticaret
              operasyonlarını yönetiyor.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                rating: 5,
                text: "Haita sayesinde stok yönetimi artık çok daha kolay. Ürünlerimizi farklı kanallardan sorunsuzca satabiliyoruz.",
                name: "Ahmet Yılmaz",
                company: "Teknoloji Ltd.",
                country: "Türkiye",
              },
              {
                rating: 5,
                text: "Mükemmel bir platform! Birçok envanter yönetim yazılımı denedim, ama bu gerçekten tam olarak ihtiyacım olan her şeyi sunuyor.",
                name: "Ayşe Demir",
                company: "Style Boutique",
                country: "Türkiye",
              },
              {
                rating: 4,
                text: "Kullanıcı dostu arayüzü ve kapsamlı özellikleriyle işletmemiz için mükemmel bir çözüm. Destek ekibi her zaman yardımcı oluyor.",
                name: "Mehmet Kaya",
                company: "Organik Market",
                country: "Türkiye",
              },
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 flex-grow mb-8 italic">
                  "{review.text}"
                </p>
                <div className="flex items-center mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <span className="text-gray-600 font-medium">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-gray-500 text-sm">
                      {review.company}, {review.country}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="sss" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En çok sorulan sorulara cevaplarımız
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question:
                  "Haita'yı kullanmak için teknik bilgiye ihtiyacım var mı?",
                answer:
                  "Hayır, Haita kullanıcı dostu bir arayüze sahiptir ve hiçbir teknik bilgi gerektirmez. Sezgisel tasarımı sayesinde kısa sürede adapte olabilir ve işletmeniz için kullanmaya başlayabilirsiniz.",
              },
              {
                question:
                  "Farklı e-ticaret platformlarıyla entegrasyon sağlıyor mu?",
                answer:
                  "Evet, Haita birçok popüler e-ticaret platformuyla entegre çalışır. WooCommerce, Shopify, Magento, n11, Trendyol ve daha birçok platformla sorunsuz senkronizasyon sağlayabilirsiniz.",
              },
              {
                question: "Ücretsiz deneme süresi var mı?",
                answer:
                  "Evet, Haita'yı 14 gün boyunca ücretsiz deneyebilirsiniz. Bu süre içinde tüm özelliklere erişim sağlayabilir ve işletmeniz için uygun olup olmadığını test edebilirsiniz.",
              },
              {
                question: "Verilerimiz güvende mi?",
                answer:
                  "Kesinlikle! Haita, en son güvenlik standartlarını kullanır ve tüm verileriniz SSL şifreleme ile korunur. Ayrıca düzenli yedeklemeler sayesinde veri kaybı riski minimuma indirilmiştir.",
              },
            ].map((faq, index) => (
              <div key={index} className="mb-6">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl flex justify-between items-center transition-colors duration-300"
                >
                  <span className="font-medium text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`transition-transform duration-300 ${activeAccordion === index ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${activeAccordion === index ? "max-h-40 mt-2" : "max-h-0"}`}
                >
                  <div className="px-6 py-4 bg-gray-50 rounded-xl text-gray-600">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                İşletmenizi Dijitalleştirmeye Hazır Mısınız?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Hemen başlayın ve işletmenizi bir sonraki seviyeye taşıyın.
                Hiçbir kredi kartı gerekmez.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 text-base bg-white text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingCart size={18} />
                  Ücretsiz Hesap Oluşturun
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 text-base border-white text-white hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  <BarChart3 size={18} />
                  Demo Randevusu Alın
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    14 Gün Ücretsiz Deneme
                  </h3>
                  <p className="text-blue-100 mb-6">
                    Kredi kartı gerekmez, anında başlayın ve tüm özellikleri
                    keşfedin.
                  </p>

                  <ul className="text-left mb-8">
                    {[
                      "Sınırsız ürün ve envanter yönetimi",
                      "Çok kanallı satış entegrasyonu",
                      "Gelişmiş raporlama ve analiz araçları",
                      "Özelleştirilebilir ürün kategorileri",
                      "Otomatik stok takibi ve uyarılar",
                      "7/24 teknik destek",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center mb-3">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="ml-2 text-xl font-bold text-white">Haita</span>
            </div>

            <div className="flex space-x-6">
              {["LinkedIn", "Instagram", "Facebook", "Twitter"].map(
                (social, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    {social}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="text-center pt-8 border-t border-gray-800">
            <p>
              © {new Date().getFullYear()} Haita Envanter & E-Ticaret. Tüm
              hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
