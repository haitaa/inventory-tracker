"use client";

import { useState, useEffect } from "react";
import { InventoryTransactionType } from "@/types/schema";
import { getInventoryTransactionsByProduct } from "@/app/lib/inventoryTransactionService";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowDownUp,
  Calendar,
  Download,
  Filter,
  Search,
  RefreshCw,
  ArrowUpDown,
  Info,
  Package,
  Clock,
  Warehouse,
  User,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InventoryTransactionsProps {
  productId: string;
}

export default function InventoryTransactions({
  productId,
}: InventoryTransactionsProps) {
  const [transactions, setTransactions] = useState<InventoryTransactionType[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Filtreleme ve sıralama için state'ler
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "quantity" | "type">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Sayfalama için state'ler
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? (localStorage.getItem("token") ?? "")
        : "";

    setLoading(true);
    getInventoryTransactionsByProduct(token, productId)
      .then((data) => {
        setTransactions(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  // İşlem tipine göre renk ve etiket belirleme
  const getTransactionTypeDetails = (type: string) => {
    switch (type) {
      case "IN":
        return {
          label: "Giriş",
          color:
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
          icon: <ArrowDownUp className="h-3 w-3 mr-1 text-emerald-500" />,
        };
      case "OUT":
        return {
          label: "Çıkış",
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          icon: (
            <ArrowDownUp className="h-3 w-3 mr-1 text-red-500 rotate-180" />
          ),
        };
      default:
        return {
          label: type,
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
          icon: <Info className="h-3 w-3 mr-1" />,
        };
    }
  };

  // Verileri filtrele
  const filteredTransactions = transactions.filter((tx) => {
    if (filterType !== "all" && tx.type !== filterType) return false;

    // Arama filtrelemesi - ID, kullanıcı veya depo bilgisinde
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tx.id.toLowerCase().includes(query) ||
        tx.user?.email?.toLowerCase().includes(query) ||
        false ||
        tx.warehouse?.name?.toLowerCase().includes(query) ||
        false
      );
    }

    return true;
  });

  // Verileri sırala
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (sortBy === "quantity") {
      return sortOrder === "asc"
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    }

    if (sortBy === "type") {
      return sortOrder === "asc"
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    }

    return 0;
  });

  // Sayfalama için veri dilimi
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toplam sayfa sayısı
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Sayfa numarası oluşturma
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 5 veya daha az sayfa varsa tümünü göster
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mevcut sayfanın etrafını göster
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // Son sayfalar görünürken başlangıç sayfasını ayarla
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // Sıralama değiştirme
  const toggleSort = (column: "date" | "quantity" | "type") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  // Yükleme durumu için skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[300px]" />
        </div>
        <div className="space-y-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-center text-red-700 dark:text-red-400 mb-2">
          <Info className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Hata Oluştu</h3>
        </div>
        <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Yeniden Dene
        </Button>
      </div>
    );
  }

  // Veri yok durumu
  if (transactions.length === 0) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
        <Package className="h-10 w-10 text-blue-500 mx-auto mb-3" />
        <h3 className="text-blue-700 dark:text-blue-400 font-medium mb-1">
          İşlem Bulunamadı
        </h3>
        <p className="text-blue-600/80 dark:text-blue-300/80 text-sm max-w-md mx-auto">
          Bu ürüne ait stok giriş veya çıkış işlemi henüz kaydedilmemiş.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtreler ve Araçlar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        {/* Arama ve Filtreler */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ID, kullanıcı veya depo ara..."
              className="pl-9 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Tüm İşlemler" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Tüm İşlemler</SelectItem>
                <SelectItem value="IN">Stok Girişleri</SelectItem>
                <SelectItem value="OUT">Stok Çıkışları</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Sayfalama ve Dışa Aktarma */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1); // Sayfa boyutu değiştiğinde ilk sayfaya dön
            }}
          >
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="10 Kayıt" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sayfa Başına</SelectLabel>
                <SelectItem value="5">5 Kayıt</SelectItem>
                <SelectItem value="10">10 Kayıt</SelectItem>
                <SelectItem value="25">25 Kayıt</SelectItem>
                <SelectItem value="50">50 Kayıt</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white dark:bg-gray-800"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Rapor İndir</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* İşlem Tablosu */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleSort("type")}
                >
                  İşlem Tipi
                  <ArrowUpDown
                    className={`ml-1 h-4 w-4 ${sortBy === "type" ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
              </TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleSort("quantity")}
                >
                  Miktar
                  <ArrowUpDown
                    className={`ml-1 h-4 w-4 ${sortBy === "quantity" ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
              </TableHead>
              <TableHead>Depo</TableHead>
              <TableHead>Kullanıcı</TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleSort("date")}
                >
                  Tarih
                  <ArrowUpDown
                    className={`ml-1 h-4 w-4 ${sortBy === "date" ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => {
                const typeDetails = getTransactionTypeDetails(tx.type);

                return (
                  <TableRow key={tx.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {tx.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${typeDetails.color} flex items-center w-fit`}
                      >
                        {typeDetails.icon}
                        {typeDetails.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {tx.quantity.toLocaleString()} adet
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Warehouse className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        <span className="text-sm">
                          {tx.warehouse?.name || "Bilinmiyor"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        <span className="text-sm">
                          {tx.user?.email || "Bilinmiyor"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-2" />
                        {tx.createdAt ? (
                          <time dateTime={tx.createdAt}>
                            {format(
                              new Date(tx.createdAt),
                              "d MMM yyyy, HH:mm",
                              { locale: tr }
                            )}
                          </time>
                        ) : (
                          "Tarih yok"
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Filter className="h-8 w-8 mb-2" />
                    <p>Arama kriterlerinize uygun sonuç bulunamadı.</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setFilterType("all");
                        setSearchQuery("");
                      }}
                    >
                      Filtreleri Temizle
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Sayfalama ve Sonuç Sayısı */}
      {filteredTransactions.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Toplam{" "}
            <span className="font-medium">{filteredTransactions.length}</span>{" "}
            işlem içinden{" "}
            <span className="font-medium">
              {Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                filteredTransactions.length
              )}
            </span>
            -
            <span className="font-medium">
              {Math.min(
                currentPage * itemsPerPage,
                filteredTransactions.length
              )}
            </span>{" "}
            arası gösteriliyor
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
