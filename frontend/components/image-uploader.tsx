"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Camera, X } from "lucide-react";

interface ImageUploaderProps {
  imageUrl?: string;
  onImageSelect: (file: File) => void;
  onImageRemove?: () => void;
  className?: string;
}

export function ImageUploader({
  imageUrl,
  onImageSelect,
  onImageRemove,
  className,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageRemove?.();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        id="product-image-upload"
      />

      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden w-full aspect-square">
          <Image
            src={previewUrl}
            alt="Ürün resmi önizleme"
            className="object-cover"
            layout="fill"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-8 h-8 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor="product-image-upload"
          className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Camera className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">
                Resim yüklemek için tıklayın
              </span>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF (Max. 5MB)</p>
          </div>
        </label>
      )}
    </div>
  );
}
