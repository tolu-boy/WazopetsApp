"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convex-api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateProductModal({ open, onOpenChange }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);

  const categories = useQuery(api.functions.categories.getCategories, {});

  const [form, setForm] = React.useState({
    name: "",
    description: "",
    price: "",
    vendorPrice: "",
    originalPrice: "",
    inStock: true,
    badge: "",
    image: "",
    imageUrls: "",
    categoryId: "",
  });

  const generateUploadUrl = useMutation(
    api.functions.upload.generateUploadUrl
  );
  
  const createProduct = useMutation(
    api.functions.products.createProduct
  );
  
  const handleSubmit = async () => {
    if (files.length === 0) return;
    if (!form.categoryId) return;
  
    setLoading(true);
    try {
      // 1️⃣ Upload all files
      const storageIds: string[] = [];
  
      for (const file of files) {
        const uploadUrl = await generateUploadUrl();
  
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
  
        const { storageId } = await res.json();
        storageIds.push(storageId);
      }
  
      // 2️⃣ Create product using uploaded images
      await createProduct({
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        vendorPrice: form.vendorPrice ? Number(form.vendorPrice) : undefined,
        originalPrice: form.originalPrice
          ? Number(form.originalPrice)
          : undefined,
        imageFileIds: storageIds,
        inStock: form.inStock,
        badge: form.badge || undefined,
        categoryId: form.categoryId as any,
      });
  
      onOpenChange(false);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Name</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div>
            <Label className="mb-2 block">Description</Label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <Label className="mb-2 block">Price (₦)</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />
          </div>

          <div>
            <Label className="mb-2 block">Original Price (₦)</Label>
            <Input
              type="number"
              value={form.originalPrice}
              onChange={(e) =>
                setForm({ ...form, originalPrice: e.target.value })
              }
              placeholder="Optional"
            />
          </div>

          <div>
            <Label className="mb-2 block">Vendor Price (₦)</Label>
            <Input
              type="number"
              value={form.vendorPrice}
              onChange={(e) =>
                setForm({ ...form, vendorPrice: e.target.value })
              }
              placeholder="Optional"
            />
          </div>

          <div>
            <Label className="mb-2 block">Badge</Label>
            <Select
              value={form.badge || "none"}
              onValueChange={(value) =>
                setForm({ ...form, badge: value === "none" ? "" : value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select badge (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No badge</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Sale">Sale</SelectItem>
                <SelectItem value="Best Seller">Best Seller</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="in-stock"
              checked={form.inStock}
              onCheckedChange={(checked) =>
                setForm({ ...form, inStock: checked === true })
              }
            />
            <Label htmlFor="in-stock">In stock</Label>
          </div>


          <div>
            <Label className="mb-2 block">Product Images</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setFiles(Array.from(e.target.files));
                }
              }}
            />
          </div>

          <div>
            <Label className="mb-2 block">Category</Label>
            <Select
              value={form.categoryId}
              onValueChange={(value) =>
                setForm({ ...form, categoryId: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    categories
                      ? categories.length > 0
                        ? "Select a category"
                        : "No categories found"
                      : "Loading categories..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {(categories ?? []).map((cat: any) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
