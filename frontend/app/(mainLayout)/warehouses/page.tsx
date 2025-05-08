"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Building2,
  Edit,
  Loader2,
  Package,
  Plus,
  Search,
  Trash2,
  Warehouse,
  MapPin,
  Phone,
  Mail,
  User,
  LayoutGrid,
  List,
  ArrowUpDown,
  Boxes,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "@/app/lib/warehouseService";
import { WarehouseType } from "@/types/schema";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Form doğrulama şeması
const warehouseFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Depo adı en az 2 karakter olmalıdır" })
    .max(50, { message: "Depo adı en fazla 50 karakter olabilir" }),
  code: z
    .string()
    .min(2, { message: "Depo kodu en az 2 karakter olmalıdır" })
    .max(10, { message: "Depo kodu en fazla 10 karakter olabilir" })
    .optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .email({ message: "Geçerli bir e-posta adresi girin" })
    .optional(),
  managerName: z.string().optional(),
  capacity: z.string().optional(),
});

type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;

export default function WarehousesPage() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] =
    useState<WarehouseType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Animasyon için varyantlar
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

  // Yeni depo eklemek için form
  const addForm = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  // Depo düzenlemek için form
  const editForm = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  // Depoları getir
  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const data = await getWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.error("Depolar alınırken hata oluştu:", error);
      toast.error("Depolar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrelenmiş depolar
  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sıralama işlemi
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sıralanmış depolar
  const sortedWarehouses = [...filteredWarehouses].sort((a, b) => {
    const aValue = a[sortField as keyof WarehouseType];
    const bValue = b[sortField as keyof WarehouseType];

    if (!aValue && !bValue) return 0;
    if (!aValue) return sortDirection === "asc" ? 1 : -1;
    if (!bValue) return sortDirection === "asc" ? -1 : 1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  // Yeni depo ekleme işlemi
  const handleAddWarehouse = async (data: WarehouseFormValues) => {
    try {
      await createWarehouse({
        name: data.name,
        code: data.code,
        address: data.address,
        city: data.city,
        district: data.district,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        email: data.email,
        managerName: data.managerName,
        capacity: data.capacity,
      });

      toast.success("Depo başarıyla eklendi");
      setIsAddDialogOpen(false);
      addForm.reset();
      fetchWarehouses();
    } catch (error) {
      console.error("Depo eklenirken hata:", error);
      toast.error("Depo eklenirken bir hata oluştu");
    }
  };

  // Depo düzenleme işlemi
  const handleEditWarehouse = async (data: WarehouseFormValues) => {
    if (!currentWarehouse) return;

    try {
      await updateWarehouse(currentWarehouse.id, {
        name: data.name,
        code: data.code,
        address: data.address,
        city: data.city,
        district: data.district,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        email: data.email,
        managerName: data.managerName,
        capacity: data.capacity,
      });

      toast.success("Depo başarıyla güncellendi");
      setIsEditDialogOpen(false);
      editForm.reset();
      fetchWarehouses();
    } catch (error) {
      console.error("Depo güncellenirken hata:", error);
      toast.error("Depo güncellenirken bir hata oluştu");
    }
  };

  // Depo silme işlemi
  const handleDeleteWarehouse = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteWarehouse(id);
      toast.success("Depo başarıyla silindi");
      fetchWarehouses();
    } catch (error) {
      console.error("Depo silinirken hata:", error);
      toast.error("Depo silinirken bir hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };

  // Düzenleme modalını açma
  const openEditDialog = (warehouse: WarehouseType) => {
    setCurrentWarehouse(warehouse);
    editForm.setValue("name", warehouse.name || "");
    editForm.setValue("code", warehouse.code || "");
    editForm.setValue("address", warehouse.address || "");
    editForm.setValue("city", warehouse.city || "");
    editForm.setValue("district", warehouse.district || "");
    editForm.setValue("postalCode", warehouse.postalCode || "");
    editForm.setValue("country", warehouse.country || "");
    editForm.setValue("phone", warehouse.phone || "");
    editForm.setValue("email", warehouse.email || "");
    editForm.setValue("managerName", warehouse.managerName || "");
    editForm.setValue("capacity", warehouse.capacity?.toString() || "");
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6 pt-0">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
          Depolar
        </h1>
        <p className="text-muted-foreground">
          Ürünlerinizin stok durumlarını yönetmek için depoları görüntüleyin ve
          yönetin
        </p>
      </div>

      <Separator />

      {/* Özet İstatistikler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Toplam Depo
                </p>
                <h3 className="text-2xl font-bold">
                  {filteredWarehouses.length}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Warehouse className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Aktif Lokasyonlar
                </p>
                <h3 className="text-2xl font-bold">
                  {
                    new Set(
                      filteredWarehouses.map((w) => w.city).filter(Boolean)
                    ).size
                  }
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Toplam Stok
                </p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Boxes className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Doluluk Oranı
                </p>
                <h3 className="text-2xl font-bold">%0</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Depo ara..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="border rounded-md p-1 flex">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Yeni Depo Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni Depo Ekle</DialogTitle>
              <DialogDescription>
                Yeni bir depo eklemek için aşağıdaki formu doldurun.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form
                onSubmit={addForm.handleSubmit(handleAddWarehouse)}
                className="space-y-4"
              >
                <Tabs defaultValue="basic">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
                    <TabsTrigger value="address">Adres Bilgileri</TabsTrigger>
                    <TabsTrigger value="contact">İletişim</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <FormField
                      control={addForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Depo Adı*</FormLabel>
                          <FormControl>
                            <Input placeholder="Ana Depo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Depo Kodu</FormLabel>
                          <FormControl>
                            <Input placeholder="D001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Depo Kapasitesi</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1000"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Maksimum kapasite (birim, adet vs.)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="address" className="space-y-4 pt-4">
                    <FormField
                      control={addForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adres</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Depo adresi..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Şehir</FormLabel>
                            <FormControl>
                              <Input placeholder="İstanbul" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={addForm.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>İlçe</FormLabel>
                            <FormControl>
                              <Input placeholder="Kadıköy" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Posta Kodu</FormLabel>
                            <FormControl>
                              <Input placeholder="34000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={addForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ülke</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Türkiye"
                                {...field}
                                defaultValue="Türkiye"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4 pt-4">
                    <FormField
                      control={addForm.control}
                      name="managerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Depo Sorumlusu</FormLabel>
                          <FormControl>
                            <Input placeholder="Ahmet Yılmaz" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <Input placeholder="+90 212 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta</FormLabel>
                          <FormControl>
                            <Input placeholder="depo@sirket.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button type="submit">
                    {addForm.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Depoyu Ekle
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Depo Listeleme */}
      {loading ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : filteredWarehouses.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Building2 className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">Depo Bulunamadı</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Arama kriterlerinize uygun depo bulunamadı."
                : "Henüz depo eklemediniz. Yeni bir depo eklemek için yukarıdaki butonu kullanabilirsiniz."}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mx-auto"
              >
                Filtreyi Temizle
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-800/30">
            <div className="flex items-center">
              <Warehouse className="h-5 w-5 mr-2 text-indigo-500" />
              <CardTitle>Depo Listesi</CardTitle>
            </div>
            <CardDescription>
              Sisteminizde tanımlı olan tüm depolar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="px-0 font-medium flex items-center"
                      >
                        Depo Adı
                        {sortField === "name" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Konum</TableHead>
                    <TableHead>Depo Kodu</TableHead>
                    <TableHead>İletişim</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedWarehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-indigo-500" />
                          {warehouse.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {warehouse.city ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span>
                              {warehouse.city}
                              {warehouse.district
                                ? `, ${warehouse.district}`
                                : ""}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Belirtilmemiş
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {warehouse.code ? (
                          <Badge
                            variant="outline"
                            className="bg-slate-50 font-mono text-xs"
                          >
                            {warehouse.code}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Tanımlanmamış
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {warehouse.phone ? (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{warehouse.phone}</span>
                          </div>
                        ) : warehouse.email ? (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span>{warehouse.email}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Belirtilmemiş
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(`/warehouses/${warehouse.id}`)
                            }
                          >
                            <Warehouse className="h-4 w-4 text-indigo-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(warehouse)}
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Depoyu silmek istediğinizden emin misiniz?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bu işlem geri alınamaz. Bu depo kalıcı olarak
                                  silinecek ve içindeki ürünlerle olan
                                  bağlantısı kaldırılacaktır.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteWarehouse(warehouse.id)
                                  }
                                  className="bg-red-600 text-white hover:bg-red-700"
                                >
                                  {isDeleting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  Evet, Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-gray-800/30 border-t py-3">
            <div className="text-xs text-muted-foreground">
              Toplam {filteredWarehouses.length} depo
            </div>
          </CardFooter>
        </Card>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sortedWarehouses.map((warehouse) => (
            <motion.div key={warehouse.id} variants={itemVariants}>
              <Card className="h-full hover:shadow-md transition-shadow duration-200 border-0 shadow-sm overflow-hidden">
                <CardHeader
                  className="pb-2 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 cursor-pointer"
                  onClick={() => router.push(`/warehouses/${warehouse.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="mr-4 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {warehouse.name}
                        </CardTitle>
                        {warehouse.code && (
                          <Badge
                            variant="outline"
                            className="bg-white/70 dark:bg-gray-800/50 font-mono text-xs mt-1"
                          >
                            {warehouse.code}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/warehouses/${warehouse.id}`);
                        }}
                      >
                        <Warehouse className="h-4 w-4 text-indigo-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(warehouse);
                        }}
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Depoyu silmek istediğinizden emin misiniz?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu işlem geri alınamaz. Bu depo kalıcı olarak
                              silinecek ve içindeki ürünlerle olan bağlantısı
                              kaldırılacaktır.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteWarehouse(warehouse.id)
                              }
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              {isDeleting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Evet, Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent
                  className="pt-4 cursor-pointer"
                  onClick={() => router.push(`/warehouses/${warehouse.id}`)}
                >
                  <div className="space-y-2">
                    {(warehouse.address || warehouse.city) && (
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 text-slate-400 mt-0.5" />
                        <div className="text-sm">
                          {warehouse.address && <div>{warehouse.address}</div>}
                          {warehouse.city && (
                            <div>
                              {warehouse.city}
                              {warehouse.district
                                ? `, ${warehouse.district}`
                                : ""}
                              {warehouse.postalCode
                                ? ` ${warehouse.postalCode}`
                                : ""}
                            </div>
                          )}
                          {warehouse.country && <div>{warehouse.country}</div>}
                        </div>
                      </div>
                    )}

                    {warehouse.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="text-sm">{warehouse.phone}</span>
                      </div>
                    )}

                    {warehouse.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="text-sm">{warehouse.email}</span>
                      </div>
                    )}

                    {warehouse.managerName && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="text-sm">{warehouse.managerName}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter
                  className="pt-2 pb-4 cursor-pointer"
                  onClick={() => router.push(`/warehouses/${warehouse.id}`)}
                >
                  <div className="w-full pt-2 border-t flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="text-muted-foreground">0 Ürün</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Doluluk: 0%</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Düzenleme Modalı */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Depo Düzenle</DialogTitle>
            <DialogDescription>
              Depo bilgilerini güncellemek için formu düzenleyin.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleEditWarehouse)}
              className="space-y-4"
            >
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
                  <TabsTrigger value="address">Adres Bilgileri</TabsTrigger>
                  <TabsTrigger value="contact">İletişim</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depo Adı*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depo Kodu</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depo Kapasitesi</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1000" {...field} />
                        </FormControl>
                        <FormDescription>
                          Maksimum kapasite (birim, adet vs.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="address" className="space-y-4 pt-4">
                  <FormField
                    control={editForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adres</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Depo adresi..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Şehir</FormLabel>
                          <FormControl>
                            <Input placeholder="İstanbul" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İlçe</FormLabel>
                          <FormControl>
                            <Input placeholder="Kadıköy" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Posta Kodu</FormLabel>
                          <FormControl>
                            <Input placeholder="34000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ülke</FormLabel>
                          <FormControl>
                            <Input placeholder="Türkiye" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 pt-4">
                  <FormField
                    control={editForm.control}
                    name="managerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depo Sorumlusu</FormLabel>
                        <FormControl>
                          <Input placeholder="Ahmet Yılmaz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input placeholder="+90 212 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-posta</FormLabel>
                        <FormControl>
                          <Input placeholder="depo@sirket.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  İptal
                </Button>
                <Button type="submit">
                  {editForm.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Kaydet
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
