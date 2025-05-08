"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Minus, FileText, X, Calendar } from "lucide-react";
import { toast } from "sonner";
import { WarehouseType } from "@/types/schema";
import { getWarehouses } from "@/app/lib/warehouseService";
import {
  addInventoryStock,
  removeInventoryStock,
} from "@/app/lib/inventoryTransactionService";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const inventoryTransactionSchema = z.object({
  warehouseId: z.string({
    required_error: "Lütfen bir depo seçin",
  }),
  quantity: z.coerce.number().positive({
    message: "Miktar 0'dan büyük olmalıdır",
  }),
  notes: z.string().optional(),
  reference: z.string().optional(),
  transactionDate: z.date({
    required_error: "Lütfen bir tarih seçin",
  }),
  reason: z.string().optional(),
  isReturned: z.boolean().default(false).optional(),
});

type InventoryTransactionFormValues = z.infer<
  typeof inventoryTransactionSchema
>;

interface InventoryTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  transactionType: "IN" | "OUT";
  onSuccess?: () => void;
  initialWarehouseId?: string;
}

export function InventoryTransactionModal({
  isOpen,
  onClose,
  productId,
  transactionType,
  onSuccess,
  initialWarehouseId,
}: InventoryTransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [warehousesLoading, setWarehousesLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const transactionReasons = {
    IN: [
      { value: "purchase", label: "Satın Alma" },
      { value: "return", label: "Müşteri İadesi" },
      { value: "transfer", label: "Depo Transferi" },
      { value: "adjustment", label: "Envanter Düzeltme" },
      { value: "production", label: "Üretim" },
    ],
    OUT: [
      { value: "sale", label: "Satış" },
      { value: "return", label: "Tedarikçi İadesi" },
      { value: "transfer", label: "Depo Transferi" },
      { value: "damage", label: "Hasar/Kayıp" },
      { value: "use", label: "İç Kullanım" },
      { value: "expired", label: "Son Kullanma Tarihi Geçmiş" },
    ],
  };

  // Form tanımlaması
  const form = useForm<InventoryTransactionFormValues>({
    resolver: zodResolver(inventoryTransactionSchema),
    defaultValues: {
      warehouseId: initialWarehouseId || "",
      quantity: 1,
      notes: "",
      reference: "",
      transactionDate: new Date(),
      reason: "",
      isReturned: false,
    },
  });

  // Depoları yükle
  useEffect(() => {
    if (isOpen) {
      // Eğer initialWarehouseId varsa form değerini güncelle
      if (initialWarehouseId) {
        form.setValue("warehouseId", initialWarehouseId);
      }

      setWarehousesLoading(true);
      const token = localStorage.getItem("token") || "";

      getWarehouses()
        .then((data) => {
          setWarehouses(data);
        })
        .catch((error) => {
          console.error("Depolar yüklenirken hata:", error);
          toast.error("Depolar yüklenirken bir hata oluştu");
        })
        .finally(() => {
          setWarehousesLoading(false);
        });
    }
  }, [isOpen, initialWarehouseId, form]);

  // Dosya yükleme
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Dosya silme
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Form gönderildiğinde
  const onSubmit = async (data: InventoryTransactionFormValues) => {
    setLoading(true);
    const token = localStorage.getItem("token") || "";

    try {
      if (transactionType === "IN") {
        await addInventoryStock(
          token,
          productId,
          data.quantity,
          data.warehouseId,
          data.notes,
          {
            reference: data.reference,
            transactionDate: data.transactionDate,
            reason: data.reason,
            isReturned: data.isReturned,
          }
        );
        toast.success("Stok başarıyla eklendi");
      } else {
        await removeInventoryStock(
          token,
          productId,
          data.quantity,
          data.warehouseId,
          data.notes,
          {
            reference: data.reference,
            transactionDate: data.transactionDate,
            reason: data.reason,
            isReturned: data.isReturned,
          }
        );
        toast.success("Stok başarıyla çıkarıldı");
      }

      // Başarılı işlem sonrası
      onClose();
      form.reset();
      setFiles([]);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("İşlem hatası:", error);
      toast.error(
        transactionType === "IN"
          ? "Stok eklenirken bir hata oluştu"
          : "Stok çıkarılırken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {transactionType === "IN" ? (
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-emerald-500" />
                <span>Stok Ekle</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Minus className="h-5 w-5 text-red-500" />
                <span>Stok Çıkar</span>
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {transactionType === "IN"
              ? "Ürün stoğunu artırmak için aşağıdaki formu doldurun."
              : "Ürün stoğunu azaltmak için aşağıdaki formu doldurun."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Depo seçimi */}
              <FormField
                control={form.control}
                name="warehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depo*</FormLabel>
                    <Select
                      disabled={warehousesLoading || loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Depo seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {warehousesLoading ? (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                            <span className="text-sm text-muted-foreground">
                              Yükleniyor...
                            </span>
                          </div>
                        ) : warehouses.length > 0 ? (
                          warehouses.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="text-center py-2 text-sm text-muted-foreground">
                            Depo bulunamadı
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* İşlem Tarihi */}
              <FormField
                control={form.control}
                name="transactionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>İşlem Tarihi*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "d MMMM yyyy", { locale: tr })
                            ) : (
                              <span>Tarih seçin</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={tr}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Miktar */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miktar*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Stok miktarı"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      {transactionType === "IN" ? "Eklenecek" : "Çıkarılacak"}{" "}
                      ürün adedi
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Referans No */}
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referans No</FormLabel>
                    <FormControl>
                      <Input placeholder="Sipariş/Fatura No" {...field} />
                    </FormControl>
                    <FormDescription>
                      İsteğe bağlı sipariş veya fatura numarası
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* İşlem Nedeni */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İşlem Nedeni</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="İşlem nedenini seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transactionReasons[transactionType].map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Stok {transactionType === "IN" ? "ekleme" : "çıkarma"}{" "}
                    işleminin amacı
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* İade mi? */}
            {((transactionType === "IN" && form.watch("reason") === "return") ||
              (transactionType === "OUT" &&
                form.watch("reason") === "return")) && (
              <FormField
                control={form.control}
                name="isReturned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>İade İşlemi</FormLabel>
                      <FormDescription>
                        {transactionType === "IN"
                          ? "Bu bir müşteri iadesi ise işaretleyin"
                          : "Bu bir tedarikçi iadesi ise işaretleyin"}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Notlar */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notlar</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="İşlem hakkında ek bilgiler..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    İşlemle ilgili isteğe bağlı notlar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Belge yükleme */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Belgeler</label>
                <p className="text-xs text-muted-foreground">
                  Opsiyonel (PDF, JPG, PNG)
                </p>
              </div>
              <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="w-full h-full flex flex-col items-center cursor-pointer"
                >
                  <FileText className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Belge yüklemek için tıklayın
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    veya dosyaları sürükleyip bırakın
                  </p>
                </label>
              </div>

              {/* Yüklenen dosyalar */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted rounded-md p-2"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={loading || warehousesLoading}
                className={
                  transactionType === "IN"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {transactionType === "IN" ? "Stok Ekle" : "Stok Çıkar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
