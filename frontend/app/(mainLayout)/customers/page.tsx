"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomerType } from "@/types/schema";
import {
  getCustomers,
  deleteCustomer,
  getFullName,
} from "@/app/lib/customerService";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import SegmentationDashboard from "@/components/customer/SegmentationDashboard";

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Gelişmiş arama ve filtreleme için state'ler
  const [filters, setFilters] = useState<{
    city?: string;
    country?: string;
    hasEmail?: boolean;
    hasPhone?: boolean;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>({
    sortBy: "name",
    sortOrder: "asc",
  });

  // Aktif filtre sayısı
  const activeFilterCount = Object.keys(filters).filter(
    (key) =>
      key !== "sortBy" &&
      key !== "sortOrder" &&
      filters[key as keyof typeof filters] !== undefined
  ).length;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Müşteriler yüklenirken hata:", error);
      setError("Müşteriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) {
      try {
        await deleteCustomer(id);
        setSuccess("Müşteri başarıyla silindi.");
        fetchCustomers();

        // Başarı mesajını 3 saniye sonra temizle
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (error: any) {
        console.error("Müşteri silinirken hata:", error);
        setError(
          error.response?.data?.message || "Müşteri silinirken bir hata oluştu."
        );
      }
    }
  };

  // Şehirleri ve ülkeleri filtreleme için ayıkla
  const cities = [
    ...new Set(customers.map((c) => c.city).filter(Boolean) as string[]),
  ];
  const countries = [
    ...new Set(customers.map((c) => c.country).filter(Boolean) as string[]),
  ];

  // Filtreleri temizle
  const clearFilters = () => {
    setFilters({
      sortBy: "name",
      sortOrder: "asc",
    });
  };

  const filteredCustomers = customers
    .filter((customer) => {
      // Temel arama filtresi
      const fullName = getFullName(customer).toLowerCase();
      const email = (customer.email || "").toLowerCase();
      const phone = (customer.phone || "").toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      const basicSearchMatch =
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower);

      if (!basicSearchMatch) return false;

      // Şehir filtresi
      if (filters.city && customer.city !== filters.city) return false;

      // Ülke filtresi
      if (filters.country && customer.country !== filters.country) return false;

      // Email filtresi
      if (filters.hasEmail && !customer.email) return false;

      // Telefon filtresi
      if (filters.hasPhone && !customer.phone) return false;

      return true;
    })
    .sort((a, b) => {
      let valueA: any;
      let valueB: any;

      // Sıralama alanı seçimi
      switch (filters.sortBy) {
        case "name":
          valueA = getFullName(a).toLowerCase();
          valueB = getFullName(b).toLowerCase();
          break;
        case "email":
          valueA = (a.email || "").toLowerCase();
          valueB = (b.email || "").toLowerCase();
          break;
        case "city":
          valueA = (a.city || "").toLowerCase();
          valueB = (b.city || "").toLowerCase();
          break;
        case "country":
          valueA = (a.country || "").toLowerCase();
          valueB = (b.country || "").toLowerCase();
          break;
        default:
          valueA = getFullName(a).toLowerCase();
          valueB = getFullName(b).toLowerCase();
      }

      // Sıralama yönü
      const direction = filters.sortOrder === "asc" ? 1 : -1;

      return valueA < valueB
        ? -1 * direction
        : valueA > valueB
          ? 1 * direction
          : 0;
    });

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900/10 p-6 min-h-full rounded-lg">
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-400">
            Müşteri Yönetimi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tüm müşterilerinizi yönetin ve müşteri ilişkilerinizi geliştirin
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Button onClick={() => router.push("/customers/new")}>
            <Plus className="mr-2 h-4 w-4" /> Müşteri Ekle
          </Button>
        </div>
      </div>

      <SegmentationDashboard />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert
          variant="default"
          className="bg-green-50 border-green-500 text-green-700"
        >
          <AlertTitle>Başarılı</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Müşteri Listesi</CardTitle>
          <CardDescription>
            Envanter yönetimi sistemindeki tüm müşterileriniz
          </CardDescription>
          <div className="flex flex-col md:flex-row gap-3 w-full items-center mt-2">
            <div className="relative w-full md:w-auto flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Müşteri ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 flex-1"
              />
              {searchQuery && (
                <X
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtrele
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filtreler</h4>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Şehir</label>
                      <Select
                        value={filters.city ?? "all"}
                        onValueChange={(value: string) =>
                          setFilters({
                            ...filters,
                            city: value === "all" ? undefined : value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tüm şehirler" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tüm şehirler</SelectItem>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ülke</label>
                      <Select
                        value={filters.country ?? "all"}
                        onValueChange={(value: string) =>
                          setFilters({
                            ...filters,
                            country: value === "all" ? undefined : value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tüm ülkeler" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tüm ülkeler</SelectItem>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        Diğer Filtreler
                      </label>

                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id="has-email"
                          checked={filters.hasEmail}
                          onCheckedChange={(checked) => {
                            setFilters({
                              ...filters,
                              hasEmail: checked === true ? true : undefined,
                            });
                          }}
                        />
                        <label
                          htmlFor="has-email"
                          className="text-sm leading-none"
                        >
                          Sadece e-posta adresi olanlar
                        </label>
                      </div>

                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id="has-phone"
                          checked={filters.hasPhone}
                          onCheckedChange={(checked) => {
                            setFilters({
                              ...filters,
                              hasPhone: checked === true ? true : undefined,
                            });
                          }}
                        />
                        <label
                          htmlFor="has-phone"
                          className="text-sm leading-none"
                        >
                          Sadece telefon numarası olanlar
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sıralama</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={filters.sortBy}
                          onValueChange={(value) =>
                            setFilters({ ...filters, sortBy: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sıralama alanı" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">İsim</SelectItem>
                            <SelectItem value="email">E-posta</SelectItem>
                            <SelectItem value="city">Şehir</SelectItem>
                            <SelectItem value="country">Ülke</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={filters.sortOrder}
                          onValueChange={(value: "asc" | "desc") =>
                            setFilters({ ...filters, sortOrder: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Yön" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asc">Artan</SelectItem>
                            <SelectItem value="desc">Azalan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Filtreleri Temizle
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>

        {/* Aktif filtreler gösterimi */}
        {activeFilterCount > 0 && (
          <div className="px-6 py-2 border-t border-b flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Aktif Filtreler:
            </span>

            {filters.city && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Şehir: {filters.city}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setFilters({ ...filters, city: undefined })}
                />
              </Badge>
            )}

            {filters.country && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Ülke: {filters.country}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setFilters({ ...filters, country: undefined })}
                />
              </Badge>
            )}

            {filters.hasEmail && (
              <Badge variant="secondary" className="flex items-center gap-1">
                E-posta adresi olanlar
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters({ ...filters, hasEmail: undefined })
                  }
                />
              </Badge>
            )}

            {filters.hasPhone && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Telefon numarası olanlar
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters({ ...filters, hasPhone: undefined })
                  }
                />
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={clearFilters}
            >
              Tümünü Temizle
            </Button>
          </div>
        )}

        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Müşteri Bulunamadı</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery || activeFilterCount > 0
                  ? "Arama ve filtreleme kriterlerinize uygun müşteri bulunamadı."
                  : "Henüz müşteri eklenmemiş."}
              </p>
              {(searchQuery || activeFilterCount > 0) && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    clearFilters();
                  }}
                >
                  Tüm Filtreleri Temizle
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className={filters.sortBy === "name" ? "bg-gray-50" : ""}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          sortBy: "name",
                          sortOrder:
                            filters.sortBy === "name" &&
                            filters.sortOrder === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      <div className="flex items-center cursor-pointer">
                        Adı Soyadı
                        {filters.sortBy === "name" && (
                          <span className="ml-1">
                            {filters.sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className={filters.sortBy === "email" ? "bg-gray-50" : ""}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          sortBy: "email",
                          sortOrder:
                            filters.sortBy === "email" &&
                            filters.sortOrder === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      <div className="flex items-center cursor-pointer">
                        E-posta
                        {filters.sortBy === "email" && (
                          <span className="ml-1">
                            {filters.sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead
                      className={
                        filters.sortBy === "city" ||
                        filters.sortBy === "country"
                          ? "bg-gray-50"
                          : ""
                      }
                      onClick={() =>
                        setFilters({
                          ...filters,
                          sortBy: "city",
                          sortOrder:
                            filters.sortBy === "city" &&
                            filters.sortOrder === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      <div className="flex items-center cursor-pointer">
                        Konum
                        {(filters.sortBy === "city" ||
                          filters.sortBy === "country") && (
                          <span className="ml-1">
                            {filters.sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {getFullName(customer)}
                      </TableCell>
                      <TableCell>{customer.email || "-"}</TableCell>
                      <TableCell>{customer.phone || "-"}</TableCell>
                      <TableCell>
                        {customer.city ? (
                          <Badge variant="outline">
                            {customer.city}
                            {customer.country ? `, ${customer.country}` : ""}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <span className="sr-only">Menü Aç</span>
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
                                className="lucide lucide-more-vertical"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/customers/${customer.id}`)
                              }
                            >
                              <User className="mr-2 h-4 w-4" />
                              Detaylar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/customers/${customer.id}?edit=true`
                                )
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="text-red-600 focus:text-red-500"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
