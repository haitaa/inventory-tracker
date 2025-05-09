// components/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { logout } from "@/app/lib/userService";

import {
  LuLayoutDashboard,
  LuShoppingBag,
  LuSun,
  LuMoon,
} from "react-icons/lu";
import { FaCube, FaUserGroup, FaStar, FaGem } from "react-icons/fa6";
import { HiOutlineBuildingOffice2, HiCog6Tooth } from "react-icons/hi2";
import { BsFillCreditCard2BackFill, BsGraphUpArrow } from "react-icons/bs";
import {
  MdOutlineBarChart,
  MdPayments,
  MdCategory,
  MdWorkspaces,
  MdSupportAgent,
} from "react-icons/md";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { FiChevronRight, FiChevronDown, FiActivity } from "react-icons/fi";
import { FaWarehouse } from "react-icons/fa";
import { TbLayoutGridAdd } from "react-icons/tb";
import { RiStore2Line, RiPagesLine } from "react-icons/ri";

// Gruplandırılmış menü öğeleri tipini tanımlayalım
type NavItem = {
  label: string;
  href: string;
  icon: any; // IconType;
  badge: number | null;
  highlight?: boolean;
};

type NavGroup = {
  title: string;
  icon: any; // IconType;
  items: NavItem[];
};

