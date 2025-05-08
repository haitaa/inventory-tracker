"use client";

import { getProducts, ProductType } from "@/app/lib/productService";
import { columns } from "@/app/(mainLayout)/products/columns";
import { useEffect, useState } from "react";
import { DataTable } from "@/app/(mainLayout)/products/data-table";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Package,
  FileUp,
  FileDown,
  ExternalLink,
  RefreshCcw,
} from "lucide-react";
import { CreateProductCard } from "@/app/(mainLayout)/products/create-product-card";
import { DropdownImport } from "@/app/(mainLayout)/products/dropdown-import";
import { DropdownExport } from "./dropdown-export";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? (localStorage.getItem("token") ?? "") : "";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error("Ürünler yüklenirken hata:", err);
      setError("Ürünler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Animasyon yapılandırması
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

  const avgPrice = products.length
    ? products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length
    : 0;

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900/10 p-6 min-h-full rounded-lg">
      {/* Başlık Alanı */}
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-400">
            Ürün Yönetimi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            E-ticaret sistemindeki tüm ürünleri yönetin ve takip edin
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            onClick={fetchProducts}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Yenileniyor..." : "Yenile"}
          </Button>
          <DropdownExport />
          <DropdownImport />
          <CreateProductCard
            trigger={
              <Button className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 gap-2">
                <Plus className="h-4 w-4" /> Yeni Ürün
              </Button>
            }
            onSuccess={fetchProducts}
          />
        </div>
      </div>

      {/* Hata mesajı */}
      {error && (
        <Alert variant="destructive" className="animate-fadeIn">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* İstatistik Kartları */}
      <motion.div
        className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Toplam Ürün
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{products.length}</div>
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ortalama Fiyat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {avgPrice.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ₺
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Son Eklenen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {products.length > 0
                    ? new Date(products[0].createdAt).toLocaleDateString(
                        "tr-TR"
                      )
                    : "-"}
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Ürün Tablosu */}
      <Card className="border-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800/50">
        <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-800/30">
          <div className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-indigo-500" />
            <CardTitle>Ürün Listesi</CardTitle>
          </div>
          <CardDescription>
            Sistemdeki tüm ürünlerinizi görüntüleyin ve yönetin
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <DataTable columns={columns} data={products} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
