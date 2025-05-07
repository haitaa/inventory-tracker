"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit, Trash2, User } from "lucide-react";
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

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const filteredCustomers = customers.filter((customer) => {
    const fullName = getFullName(customer).toLowerCase();
    const email = (customer.email || "").toLowerCase();
    const phone = (customer.phone || "").toLowerCase();
    const searchLower = searchQuery.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      phone.includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Müşteriler</h1>
        <Button onClick={() => router.push("/customers/new")}>
          <Plus className="mr-2 h-4 w-4" /> Müşteri Ekle
        </Button>
      </div>

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
          <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
            <Input
              type="search"
              placeholder="Müşteri ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
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
                {searchQuery
                  ? "Arama kriterlerinize uygun müşteri bulunamadı."
                  : "Henüz müşteri eklenmemiş."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Aramayı Temizle
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Adı Soyadı</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Konum</TableHead>
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
                              <span className="sr-only">Menüyü aç</span>
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
                                router.push(`/customers/${customer.id}/edit`)
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="text-red-600 hover:text-red-700 focus:text-red-700"
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
