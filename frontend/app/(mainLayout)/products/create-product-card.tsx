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

interface CreateProductCardProps {
  trigger: React.ReactNode;
}

export function CreateProductCard({ trigger }: CreateProductCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Add a new product to your catalog.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 py-4">
          {/* Ürün Adı */}
          <div className="grid gap-1">
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              name="name"
              placeholder="e.g. Fancy Lamp"
              required
            />
          </div>

          {/* Açıklama */}
          <div className="grid gap-1">
            <Label htmlFor="product-description">Description</Label>
            <Textarea
              id="product-description"
              name="description"
              placeholder="Describe your product"
              rows={4}
              required
            />
          </div>

          {/* Fiyat ve Stok */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label htmlFor="product-price">Price ($)</Label>
              <Input
                id="product-price"
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="product-stock">Stock Quantity</Label>
              <Input
                id="product-stock"
                name="stock"
                type="number"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Kategori */}
          <div className="grid gap-1">
            <Label htmlFor="product-category">Category</Label>
            <Input
              id="product-category"
              name="category"
              placeholder="e.g. Home Decor"
            />
          </div>

          {/* Görsel URL */}
          <div className="grid gap-1">
            <Label htmlFor="product-image">Image URL</Label>
            <Input
              id="product-image"
              name="image"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </form>

        <DialogFooter className="space-x-2">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
