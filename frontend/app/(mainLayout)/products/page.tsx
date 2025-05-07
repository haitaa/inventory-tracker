"use client";

import { getProducts, ProductType } from "@/app/lib/productService";
import { columns } from "@/app/(mainLayout)/products/columns";
import { useEffect, useState } from "react";
import { DataTable } from "@/app/(mainLayout)/products/data-table";
import { Button } from "@/components/ui/button";
import { PiExportBold } from "react-icons/pi";
import { CreateProductCard } from "@/app/(mainLayout)/products/create-product-card";
import { DropdownImport } from "@/app/(mainLayout)/products/dropdown-import";
import { DropdownExport } from "./dropdown-export";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const token =
    typeof window !== "undefined" ? (localStorage.getItem("token") ?? "") : "";
  const fetchProducts = () => {
    getProducts(token).then(setProducts).catch(console.error);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6 bg-gradient-to-br from-indigo-50 via-white to-gray-100 text-gray-900 min-h-full p-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-4xl font-bold text-gray-900">Products</h2>
        <div className="flex items-center space-x-4">
          <DropdownImport />
          <DropdownExport />
          <CreateProductCard
            trigger={
              <Button className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 transition duration-200">
                + New Product
              </Button>
            }
            onSuccess={fetchProducts}
          />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  );
}
