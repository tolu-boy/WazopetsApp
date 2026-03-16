"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convex-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CategoryDoc = {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  bannerImage?: string;
  createdAt?: string;
};

function normalizeOptional(value: string) {
  const v = value.trim();
  return v ? v : undefined;
}

export default function Page() {
  const categories = useQuery(api.functions.categories.getCategories, {});

  const createCategory = useMutation(api.functions.categories.createCategory);
  const updateCategory = useMutation(api.functions.categories.updateCategory);
  const deleteCategory = useMutation(api.functions.categories.deleteCategory);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [createForm, setCreateForm] = React.useState({
    name: "",
    description: "",
    icon: "",
    bannerImage: "",
  });

  const [editCategory, setEditCategory] = React.useState<CategoryDoc | null>(
    null,
  );
  const [editForm, setEditForm] = React.useState({
    name: "",
    description: "",
    icon: "",
    bannerImage: "",
  });

  const openEdit = (cat: CategoryDoc) => {
    setError(null);
    setEditCategory(cat);
    setEditForm({
      name: cat.name ?? "",
      description: cat.description ?? "",
      icon: cat.icon ?? "",
      bannerImage: cat.bannerImage ?? "",
    });
    setEditOpen(true);
  };

  const handleCreate = async () => {
    setError(null);
    const name = createForm.name.trim();
    if (!name) {
      setError("Category name is required.");
      return;
    }

    setBusy(true);
    try {
      await createCategory({
        name,
        description: normalizeOptional(createForm.description),
        icon: normalizeOptional(createForm.icon),
        bannerImage: normalizeOptional(createForm.bannerImage),
      });
      setCreateOpen(false);
      setCreateForm({ name: "", description: "", icon: "", bannerImage: "" });
    } catch (e: any) {
      setError(e?.message ?? "Failed to create category.");
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async () => {
    if (!editCategory) return;
    setError(null);
    const name = editForm.name.trim();
    if (!name) {
      setError("Category name is required.");
      return;
    }

    setBusy(true);
    try {
      await updateCategory({
        id: editCategory._id as any,
        name,
        description: normalizeOptional(editForm.description),
        icon: normalizeOptional(editForm.icon),
        bannerImage: normalizeOptional(editForm.bannerImage),
      });
      setEditOpen(false);
      setEditCategory(null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to update category.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (cat: CategoryDoc) => {
    setError(null);
    const ok = confirm(
      `Delete category "${cat.name}"? This cannot be undone.`,
    );
    if (!ok) return;

    setBusy(true);
    try {
      await deleteCategory({ id: cat._id as any });
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete category.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => (setError(null), setCreateOpen(true))}>
          + Add Category
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All categories</CardTitle>
        </CardHeader>
        <CardContent>
          {!categories && <p className="text-sm text-muted-foreground">Loading…</p>}
          {categories && categories.length === 0 && (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          )}

          {categories && categories.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Banner</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat: any) => (
                  <TableRow key={cat._id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell className="max-w-[420px] truncate">
                      {cat.description ?? "—"}
                    </TableCell>
                    <TableCell>{cat.icon ?? "—"}</TableCell>
                    <TableCell className="max-w-[320px] truncate">
                      {cat.bannerImage ?? "—"}
                    </TableCell>
                    <TableCell>
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(cat)}
                          disabled={busy}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(cat)}
                          disabled={busy}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Name</Label>
              <Input
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="mb-2 block">Description</Label>
              <Input
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label className="mb-2 block">Icon</Label>
              <Input
                value={createForm.icon}
                onChange={(e) =>
                  setCreateForm({ ...createForm, icon: e.target.value })
                }
                placeholder="Optional (emoji or icon name)"
              />
            </div>
            <div>
              <Label className="mb-2 block">Banner image URL</Label>
              <Input
                value={createForm.bannerImage}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    bannerImage: e.target.value,
                  })
                }
                placeholder="Optional"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={busy}>
                {busy ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog
        open={editOpen}
        onOpenChange={(o) => (setEditOpen(o), o ? null : setEditCategory(null))}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
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
              <Label className="mb-2 block">Icon</Label>
              <Input
                value={editForm.icon}
                onChange={(e) =>
                  setEditForm({ ...editForm, icon: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="mb-2 block">Banner image URL</Label>
              <Input
                value={editForm.bannerImage}
                onChange={(e) =>
                  setEditForm({ ...editForm, bannerImage: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={busy}>
                {busy ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