// Gruplandırılmış menü öğeleri
const navGroups: NavGroup[] = [
  {
    title: "Ana Menü",
    icon: MdWorkspaces,
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LuLayoutDashboard,
        badge: null,
        highlight: true,
      },
      {
        label: "Mağaza Sayfaları",
        href: "/store-pages",
        icon: RiStore2Line,
        badge: null,
        highlight: true,
      },
    ],
  },
  {
    title: "İşlemler",
    icon: FiActivity,
    items: [
      { label: "Siparişler", href: "/orders", icon: LuShoppingBag, badge: 7 },
      { label: "Ürünler", href: "/products", icon: FaCube, badge: null },
      { label: "Depolar", href: "/warehouses", icon: FaWarehouse, badge: null },
      {
        label: "Müşteriler",
        href: "/customers",
        icon: FaUserGroup,
        badge: null,
      },
      {
        label: "Çalışanlar",
        href: "/employees",
        icon: HiOutlineBuildingOffice2,
        badge: null,
      },
    ],
  },
  {
    title: "Finans",
    icon: BsGraphUpArrow,
    items: [
      { label: "Ödemeler", href: "/payments", icon: MdPayments, badge: 3 },
      {
        label: "Faturalama",
        href: "/billing",
        icon: BsFillCreditCard2BackFill,
        badge: null,
      },
      {
        label: "Analitik",
        href: "/analytics",
        icon: MdOutlineBarChart,
        badge: null,
      },
    ],
  },
  {
    title: "Diğer",
    icon: MdCategory,
    items: [
      { label: "Ayarlar", href: "/settings", icon: HiCog6Tooth, badge: null },
      {
        label: "Yardım",
        href: "/help",
        icon: HiQuestionMarkCircle,
        badge: null,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // Sidebar'ın genişletilmiş durumunu yönetme
  const [isExpanded, setIsExpanded] = useState(true);

  // Aktif kullanıcı durum göstergesi
  const [userStatus, setUserStatus] = useState<"active" | "busy" | "offline">(
    "active"
  );

  // Dekoratif efekt animasyonu için state
  const [animateBlob, setAnimateBlob] = useState(false);

  // Varsayılan olarak tüm grupları açık tut
  useEffect(() => {
    // Kullanıcının önceki genişletme tercihini localStorage'dan al
    const savedExpandState = localStorage.getItem("sidebarExpanded");
    if (savedExpandState !== null) {
      setIsExpanded(savedExpandState === "true");
    }

    // Grup durumunu da localStorage'dan al
    const savedCollapsedState = localStorage.getItem("sidebarGroupsState");
    if (savedCollapsedState) {
      setCollapsed(JSON.parse(savedCollapsedState));
    } else {
      // Varsayılan olarak hiçbir grup kapalı değil
      const defaultCollapsedState = navGroups.reduce(
        (acc, group) => {
          acc[group.title] = false; // false = açık demek
          return acc;
        },
        {} as Record<string, boolean>
      );
      setCollapsed(defaultCollapsedState);
    }

    // Dekoratif efektler için zamanlayıcı
    const interval = setInterval(() => {
      setAnimateBlob((prev) => !prev);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Sidebar'ı genişletme/daraltma işlevi
  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem("sidebarExpanded", newState.toString());
  };

  // Grup durumunu tersine çevirme
  const toggleGroup = (title: string) => {
    const newCollapsedState = {
      ...collapsed,
      [title]: !collapsed[title],
    };
    setCollapsed(newCollapsedState);
    localStorage.setItem(
      "sidebarGroupsState",
      JSON.stringify(newCollapsedState)
    );
  };

  // Kullanıcı durumu değiştirme
  const toggleUserStatus = () => {
    const statuses: ("active" | "busy" | "offline")[] = [
      "active",
      "busy",
      "offline",
    ];
    const currentIndex = statuses.indexOf(userStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setUserStatus(statuses[nextIndex]);
  };

  // Durum renklerini ve etiketlerini ayarlama
  const statusConfig = {
    active: { color: "bg-emerald-500", label: "Aktif" },
    busy: { color: "bg-amber-500", label: "Meşgul" },
    offline: { color: "bg-gray-400", label: "Çevrimdışı" },
  };

  // Animasyon varyantları
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <aside
      className={`bg-gradient-to-b from-gray-900 via-indigo-950 to-slate-900 h-screen flex flex-col justify-between transition-all duration-300 ease-in-out ${
        isExpanded ? "w-72" : "w-20"
      } relative overflow-hidden z-10`}
    >
      {/* Dekoratif arka plan efektleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 -right-20 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: animateBlob ? [-50, 50, -50] : [50, -50, 50] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-indigo-600/5 rounded-full filter blur-3xl opacity-30"
        ></motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-transparent opacity-50"></div>

        {/* Zarif ızgara deseni */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxMC4wOCAwIDE1LjQ1OSAxLjAxMyAxNS40NTkgMy4yVjYwSDE4VjIxLjJjMC0yLjE4NyA1LjM3LTMuMiAxOC0zLjJ6IiBmaWxsLW9wYWNpdHk9Ii4wNCIgZmlsbD0iIzA5MGI0OSIvPjxwYXRoIGQ9Ik0wIDBIMzBWMzBIMHoiLz48cGF0aCBkPSJNMzAgMEg2MFYzMEgzMHoiLz48cGF0aCBkPSJNMCAzMEgzMFY2MEgweiIvPjxwYXRoIGQ9Ik0zMCAzMEg2MFY2MEgzMHoiLz48L2c+PC9zdmc+')] opacity-[0.03]"></div>
      </div>

      {/* Genişletme/Daraltma Butonu */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-colors z-10 rounded-full p-1.5 text-white shadow-lg border border-indigo-400 group"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiChevronRight className="h-4 w-4 group-hover:scale-110 transition-transform" />
        </motion.div>
      </button>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Logo Alanı */}
        <div
          className={`px-6 pt-6 pb-8 ${
            isExpanded ? "border-b border-indigo-800/20" : "border-none"
          }`}
        >
          <Link href="/" className="flex items-center group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-600 shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-105">
              <span className="font-bold text-white text-xl">H</span>
              <motion.div
                className="absolute inset-0 rounded-xl bg-white opacity-20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1, opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3"
                >
                  <div className="relative">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                      Haita
                    </h1>
                    <div className="absolute top-full left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </div>
                  <p className="text-xs text-indigo-300 font-medium">
                    Envanter Sistemi
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Tema Geçiş Butonu */}
        {isExpanded && (
          <div className="mt-4 px-6">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex items-center w-full gap-2 text-xs bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-200 rounded-lg p-2 transition-all"
            >
              <div className="flex items-center">
                <motion.div
                  initial={false}
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <LuSun
                    className={`w-4 h-4 absolute inset-0 ${isDark ? "opacity-0" : "opacity-100"} transition-opacity`}
                  />
                  <LuMoon
                    className={`w-4 h-4 ${isDark ? "opacity-100" : "opacity-0"} transition-opacity`}
                  />
                </motion.div>
              </div>
              <span>{isDark ? "Aydınlık Mod" : "Karanlık Mod"}</span>
              <div className="ml-auto">
                <div
                  className={`w-7 h-3.5 rounded-full ${isDark ? "bg-indigo-700" : "bg-indigo-600"} relative transition-colors`}
                >
                  <motion.div
                    className="absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-md"
                    animate={{ x: isDark ? 14 : 2 }}
                    transition={{ duration: 0.2 }}
                  ></motion.div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Nav Scroll Area */}
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <motion.nav
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {navGroups.map((group) => (
              <motion.div
                key={group.title}
                variants={itemVariants}
                className="space-y-1"
              >
                {isExpanded && (
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="flex items-center justify-between w-full text-xs font-semibold tracking-wider text-indigo-300 hover:text-indigo-200 uppercase px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-indigo-900/30 mb-2"
                  >
                    <div className="flex items-center">
                      <group.icon className="h-3.5 w-3.5 mr-2" />
                      <span>{group.title}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: collapsed[group.title] ? 0 : 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown className="h-3 w-3" />
                    </motion.div>
                  </button>
                )}
                <AnimatePresence mode="wait">
                  {!collapsed[group.title] && (
                    <motion.div
                      key={`group-${group.title}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {group.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`
                              flex items-center px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                              ${
                                isActive
                                  ? "bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-md"
                                  : `text-gray-300 hover:bg-indigo-800/50 hover:text-white ${item.highlight ? "border-l-2 border-indigo-500 bg-indigo-900/20" : ""}`
                              }
                              ${!isExpanded ? "justify-center" : ""}
                              group relative overflow-hidden
                            `}
                          >
                            {/* Item hover efekti */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-indigo-700/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div
                              className={`relative z-10 ${
                                isActive
                                  ? "text-white"
                                  : "text-indigo-300 group-hover:text-white"
                              }`}
                            >
                              <item.icon
                                className={`${
                                  isExpanded ? "h-5 w-5" : "h-6 w-6"
                                } transition-transform group-hover:scale-110 duration-300`}
                              />

                              {/* Bildirim rozeti */}
                              {item.badge && (
                                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-[10px] font-medium text-white shadow-sm shadow-red-900/30 border border-red-400/20 animate-pulse">
                                  {item.badge}
                                </span>
                              )}
                            </div>

                            {isExpanded && (
                              <div className="ml-3 flex-1 flex justify-between items-center relative z-10">
                                <span>{item.label}</span>

                                {/* Aktif öğe işareti */}
                                {isActive && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-white shadow-sm shadow-white/50"></div>
                                )}

                                {/* Süsleme yıldızı */}
                                {item.highlight &&
                                  !isActive &&
                                  item.href !== "/store-pages" && (
                                    <FaStar className="h-2.5 w-2.5 text-amber-400" />
                                  )}

                                {/* Mağaza sayfaları için özel efekt */}
                                {item.href === "/store-pages" && !isActive && (
                                  <div className="flex items-center space-x-1">
                                    <span className="text-xs text-indigo-200 bg-indigo-800/60 px-1.5 py-0.5 rounded-full font-medium">
                                      Pro
                                    </span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-pulse"></div>
                                  </div>
                                )}

                                {/* İşlem tamamlandı işareti */}
                                {item.href === "/payments" && !isActive && (
                                  <FaGem className="h-3 w-3 text-emerald-400" />
                                )}
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.nav>
        </div>
      </div>

      {/* Alt Bilgi Bölümü */}
      <div
        className={`px-3 pb-6 pt-3 ${
          isExpanded ? "border-t border-indigo-800/20" : "border-none"
        }`}
      >
        {isExpanded && (
          <div className="mb-4 rounded-lg bg-gradient-to-br from-indigo-900/50 to-slate-900/50 backdrop-blur-sm p-3 hover:from-indigo-800/50 hover:to-slate-800/50 transition-colors relative group">
            <div className="flex items-center">
              <button
                onClick={toggleUserStatus}
                className="relative h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center text-white overflow-hidden group-hover:shadow-md transition-shadow duration-300 border border-indigo-500/20"
              >
                <span className="font-medium">MH</span>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 ${statusConfig[userStatus].color}`}
                ></div>
              </button>
              <div className="ml-3">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-white group-hover:text-indigo-100 transition-colors">
                    Mustafa Haita
                  </p>
                  <div
                    className={`ml-2 h-2 w-2 rounded-full ${statusConfig[userStatus].color}`}
                  ></div>
                </div>
                <div className="flex items-center gap-1 text-xs text-indigo-300 group-hover:text-indigo-200 transition-colors">
                  <span>Admin</span>
                  <span className="text-indigo-500">•</span>
                  <span>{statusConfig[userStatus].label}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-indigo-800/20 flex justify-between">
              <button className="text-xs text-indigo-300 hover:text-indigo-100 transition-colors flex items-center">
                <MdSupportAgent className="mr-1 h-3 w-3" />
                Yardım
              </button>
              <button className="text-xs text-indigo-300 hover:text-indigo-100 transition-colors flex items-center">
                <HiCog6Tooth className="mr-1 h-3 w-3" />
                Profil
              </button>
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: isExpanded ? 1.02 : 1.1 }}
          whileTap={{ scale: isExpanded ? 0.98 : 0.95 }}
          onClick={() => {
            if (typeof logout === "function") {
              logout();
            } else {
              console.error("Logout function not available");
              // Fallback olarak ana sayfaya yönlendir
              window.location.href = "/auth/sign-in";
            }
          }}
          className={`
            w-full flex items-center px-4 py-2.5 rounded-lg transition-all duration-200
            text-gray-300 hover:bg-red-900/30 hover:text-red-100
            ${!isExpanded ? "justify-center" : ""}
            bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/20
          `}
        >
          <FaArrowRightToBracket
            className={`${
              isExpanded ? "h-5 w-5" : "h-6 w-6"
            } text-red-400 group-hover:text-red-300`}
          />
          {isExpanded && <span className="ml-3 text-sm">Çıkış Yap</span>}

          <motion.div
            className="absolute inset-0 rounded-lg bg-red-500/5 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
      </div>
    </aside>
  );
}

// Global CSS'inize ekleyin
// .custom-scrollbar::-webkit-scrollbar {
//   width: 5px;
// }
// .custom-scrollbar::-webkit-scrollbar-track {
//   background-color: rgba(107, 114, 128, 0.1);
//   border-radius: 5px;
// }
// .custom-scrollbar::-webkit-scrollbar-thumb {
//   background-color: rgba(79, 70, 229, 0.2);
//   border-radius: 5px;
// }
// .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//   background-color: rgba(79, 70, 229, 0.4);
// }
// @keyframes blob {
//   0% {
//     transform: translate(0px, 0px) scale(1);
//   }
//   33% {
//     transform: translate(30px, -50px) scale(1.1);
//   }
//   66% {
//     transform: translate(-20px, 20px) scale(0.9);
//   }
//   100% {
//     transform: translate(0px, 0px) scale(1);
//   }
// }
// .animate-blob {
//   animation: blob 7s infinite;
// }
// .animation-delay-4000 {
//   animation-delay: 4s;
// }
