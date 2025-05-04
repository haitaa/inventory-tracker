// app/(mainLayout)/products/[productId]/page.tsx
"use client";

import InventoryTransactions from "@/app/(mainLayout)/products//inventory-transactions";

interface ProductPageProps {
  params: { productId: string };
}

export default function ProductPage({
  params: { productId },
}: ProductPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ürün Detayları</h1>
      {/* …ürün bilgileri burada… */}
      <section className="mt-8">
        <h2 className="text-xl mb-2">Stok Hareketleri</h2>
        <InventoryTransactions productId={productId} />
      </section>
    </div>
  );
}
