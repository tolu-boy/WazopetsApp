# WazoPets Admin Dashboard

Admin panel for managing WazoPets e-commerce platform. Create, edit, and manage products, categories, and view orders.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

The admin app shares the same Convex deployment as the main app, so use the same credentials.

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser (or next available port).

---

## 📋 Features

- ✅ **Product Management** - Create, read, update, delete products
- ✅ **Category Management** - Organize products into categories
- ✅ **Image Upload** - Upload product images to Convex storage
- ✅ **Order Viewing** - See all orders and their status
- ✅ **Inventory Management** - Update stock status
- ✅ **Price Management** - Set selling and vendor prices
- ✅ **Search & Filter** - Find products quickly

---

## 🏗️ Admin Features

### **Products Page**
- View all products in a data table
- Add new products with images
- Edit product details
- Delete products
- Filter by category
- Search by name

### **Categories Page**
- Create new categories
- Edit category info
- Delete categories
- View products in each category

### **Orders Page**
- View all customer orders
- Check order status
- See order items and totals
- Track payment status

---

## 🔐 Access Control

The admin dashboard is protected:
1. Login required (Clerk)
2. Only admins can access (configured in Clerk roles)
3. Uses same authentication as main app

To make a user an admin:
1. In Clerk Dashboard
2. Go to Users
3. Select user
4. Add custom metadata: `{ "role": "admin" }`

Or configure in Convex to check organization/permissions.

---

## 📁 Project Structure

```
wazopets-admin/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── products/             # Product management
│   │   │   ├── categories/           # Category management
│   │   │   └── orders/               # Order viewing
│   │   ├── layout.tsx
│   │   └── ConvexClientProvider.tsx
│   ├── components/
│   │   ├── app-sidebar.tsx           # Navigation sidebar
│   │   ├── data-table.tsx            # Reusable data table
│   │   ├── products/                 # Product components
│   │   └── ui/                       # shadcn/ui components
│   └── lib/
│       ├── convex-api.ts             # Convex API reference
│       └── utils.ts
├── public/
└── next.config.ts
```

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **UI:** Tailwind CSS, shadcn/ui, Radix UI
- **Backend:** Convex (shared with main app)
- **Auth:** Clerk
- **Data Table:** TanStack React Table

---

## 📦 Key Scripts

```bash
# Development
pnpm dev              # Start dev server

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
```

---

## 🔄 Syncing with Main App

The admin app uses the same Convex deployment as the main app:

1. **Environment Variables:** Uses shared Convex credentials
2. **Database:** Reads/writes to same database as main app
3. **Real-time Updates:** Changes immediately visible on main app
4. **API Functions:** Calls same Convex backend functions

**Before building/deploying:**
```bash
pnpm prebuild  # Copies latest Convex API types from main app
```

---

## 🚢 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Create new Vercel project pointing to `wazopets-admin` folder
3. Add same environment variables as main app
4. Set root directory to `wazopets-admin/`

```bash
# In Vercel Dashboard
Root Directory: wazopets-admin
```

---

## 🚨 Troubleshooting

### **Convex API files not found**
```bash
# Run this in wazopets folder first
npx convex dev

# Then in admin folder
pnpm prebuild
pnpm dev
```

### **Can't connect to Convex**
- Check `NEXT_PUBLIC_CONVEX_URL` matches main app
- Verify `CONVEX_DEPLOYMENT` matches

### **Images not uploading**
- Check Convex file storage is enabled
- Verify storage bucket access in Convex dashboard

---

## 📞 Need Help?

- Check main app README for setup instructions
- Review Convex documentation
- Contact support@wazopets.com

---

**Admin Dashboard v1.0 - Built for WazoPets 🐾**
