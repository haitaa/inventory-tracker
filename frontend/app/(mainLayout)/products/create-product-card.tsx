"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast, { Toaster } from "react-hot-toast";
import { createProduct } from "@/app/lib/productService";
import axios from "axios";
import { ImageUploader } from "@/components/image-uploader";

interface CreateProductCardProps {
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateProductCard({
  trigger,
  onSuccess,
}: CreateProductCardProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [description, setDescription] = useState("");
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!name || !sku || !price) {
      toast.error("Lütfen zorunlu alanları doldurun.");
      return;
    }
    setLoading(true);
    try {
      await createProduct(
        {
          name,
          sku,
          price: parseFloat(price),
          cost_price: costPrice ? parseFloat(costPrice) : undefined,
          description,
          barcode,
        },
        selectedImage || undefined
      );
      toast.success("Ürün başarıyla oluşturuldu.");
      onSuccess?.();
      // Reset form
      setName("");
      setSku("");
      setPrice("");
      setCostPrice("");
      setDescription("");
      setBarcode("");
      setSelectedImage(null);
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.error("Bu SKU ile zaten bir ürün mevcut.");
      } else {
        toast.error("Ürün oluşturulurken hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Product</DialogTitle>
            <DialogDescription>
              Add a new product to your catalog.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1">
              <Label htmlFor="product-name">Name*</Label>
              <Input
                id="product-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fancy Lamp"
                required
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="product-sku">SKU*</Label>
              <Input
                id="product-sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. SKU-001"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label htmlFor="product-price">Price*</Label>
                <Input
                  id="product-price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="product-cost">
                  Cost Price{" "}
                  <span className="text-xs text-muted-foreground">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="product-cost"
                  type="number"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="product-description">
                Description{" "}
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </Label>
              <Textarea
                id="product-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="product-barcode">
                Barcode{" "}
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </Label>
              <Input
                id="product-barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label>Ürün Resmi</Label>
              <ImageUploader
                onImageSelect={(file) => setSelectedImage(file)}
                className="w-full max-w-sm mx-auto"
              />
            </div>
          </div>

          <DialogFooter className="space-x-2">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={handleSubmit}
                disabled={loading || !name || !sku || !price}
              >
                {loading ? "Creating..." : "Create"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
