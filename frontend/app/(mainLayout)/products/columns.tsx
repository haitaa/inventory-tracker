"use client";

import type { ColumnDef } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteProduct } from "@/app/lib/productService";
import { z } from "zod";

import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFullImageUrl } from "@/app/lib/productService";
import { Badge } from "@/components/ui/badge";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  price: z.number(),
  imageUrl: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tümünü seç"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Satırı seç"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Image",
    header: "Görsel",
    cell: ({ row }) => {
      const product = row.original;
      const firstLetter = product.name?.charAt(0) || "?";

      return (
        <Avatar className="h-10 w-10 border border-slate-200 shadow-sm">
          <AvatarImage
            src={
              product.imageUrl ? getFullImageUrl(product.imageUrl) : undefined
            }
            alt={product.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-700 dark:from-indigo-900 dark:to-indigo-800 dark:text-indigo-300">
            {firstLetter.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0 font-medium"
        >
          Ürün Adı
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name: string = row.getValue("name");
      return (
        <div className="font-medium text-blue-800 dark:text-blue-400">
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "sku",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0 font-medium"
        >
          Stok Kodu
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const sku: string = row.getValue("sku");
      return (
        <Badge variant="outline" className="bg-slate-50 font-mono text-xs">
          {sku}
        </Badge>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0 font-medium"
          >
            Fiyat
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;
      const router = useRouter();

      const handleView = () => {
        router.push(`/products/${product.id}`);
      };

      const handleEdit = () => {
        router.push(`/products/${product.id}/edit`);
      };

      const handleDelete = async () => {
        if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
        try {
          await deleteProduct(product.id);
          toast.success("Ürün başarıyla silindi.");
          router.refresh();
        } catch (error) {
          console.error(error);
          toast.error("Ürün silinirken hata oluştu.");
        }
      };

      return (
        <div className="flex justify-end space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleView}
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Görüntüle</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Düzenle</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Sil</span>
          </Button>
        </div>
      );
    },
  },
];
