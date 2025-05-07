"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUploader } from "@/components/image-uploader";
import toast from "react-hot-toast";
import { uploadProductImage } from "@/app/lib/productService";

interface ProductImageModalProps {
  productId: string;
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export function ProductImageModal({
  productId,
  trigger,
  onSuccess,
}: ProductImageModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error("Lütfen bir resim seçin.");
      return;
    }

    setLoading(true);
    try {
      await uploadProductImage(productId, selectedImage);
      toast.success("Resim başarıyla yüklendi.");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Resim yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ürün Resmi Yükle</DialogTitle>
          <DialogDescription>
            Ürün için yeni bir resim seçin ve yükleyin.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ImageUploader
            onImageSelect={(file) => setSelectedImage(file)}
            className="w-full max-w-sm mx-auto"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedImage || loading}>
            {loading ? "Yükleniyor..." : "Yükle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
