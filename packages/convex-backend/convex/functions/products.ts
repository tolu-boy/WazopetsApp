import { query,mutation } from "../_generated/server";
import { v } from "convex/values";
// import { Id } from "../_generated/dataModel";
import { Doc, Id } from "../_generated/dataModel";

// convex/products.ts
export const getProductsInStock = query({
  // -------------------------------------------
  // 1️⃣ Define the accepted arguments
  // -------------------------------------------
  args: {
    categoryId: v.optional(v.id("categories")),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    sortBy: v.optional(v.string()),
    limit: v.optional(v.number()),
  },

  // -------------------------------------------
  // 2️⃣ Query handler
  // -------------------------------------------
  handler: async (ctx, args) => {
    // Final number of products we want to return
    const limit = args.limit ?? 20;

    let products: any[] = [];

    // -------------------------------------------
    // 3️⃣ STEP 1 — FETCH ALL in-stock products
    // ❗ NO limiting here
    // ❗ No sorting here
    // ❗ Just get the full candidate set
    // -------------------------------------------
    if (args.categoryId !== undefined) {
      products = await ctx.db
        .query("products")
        .withIndex("by_category_inStock", (q) =>
          q
            .eq("categoryId", args.categoryId!)
            .eq("inStock", true),
        )
        .collect(); // ✅ get ALL matching rows
    } else {
      products = await ctx.db
        .query("products")
        .withIndex("by_inStock", (q) =>
          q.eq("inStock", true),
        )
        .collect(); // ✅ get ALL matching rows
    }

    // -------------------------------------------
    // 4️⃣ STEP 2 — FILTER by price (defensively)
    // Only apply filters when they actually mean something
    // -------------------------------------------

    if (args.minPrice !== undefined && args.minPrice > 0) {
      products = products.filter(
        (p) => p.price >= args.minPrice!,
      );
    }

    if (args.maxPrice !== undefined && args.maxPrice > 0) {
      products = products.filter(
        (p) => p.price <= args.maxPrice!,
      );
    }

    // -------------------------------------------
    // 5️⃣ STEP 3 — SORT the remaining products
    // Sorting happens AFTER filtering
    // -------------------------------------------
    switch (args.sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;

      case "newest":
        default: // 👈 THIS makes newest the default
        products.sort(
          (a, b) =>
            (b.createdAt
              ? new Date(b.createdAt).getTime()
              : b._creationTime) -
            (a.createdAt
              ? new Date(a.createdAt).getTime()
              : a._creationTime),
        );
        break;
    }

    // -------------------------------------------
    // 6️⃣ STEP 4 — APPLY LIMIT LAST
    // This is the ONLY place we limit results
    // -------------------------------------------
    return products.slice(0, limit);
  },
});



export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    return categories;
  },
});

// ✅ Existing code above...
export const getProductById = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) console.log("Product not found");
    return product;
  },
});


export function expandTerms(word: string): string[] {
  const w = word.toLowerCase().trim();
  if (!w) return [];

  // simple plural logic
  if (w.endsWith("s")) return [w, w.slice(0, -1)];
  return [w, `${w}s`];
}

export function normalizeSearchText(
  ...parts: (string | undefined)[]
): string {
  return parts
    .filter(Boolean)
    .flatMap((p) =>
      p!
        .toLowerCase()
        .split(/\s+/)
        .flatMap(expandTerms)
    )
    .join(" ");
}


export const searchProducts = query({
  args: {
    searchTerm: v.string(),
    categoryId: v.optional(v.id("categories")),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    sortBy: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const {
      searchTerm,
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      limit = 20,
    } = args;

    if (!searchTerm.trim()) return [];

    const queryBuilder = ctx.db
      .query("products")
      .withSearchIndex("search_products", (q) => {
        let qb = q
          .search("searchText", searchTerm.toLowerCase())
          .eq("inStock", true);

        if (categoryId) qb = qb.eq("categoryId", categoryId);
        return qb;
      });

    let results = await queryBuilder.take(100);

    // Price filters
    if (minPrice !== undefined)
      results = results.filter((p) => p.price >= minPrice);
    if (maxPrice !== undefined)
      results = results.filter((p) => p.price <= maxPrice);

    // Sorting
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        results.sort(
          (a, b) =>
            new Date(b.createdAt ?? b._creationTime).getTime() -
            new Date(a.createdAt ?? a._creationTime).getTime(),
        );
        break;
    }

    return results.slice(0, limit);
  },
});



export const backfillProductSearchText = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();

    for (const p of products) {
      const searchText = normalizeSearchText(
        p.name,
        p.description,
        p.petType,
        p.badge,
      );

      await ctx.db.patch(p._id, { searchText });
    }

    return { updated: products.length };
  },
});



export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    vendorPrice: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    imageFileIds: v.array(v.id("_storage")), // 🔥 multiple files
    inStock: v.boolean(),
    categoryId: v.id("categories"),
    petType: v.optional(v.string()),
    badge: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    // 🔥 Convert storage IDs → URLs
    const urls = (
      await Promise.all(
        args.imageFileIds.map((id) => ctx.storage.getUrl(id))
      )
    ).filter(Boolean) as string[];

    if (urls.length === 0) {
      throw new Error("At least one image is required");
    }

    const searchText = normalizeSearchText(
      args.name,
      args.description,
      args.petType,
      args.badge
    );

    return await ctx.db.insert("products", {
      name: args.name,
      description: args.description,
      price: args.price,
      vendorPrice: args.vendorPrice,
      originalPrice: args.originalPrice,
      image: urls[0],          // ✅ FIRST image
      imageUrls: urls,         // ✅ FIRST + REST
      inStock: args.inStock,
      categoryId: args.categoryId,
      petType: args.petType,
      badge: args.badge,
      searchText,
      createdAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    petType: v.optional(v.string()),
    badge: v.optional(v.string()),
    price: v.optional(v.number()),
    vendorPrice: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    categoryId: v.optional(v.id("categories")),
    inStock: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");

    const searchText = normalizeSearchText(
      args.name ?? product.name,
      args.description ?? product.description,
      args.petType ?? product.petType,
      args.badge ?? product.badge
    );

    const patch: Partial<Doc<"products">> = { searchText };
    if (args.name !== undefined) patch.name = args.name;
    if (args.description !== undefined) patch.description = args.description;
    if (args.petType !== undefined) patch.petType = args.petType;
    if (args.badge !== undefined) patch.badge = args.badge;
    if (args.price !== undefined) patch.price = args.price;
    if (args.vendorPrice !== undefined) patch.vendorPrice = args.vendorPrice;
    if (args.originalPrice !== undefined) patch.originalPrice = args.originalPrice;
    if (args.categoryId !== undefined) patch.categoryId = args.categoryId;
    if (args.inStock !== undefined) patch.inStock = args.inStock;

    await ctx.db.patch(args.id, patch);
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id);
    if (!existing) return;

    const cartRefs = (await ctx.db.query("cartItems").collect()).filter(
      (item) => item.productId === id,
    );

    for (const cartItem of cartRefs) {
      await ctx.db.delete(cartItem._id);
    }

    await ctx.db.delete(id);
  },
});


export const getAllProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});