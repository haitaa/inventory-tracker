"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useTheme } from "next-themes";
import {
  ChevronRight,
  ArrowRight,
  BarChart3,
  Database,
  Users,
  ShoppingCart,
  Shield,
  Zap,
  ArrowDown,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import React from "react";

// Feature kartı için tip tanımlamaları
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  delay?: number;
}

// Stat counter itemları için tip tanımlaması
interface StatCounter {
  name: string;
  initial: number;
  target: number;
  suffix: string;
}

// Minimal Feature Card Komponenti
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  color,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className="group"
      whileHover={{ y: -4 }}
    >
      <div className="h-full p-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${color} mb-5`}
        >
          <Icon size={20} className="text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// Ana Sayfa
export default function Home() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const statCounters: StatCounter[] = [
    { name: "Aktif Kullanıcı", initial: 0, target: 500, suffix: "+" },
    { name: "Ürün", initial: 0, target: 1000, suffix: "+" },
    { name: "Sipariş", initial: 0, target: 5000, suffix: "+" },
    { name: "Memnuniyet", initial: 0, target: 99, suffix: "%" },
  ];

  const [counters, setCounters] = useState(
    statCounters.map((stat) => stat.initial)
  );

  useEffect(() => {
    setMounted(true);

    // İstatistikleri canlandırma
    const timers = statCounters.map((stat, index) => {
      return setInterval(() => {
        setCounters((prevCounters) => {
          const newCounters = [...prevCounters];
          if (newCounters[index] < stat.target) {
            newCounters[index] = Math.min(
              newCounters[index] + Math.ceil(stat.target / 50),
              stat.target
            );
          }
          return newCounters;
        });
      }, 50);
    });

    return () => timers.forEach((timer) => clearInterval(timer));
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = () => {
        setIsVideoLoaded(true);
      };
    }
  }, []);

  const features: FeatureCardProps[] = [
    {
      icon: Database,
      title: "Envanter Yönetimi",
      description:
        "Tüm stok hareketlerinizi gerçek zamanlı izleyin ve optimize edin.",
      color: "bg-blue-500",
    },
    {
      icon: ShoppingCart,
      title: "E-Ticaret Entegrasyonu",
      description:
        "Çoklu kanalları tek noktadan yönetin ve satışlarınızı artırın.",
      color: "bg-indigo-500",
    },
    {
      icon: Users,
      title: "Müşteri İlişkileri",
      description:
        "Müşteri verilerinizi analiz edin ve kişiselleştirilmiş deneyimler sunun.",
      color: "bg-violet-500",
    },
    {
      icon: BarChart3,
      title: "Raporlama ve Analiz",
      description:
        "Güçlü raporlama araçlarıyla verilerinizi anlamlı içgörülere dönüştürün.",
      color: "bg-teal-500",
    },
    {
      icon: Shield,
      title: "Güvenli Altyapı",
      description:
        "End-to-end şifreleme ile verileriniz her zaman güvende kalır.",
      color: "bg-amber-500",
    },
    {
      icon: Zap,
      title: "Hızlı Performans",
      description:
        "Optimizasyonlu arayüz ile saniyeler içinde işlemlerinizi tamamlayın.",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-b border-gray-100 dark:border-gray-800/50"
        style={{ opacity: headerOpacity }}
      >
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center transition-colors">
              <span className="text-white font-medium text-xs">H</span>
            </div>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              Haita
            </span>
          </Link>

          <nav className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="#features"
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Özellikler
            </Link>
            <Link
              href="#about"
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Hakkında
            </Link>
            <Link
              href="#pricing"
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Fiyatlandırma
            </Link>
            <Link
              href="#contact"
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              İletişim
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Tema değiştir"
            >
              {mounted && (isDark ? <Sun size={16} /> : <Moon size={16} />)}
            </button>

            <div className="flex pl-2 border-l border-gray-100 dark:border-gray-800/50">
              <Link href="/auth/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-normal px-3"
                >
                  Giriş
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button
                  size="sm"
                  className="text-xs px-3 bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 ml-1"
                >
                  Kayıt
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Bölümü */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mb-4"
            >
              Envanter ve E-Ticaret Yönetim Sistemi
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight"
            >
              İşletmenizi{" "}
              <span className="text-blue-600 dark:text-blue-400">
                profesyonel
              </span>{" "}
              olarak yönetin
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Stok takibi, sipariş yönetimi ve müşteri ilişkilerini tek bir
              platformda birleştiren minimalist ve güçlü çözümünüz.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link href="/auth/sign-up">
                <Button className="h-10 px-5 rounded-md bg-blue-600 hover:bg-blue-700 text-white">
                  Hemen Başlayın <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" className="h-10 px-5 rounded-md">
                  Keşfedin <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Video Ekranı */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
              <div className="aspect-video bg-white dark:bg-gray-900 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-7 bg-gray-100 dark:bg-gray-800 flex items-center px-3 gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-xs text-gray-400">
                    Haita Dashboard
                  </div>
                </div>
                <div className="mt-7 h-full">
                  <AnimatePresence>
                    {mounted && (
                      <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`w-full h-full object-cover transition-opacity duration-700 ${isVideoLoaded ? "opacity-100" : "opacity-0"}`}
                      >
                        <source src="/dashboard-demo.mp4" type="video/mp4" />
                        Tarayıcınız video etiketini desteklemiyor.
                      </video>
                    )}
                  </AnimatePresence>
                  {!isVideoLoaded && (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* İstatistikler */}
          <div className="max-w-5xl mx-auto mt-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statCounters.map((stat, index) => (
                <div key={index} className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {counters[index].toLocaleString()}
                      {stat.suffix}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {stat.name}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Özellikler Bölümü */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Modern işletmeniz için{" "}
              <span className="text-blue-600 dark:text-blue-400">
                üstün özellikler
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Haita size işletmenizi en verimli şekilde yönetmeniz için
              ihtiyacınız olan tüm araçları sunar.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                delay={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-10 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
            >
              İşletmenizi Bir Üst Seviyeye Taşımaya Hazır Mısınız?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600 dark:text-gray-300 mb-8"
            >
              Hemen ücretsiz hesap oluşturun ve Haita'nın gücünü keşfedin.
              Sınırlı süre için Pro özellikleri 14 gün boyunca ücretsiz.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link href="/auth/sign-up">
                <Button className="h-10 px-5 rounded-md bg-blue-600 hover:bg-blue-700 text-white">
                  Hemen Başlayın
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="h-10 px-5 rounded-md">
                  Bize Ulaşın
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center mb-4">
                <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">H</span>
                </div>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  Haita
                </span>
              </Link>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                İşletmenizi optimum verimlilikte çalıştırmanın en kolay yolu.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Ürün
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Özellikler
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Fiyatlandırma
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Entegrasyonlar
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Destek
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Dokümantasyon
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    SSS
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Şirket
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Kariyer
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              © 2024 Haita. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
              >
                Gizlilik
              </Link>
              <Link
                href="#"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
              >
                Şartlar
              </Link>
              <Link
                href="#"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
              >
                Çerezler
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
