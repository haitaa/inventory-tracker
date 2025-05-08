"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Github,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Lütfen e-posta ve şifrenizi girin.");
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Giriş yapılırken bir hata oluştu."
      );
    }
  };

  // Animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800 relative overflow-hidden">
      {/* Dekoratif arka plan unsurları */}
      <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full overflow-hidden">
        {mounted && (
          <>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-300 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-80 -right-20 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-24 left-1/2 w-72 h-72 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </>
        )}
      </div>

      <div className="flex-1 hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 dark:from-indigo-800 dark:via-indigo-700 dark:to-purple-800 flex items-center justify-center backdrop-blur-sm overflow-hidden">
          {/* Dekoratif arka plan elementleri */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl transform -translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 max-w-2xl text-white relative z-10"
          >
            <div className="inline-flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full text-sm font-medium mb-8 border border-white/10">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              Sistem aktif ve çalışıyor
            </div>

            <h1 className="text-5xl font-bold mb-6 tracking-tight">
              <span className="relative">
                <span className="relative z-10">Haita</span>
                <span className="absolute -bottom-1.5 left-0 right-0 h-3 bg-gradient-to-r from-yellow-300/70 to-amber-400/70 -rotate-1 z-0"></span>
              </span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-100">
                Envanter ve E-Ticaret Sistemi
              </span>
            </h1>

            <p className="text-lg opacity-90 mb-10 leading-relaxed font-light">
              İşletmenizin tüm yönetim ihtiyaçlarını tek bir platformda
              birleştiren gelişmiş çözüm. Stoklarınızı, siparişlerinizi ve
              müşterilerinizi zahmetsizce yönetin.
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-6"
            >
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10 shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/20 group"
              >
                <div className="w-12 h-12 mb-4 rounded-lg bg-indigo-400/20 flex items-center justify-center text-white">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 12V8H4V12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 16V20H20V16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 8H22"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 16H22"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-xl mb-2 group-hover:text-blue-200 transition-colors">
                  Stok Yönetimi
                </h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Akıllı stok takibi ve envanter yönetimi ile stok
                  seviyelerinizi optimize edin.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10 shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/20 group"
              >
                <div className="w-12 h-12 mb-4 rounded-lg bg-purple-400/20 flex items-center justify-center text-white">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-xl mb-2 group-hover:text-purple-200 transition-colors">
                  E-Ticaret Entegrasyonu
                </h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Çoklu kanal satışlarınızı kolayca yönetin ve sipariş durumunu
                  takip edin.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10 shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/20 group"
              >
                <div className="w-12 h-12 mb-4 rounded-lg bg-blue-400/20 flex items-center justify-center text-white">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-xl mb-2 group-hover:text-blue-200 transition-colors">
                  Müşteri İlişkileri
                </h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Müşteri bilgilerini yönetin ve tekrar eden satışlar oluşturun.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10 shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/20 group"
              >
                <div className="w-12 h-12 mb-4 rounded-lg bg-emerald-400/20 flex items-center justify-center text-white">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 20V10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 20V4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 20V14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-xl mb-2 group-hover:text-emerald-200 transition-colors">
                  Raporlama & Analiz
                </h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Detaylı raporlar ve analitik verilerle işletmenizi geliştirin.
                </p>
              </motion.div>
            </motion.div>

            <div className="mt-12 py-4 border-t border-white/10 text-sm text-white/60 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>7/24 Destek</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>Gelişmiş Analitik</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>Güvenli Altyapı</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="w-full border-0 shadow-2xl bg-white/80 dark:bg-gray-800/90 backdrop-blur-md">
            <CardHeader className="space-y-4 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="mx-auto w-20 h-20 mb-2"
              >
                <div className="h-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md p-2 rounded-xl">
                  H
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Yönetim Paneline Hoş Geldiniz
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Hesabınıza giriş yaparak devam edin
              </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 text-sm bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-md flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    E-posta Adresi
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-indigo-500 transition-colors duration-200" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="adiniz@sirket.com"
                      className="pl-10 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-sm font-medium">
                      Şifre
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline"
                    >
                      Şifremi Unuttum
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-indigo-500 transition-colors duration-200" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    Oturumumu açık tut
                  </label>
                </motion.div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4 pt-3">
                <motion.div variants={itemVariants} className="w-full">
                  <Button
                    type="submit"
                    className="w-full font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Giriş Yapılıyor...</span>
                      </div>
                    ) : (
                      "Giriş Yap"
                    )}
                  </Button>
                </motion.div>

                <div className="relative flex items-center gap-4 py-2">
                  <Separator className="flex-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    veya
                  </span>
                  <Separator className="flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path
                          fill="#4285F4"
                          d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                        />
                        <path
                          fill="#34A853"
                          d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                        />
                      </g>
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    <Github className="h-5 w-5 mr-2" />
                    GitHub
                  </Button>
                </div>

                <p className="text-sm text-center text-muted-foreground mt-4">
                  Henüz hesabınız yok mu?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium hover:underline"
                  >
                    Kayıt Ol
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Tailwind'e yeni animasyonlar eklemek için global.css'e şunları ekleyin:
// @layer utilities {
//   .animation-delay-2000 {
//     animation-delay: 2s;
//   }
//   .animation-delay-4000 {
//     animation-delay: 4s;
//   }
//   @keyframes blob {
//     0% {
//       transform: translate(0px, 0px) scale(1);
//     }
//     33% {
//       transform: translate(30px, -50px) scale(1.1);
//     }
//     66% {
//       transform: translate(-20px, 20px) scale(0.9);
//     }
//     100% {
//       transform: translate(0px, 0px) scale(1);
//     }
//   }
//   .animate-blob {
//     animation: blob 7s infinite;
//   }
// }
