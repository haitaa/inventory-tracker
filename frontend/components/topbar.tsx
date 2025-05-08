"use client";

import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Mail,
  ChevronDown,
  Moon,
  Sun,
  Store,
  Sparkles,
  PanelRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getCurrentUser, logout, UserType } from "@/app/lib/userService";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Tooltip bileşenlerini doğru şekilde import ediyoruz
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const Topbar = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [unreadMails, setUnreadMails] = useState(3);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    getCurrentUser(token).then(setUser).catch(console.error);
  }, []);

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between px-4 md:px-6 py-2 border-b border-gray-100 dark:border-gray-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-30 h-16"
    >
      {/* Logo and Brand */}
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md">
            <Store className="h-4 w-4" />
          </div>
          <span className="ml-2 text-lg font-semibold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-400 hidden md:block">
            Haita
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex-1 max-w-xl mx-4 relative">
        <div className="relative group">
          <motion.div
            className={`absolute inset-0 bg-gray-100 dark:bg-gray-800/60 rounded-full -z-10 transition-all ${isSearchFocused ? "opacity-100" : "opacity-0"}`}
            initial={false}
            animate={{
              scaleX: isSearchFocused ? 1 : 0.95,
              opacity: isSearchFocused ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search
              className={`w-4 h-4 ${isSearchFocused ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400"} transition-colors`}
            />
          </div>
          <Input
            placeholder="Ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`rounded-full h-9 pl-10 pr-4 text-sm bg-gray-50/80 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700 focus-visible:ring-indigo-500 focus-visible:ring-opacity-30 focus-visible:border-indigo-500 focus-visible:ring-offset-0 transition-all w-full ${isSearchFocused ? "shadow-inner" : ""}`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <span className="sr-only">Temizle</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Icons and User Info */}
      <div className="flex items-center gap-1 md:gap-3">
        {/* Theme Toggle */}
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="rounded-full w-9 h-9 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Tema değiştir"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? (
                      <Sun className="w-[18px] h-[18px]" />
                    ) : (
                      <Moon className="w-[18px] h-[18px]" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>{isDark ? "Aydınlık moda geç" : "Karanlık moda geç"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Mail Icon with count */}
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full w-9 h-9 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Mail className="w-[18px] h-[18px]" />
                {unreadMails > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5"
                  >
                    <Badge
                      variant="destructive"
                      className="h-4 min-w-4 p-0 flex items-center justify-center text-[10px]"
                    >
                      {unreadMails}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>{unreadMails} okunmamış mesaj</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Bell Icon with count */}
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full w-9 h-9 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Bell className="w-[18px] h-[18px]" />
                {unreadNotifications > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5"
                  >
                    <Badge
                      variant="destructive"
                      className="h-4 min-w-4 p-0 flex items-center justify-center text-[10px]"
                    >
                      {unreadNotifications}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>{unreadNotifications} bildirim</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Panel Button */}
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-9 h-9 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 sm:flex hidden"
              >
                <PanelRight className="w-[18px] h-[18px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>Kontrol Paneli</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-8 hidden md:block" />

        {/* User Info with improved dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 rounded-full gap-2 pl-2 pr-1 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Avatar className="h-7 w-7 border border-gray-200 dark:border-gray-700 shadow-sm">
                <AvatarImage src={"/user-avatar.png"} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-300">
                  {user.username?.substring(0, 2)?.toUpperCase() || "KL"}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only md:not-sr-only text-sm font-medium max-w-[100px] truncate">
                {user.username || "Kullanıcı"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-1 p-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Avatar className="h-10 w-10">
                <AvatarImage src={"/user-avatar.png"} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-300">
                  {user.username?.substring(0, 2)?.toUpperCase() || "KL"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.username || "Kullanıcı"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-none">
                  {user.email || "kullanici@haita.com"}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="rounded-lg gap-3 py-2 cursor-pointer">
                <User className="w-4 h-4 text-indigo-500" />
                <div className="flex flex-col">
                  <span>Profil</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Hesap bilgilerinizi yönetin
                  </span>
                </div>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg gap-3 py-2 cursor-pointer">
                <CreditCard className="w-4 h-4 text-green-500" />
                <div className="flex flex-col">
                  <span>Ödeme</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Ödeme yöntemlerinizi yönetin
                  </span>
                </div>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg gap-3 py-2 cursor-pointer">
                <Settings className="w-4 h-4 text-amber-500" />
                <div className="flex flex-col">
                  <span>Ayarlar</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Uygulama ayarlarını değiştirin
                  </span>
                </div>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="rounded-lg cursor-pointer">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                <span>Takım</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="rounded-lg cursor-pointer">
                  <UserPlus className="w-4 h-4 mr-2 text-purple-500" />
                  <span>Kullanıcı davet et</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-1">
                    <DropdownMenuItem className="rounded-lg cursor-pointer">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      <span>E-posta</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg cursor-pointer">
                      <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
                      <span>Mesaj</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded-lg cursor-pointer">
                      <PlusCircle className="w-4 h-4 mr-2 text-purple-500" />
                      <span>Daha fazla...</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem className="rounded-lg cursor-pointer">
              <LifeBuoy className="w-4 h-4 mr-2 text-amber-500" />
              <span>Destek</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              onClick={() => logout()}
              className="rounded-lg gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 focus:bg-red-100 dark:focus:bg-red-900/30 font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış Yap</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default Topbar;
