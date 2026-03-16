

"use client";

import * as React from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convex-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreateProductModal } from "@/components/products/CreateProductModal";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductDoc = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  vendorPrice?: number;
  originalPrice?: number;
  inStock: boolean;
  categoryId: string;
  badge?: string;
  petType?: string;
  image?: string;
  imageUrls?: string[];
  createdAt?: string;
  categoryName?: string;
};

function numberOrUndefined(value: string) {
  const cleaned = value.trim();
  return cleaned ? Number(cleaned) : undefined;
}

function stringOrUndefined(value: string) {
  const cleaned = value.trim();
  return cleaned ? cleaned : undefined;
}

export default function Page() {
  const products = useQuery(api.functions.products.getProductsInStock, {});
  const categories = useQuery(api.functions.categories.getCategories, {});
  const updateProduct = useMutation(api.functions.products.update);
  const deleteProduct = useMutation(api.functions.products.deleteProduct);

  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ProductDoc | null>(null);
  const [editForm, setEditForm] = React.useState({
    name: "",
    description: "",
    price: "",
    vendorPrice: "",
    originalPrice: "",
    inStock: true,
    badge: "",
    petType: "",
    categoryId: "",
  });

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    return products.filter((p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const openEdit = (product: ProductDoc) => {
    setError(null);
    setEditing(product);
    setEditForm({
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price?.toString() ?? "",
      vendorPrice: product.vendorPrice?.toString() ?? "",
      originalPrice: product.originalPrice?.toString() ?? "",
      inStock: product.inStock ?? true,
      badge: product.badge ?? "",
      petType: product.petType ?? "",
      categoryId: product.categoryId ?? "",
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setError(null);

    const name = editForm.name.trim();
    const price = Number(editForm.price);
    if (!name) {
      setError("Product name is required.");
      return;
    }
    if (!editForm.categoryId) {
      setError("Category is required.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid price.");
      return;
    }

    setBusy(true);
    try {
      await updateProduct({
        id: editing._id as any,
        name,
        description: stringOrUndefined(editForm.description),
        price,
        vendorPrice: numberOrUndefined(editForm.vendorPrice),
        originalPrice: numberOrUndefined(editForm.originalPrice),
        inStock: editForm.inStock,
        badge: stringOrUndefined(editForm.badge),
        petType: stringOrUndefined(editForm.petType),
        categoryId: editForm.categoryId as any,
      });
      setEditOpen(false);
      setEditing(null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to update product.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (product: ProductDoc) => {
    setError(null);
    const ok = confirm(`Delete product "${product.name}"? This cannot be undone.`);
    if (!ok) return;

    setBusy(true);
    try {
      await deleteProduct({ id: product._id as any });
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete product.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>

        <Button onClick={() => setOpen(true)}>
          + Add Product
        </Button>
      </div>

      <CreateProductModal open={open} onOpenChange={setOpen} />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Search */}
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Loading */}
      {!products && <p>Loading products...</p>}

      {/* Empty */}
      {products && filteredProducts.length === 0 && (
        <p className="text-muted-foreground">No products found.</p>
      )}

      {/* Products List */}
      <div className="grid gap-4">
        {filteredProducts.map((product: any) => {
          const imageSrc =
            product.image || product.imageUrls?.[0] || "/placeholder.png";

          return (
            <div key={product._id} className="flex gap-4 rounded-lg border p-4">
              {/* Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{product.name}</h2>

                  {product.badge && (
                    <Badge variant="secondary">{product.badge}</Badge>
                  )}

                  {!product.inStock && (
                    <Badge variant="destructive">Out of stock</Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  ₦{product.price.toLocaleString()}
                </p>
                {product.vendorPrice !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    Vendor: ₦{product.vendorPrice.toLocaleString()}
                  </p>
                )}

                <p className="text-sm">
                  Category:{" "}
                  <span className="font-medium">
                    {product.categoryName ?? "—"}
                  </span>
                  {product.petType && (
                    <>
                      {" "}
                      · Pet:{" "}
                      <span className="font-medium">{product.petType}</span>
                    </>
                  )}
                </p>

                {product.createdAt && (
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(product)}
                  disabled={busy}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(product)}
                  disabled={busy}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditing(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label className="mb-2 block">Description</Label>
              <Input
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label className="mb-2 block">Price (₦)</Label>
              <Input
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
              />
            </div>

            <div>
              <Label className="mb-2 block">Vendor Price (₦)</Label>
              <Input
                type="number"
                value={editForm.vendorPrice}
                onChange={(e) =>
                  setEditForm({ ...editForm, vendorPrice: e.target.value })
                }
                placeholder="Optional"
              />
            </div>

            <div>
              <Label className="mb-2 block">Original Price (₦)</Label>
              <Input
                type="number"
                value={editForm.originalPrice}
                onChange={(e) =>
                  setEditForm({ ...editForm, originalPrice: e.target.value })
                }
                placeholder="Optional"
              />
            </div>

            <div>
              <Label className="mb-2 block">Category</Label>
              <Select
                value={editForm.categoryId}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, categoryId: value })
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

            <div>
              <Label className="mb-2 block">Pet Type</Label>
              <Input
                value={editForm.petType}
                onChange={(e) =>
                  setEditForm({ ...editForm, petType: e.target.value })
                }
                placeholder="Optional"
              />
            </div>

            <div>
              <Label className="mb-2 block">Badge</Label>
              <Select
                value={editForm.badge || "none"}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, badge: value === "none" ? "" : value })
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
                id="edit-in-stock"
                checked={editForm.inStock}
                onCheckedChange={(checked) =>
                  setEditForm({ ...editForm, inStock: checked === true })
                }
              />
              <Label htmlFor="edit-in-stock">In stock</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditOpen(false);
                  setEditing(null);
                }}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={busy}>
                {busy ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
