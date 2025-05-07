// app/(mainLayout)/products/[productId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";
import { ProductType } from "@/app/lib/productService";
import {
  getInventoryTransactionsByProduct,
  InventoryTransactionType,
} from "@/app/lib/inventoryTransactionService";
import { ProductChart } from "@/components/ProductChart";
import InventoryTransactions from "../inventory-transactions";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { deleteProductImage } from "@/app/lib/productService";
import { ProductImageModal } from "@/components/product-image-modal";
import Image from "next/image";
import { getFullImageUrl } from "@/app/lib/productService";

function GeneralSection({
  product,
  transactions,
}: {
  product: ProductType;
  transactions: InventoryTransactionType[];
}) {
  // Hesaplanan stok adedi
  const currentStock = transactions.reduce(
    (tot, tx) => (tx.type === "IN" ? tot + tx.quantity : tot - tx.quantity),
    0
  );
  return (
    <div className="p-6 bg-background rounded-lg space-y-6">
      {/* Üst bölüm: Görsel, Bilgi kartı, Satın al */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-4">
          {product.imageUrl ? (
            <Image
              src={getFullImageUrl(product.imageUrl)}
              alt={product.name}
              width={400}
              height={300}
              className="w-full rounded-lg shadow-sm"
            />
          ) : (
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Resim yok</span>
            </div>
          )}

          {/* Ürün detay sayfasına resim yükleme butonu ekleyin */}
          <div className="flex gap-2">
            <ProductImageModal
              productId={product.id}
              trigger={
                <Button variant="outline" size="sm">
                  Resim Yükle
                </Button>
              }
              onSuccess={() => {
                // Başarılı olduğunda sayfayı yenile
                window.location.reload();
              }}
            />

            {product.imageUrl && (
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  try {
                    await deleteProductImage(product.id);
                    // Başarılı olduğunda sayfayı yenile
                    window.location.reload();
                  } catch (error) {
                    toast.error("Resim silinirken hata oluştu");
                  }
                }}
              >
                Resmi Kaldır
              </Button>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200 space-y-3">
          <h3 className="text-xl font-semibold text-text-default">
            {product.name}
          </h3>
          <p className="text-sm text-text-muted">SKU: {product.sku}</p>
          <p className="text-sm font-medium">Fiyat: {product.price} ₺</p>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              currentStock === 0
                ? "bg-badge-danger-bg text-danger"
                : currentStock < 5
                  ? "bg-badge-warning-bg text-warning"
                  : "bg-badge-success-bg text-success"
            }`}
          >
            {currentStock === 0
              ? "Tükendi"
              : currentStock < 5
                ? "Azaldı"
                : "Stokta"}
          </span>
        </div>
        <div className="flex items-center justify-center">
          <Button variant="default" size="lg" className="w-full">
            Buy Now
          </Button>
        </div>
      </div>
      <hr className="border-gray-200" />
      {/* Alt bölüm: Grafik ve hareketler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <h4 className="text-lg font-semibold mb-2">Stok Grafiği</h4>
          <ProductChart transactions={transactions} />
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <h4 className="text-lg font-semibold mb-2">Stok Hareketleri</h4>
          <InventoryTransactions productId={product.id} />
        </div>
      </div>
    </div>
  );
}
function AttributesSection() {
  return <div>Attributes content here</div>;
}
function OptionsSection() {
  return <div>Options content here</div>;
}
function FilesSection() {
  return <div>Files content here</div>;
}
function ShippingPickupSection() {
  return <div>Shipping & Pickup content here</div>;
}
function TaxesSection() {
  return <div>Taxes content here</div>;
}
function SEOSection() {
  return <div>SEO content here</div>;
}
function RelatedProductsSection() {
  return <div>Related Products content here</div>;
}
function BuyNowSection() {
  return (
    <button className="px-6 py-2 bg-green-600 text-white rounded-md">
      Buy Now
    </button>
  );
}

const sections = [
  { key: "general", label: "General", Component: GeneralSection },
  { key: "attributes", label: "Attributes", Component: AttributesSection },
  { key: "options", label: "Options", Component: OptionsSection },
  { key: "files", label: "Files", Component: FilesSection },
  {
    key: "shipping",
    label: "Shipping & Pickup",
    Component: ShippingPickupSection,
  },
  { key: "taxes", label: "Taxes", Component: TaxesSection },
  { key: "seo", label: "SEO", Component: SEOSection },
  {
    key: "related",
    label: "Related Products",
    Component: RelatedProductsSection,
  },
  { key: "buy", label: "Buy Now", Component: BuyNowSection },
];

interface ProductPageProps {
  params: { productId: string };
}

export default function ProductPage({
  params: { productId },
}: ProductPageProps) {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [transactions, setTransactions] = useState<InventoryTransactionType[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<string>("general");
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? (localStorage.getItem("token") ?? "")
        : "";
    (async () => {
      try {
        const [prodRes, txs] = await Promise.all([
          api.get<ProductType>(`/products/${productId}`),
          getInventoryTransactionsByProduct(token, productId),
        ]);
        setProduct(prodRes.data);
        setTransactions(txs);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  if (loading) return <div>Yükleniyor…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>Ürün bulunamadı.</div>;

  const ActiveComponent =
    sections.find((s) => s.key === active)?.Component || sections[0].Component;

  return (
    <div className="space-y-6 bg-gradient-to-br from-indigo-50 via-white to-gray-100 text-gray-900 min-h-full p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {sections.map((s) => (
          <Button
            key={s.key}
            variant={active === s.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActive(s.key)}
          >
            {s.label}
          </Button>
        ))}
      </div>
      <div className="pt-4">
        <ActiveComponent product={product} transactions={transactions} />
      </div>
    </div>
  );
}
