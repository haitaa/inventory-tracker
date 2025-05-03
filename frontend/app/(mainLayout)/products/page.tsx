"use client";

import { getProducts, ProductType } from "@/app/lib/productService";
import { columns } from "@/app/(mainLayout)/products/columns";
import { useEffect, useState } from "react";
import { DataTable } from "@/app/(mainLayout)/products/data-table";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);

  // TODO: Add spinner for the reload job
  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    getProducts(token).then(setProducts).catch(console.error);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={products} />
    </div>
  );
}
