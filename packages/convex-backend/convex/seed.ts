import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// --- Define your sample data here ---
const categories = [
  { name: "Dog Food", description: "Nutritious meals for dogs" },
  { name: "Cat Food", description: "Healthy food for cats" },
  { name: "Toys", description: "Fun toys for pets" },
  { name: "Accessories", description: "Collars, leashes, etc." },
  { name: "Health", description: "Grooming and healthcare items" },
  { name: "Birds", description: "Cages and bird supplies" },
];

const products = [
  {
    name: "Royal Canin Adult Dog Food 15kg Premium",
    price: 25000,
    originalPrice: 30000,
    image:
      "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=300&fit=crop",
    imageUrls: [
      "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&h=600&fit=crop",
    ],
    inStock: true,
    category: "Dog Food",
    petType: "dog",
    badge: "Best Seller",
  },
  {
    name: "Interactive Cat Toy Feather Wand Premium",
    price: 8500,
    image:
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop",
    imageUrls: [
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&h=600&fit=crop",
    ],
    inStock: true,
    category: "Toys",
    petType: "cat",
    badge: "New",
  },
  {
    name: "Premium Leather Dog Collar Adjustable",
    price: 12000,
    originalPrice: 15000,
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
    imageUrls: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop",
    ],
    inStock: true,
    category: "Accessories",
    petType: "dog",
    badge: "Sale",
  },
  {
    name: "Whiskas Cat Food Variety Pack 12x85g",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop",
    imageUrls: [
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&h=600&fit=crop",
    ],
    inStock: true,
    category: "Cat Food",
    petType: "cat",
  },
  {
    name: "Professional Pet Grooming Kit Complete",
    price: 35000,
    originalPrice: 42000,
    image:
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=300&fit=crop",
    imageUrls: [
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&h=600&fit=crop",
    ],
    inStock: false,
    category: "Health",
    petType: "dog",
    badge: "Premium",
  },
  {
    name: "Large Bird Cage Deluxe with Accessories",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop",
    imageUrls: [
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop",
    ],
    inStock: true,
    category: "Birds",
    petType: "bird",
  },
];

// --- SEED MUTATION ---
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if categories already exist
    const existingCats = await ctx.db.query("categories").collect();
    if (existingCats.length === 0) {
      console.log("Seeding categories...");
      for (const cat of categories) {
        await ctx.db.insert("categories", {
          name: cat.name,
          description: cat.description,
          createdAt: new Date().toISOString(),
        });
      }
    }

    const allCategories = await ctx.db.query("categories").collect();

    // Map category name -> categoryId
    const categoryMap: Record<string, Id<"categories">> = {};
    for (const c of allCategories) {
      categoryMap[c.name] = c._id;
    }

    const existingProducts = await ctx.db.query("products").collect();
    if (existingProducts.length === 0) {
      console.log("Seeding products...");
      for (const p of products) {
        const categoryId = categoryMap[p.category];
        if (!categoryId) continue;

        await ctx.db.insert("products", {
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          image: p.image,
          imageUrls: p.imageUrls,
          inStock: p.inStock,
          categoryId, // ✅ use the variable we mapped earlier
          petType: p.petType,
          badge: p.badge,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return "✅ Seed completed successfully!";
  },
});
