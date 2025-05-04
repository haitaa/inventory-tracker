"use client";

import { getProducts, ProductType } from "@/app/lib/productService";
import { columns } from "@/app/(mainLayout)/products/columns";
import { useEffect, useState } from "react";
import { DataTable } from "@/app/(mainLayout)/products/data-table";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { PiExportBold } from "react-icons/pi";
import Topbar from "@/components/topbar";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);

  // TODO: Add spinner for the reload job
  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    getProducts(token).then(setProducts).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-12 bg-gradient-to-br from-indigo-50 via-white to-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="col-span-2 bg-white border-r border-gray-200 shadow-md">
        <Sidebar />
      </aside>
      {/* Main Content */}
      <main className="col-span-10 overflow-y-auto p-10 space-y-6">
        <Topbar />
        {/* Page Header */}
        <div className="col-span-10 px-12 pt-8 pb-4">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-4xl font-bold text-gray-900">Products</h2>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <Button className={""} variant={"outline"}>
                <PiExportBold className={"size-4"} />
                Export
              </Button>
              <Button className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 transition duration-200">
                + New Product
              </Button>
            </div>
          </div>
        </div>
        <div className="col-span-10 px-12 pb-12">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <DataTable columns={columns} data={products} />
          </div>
        </div>
      </main>
    </div>
  );
}
