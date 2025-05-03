"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import Layout from "@/components/layout";

interface ProductType {
  id: string;
  name: string;
  sku: string;
  price: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);

  // TODO: getProducts gibi fonksiyonlar hazırlanacak.

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl mb-4">Ürünler</h1>
      <ul className="space-y-2">
        {products.map((p) => (
          <li
            key={p.id}
            className="p-4 bg-white rounded shadow flex justify-between"
          >
            <span>
              {p.name} (SKU: {p.sku})
            </span>
            <span>{p.price} ₺</span>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
