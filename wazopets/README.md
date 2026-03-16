# WazoPets - Premium Animal Supplies E-Commerce Platform

A modern, full-stack e-commerce platform for premium animal supplies including pets, livestock, poultry, and exotic animals. Built with **Next.js 15**, **Convex**, **Clerk**, and **Paystack**.

## 🌟 Features

- 🛍️ Browse and search products for pets, livestock, poultry, and exotic animals
- 🛒 Shopping cart with persistent storage (guest & authenticated users)
- 💳 Secure payment processing with Paystack
- 👤 Authentication with Clerk
- 📦 Order management and tracking
- 📧 Order confirmation emails
- 📱 Responsive mobile-first design
- ⚡ Real-time data sync with Convex
- 🔐 Secure backend with Convex functions
- 🎨 Modern UI with Tailwind CSS and shadcn/ui

---

## 📋 Prerequisites

Before getting started, ensure you have:

- **Node.js** 18+ installed
- **pnpm** or **yarn** (we use pnpm)
- Accounts for:
  - [Clerk](https://clerk.com) - Authentication
  - [Convex](https://convex.dev) - Backend as a Service
  - [Paystack](https://paystack.com) - Payment Processing
  - [Mailtrap](https://mailtrap.io) or [Resend](https://resend.com) - Email Service

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd wazopets-main/wazopets
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:

```dotenv
# Convex
CONVEX_DEPLOYMENT=dev:your-deployment-id
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=https://your-instance.clerk.accounts.dev

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...

# Email
MAILTRAP_TOKEN=your_token...
```

#### **Getting Your Credentials:**

**Convex:**
1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Create a new project or use existing one
3. Copy the deployment ID and URL

**Clerk:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create an application
3. Copy API keys from "API Keys" section
4. Set up Clerk JWT template in Convex settings

**Paystack:**
1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. Navigate to Settings → API Keys & Webhooks
3. Copy test keys (use test keys for development)

**Mailtrap:**
1. Go to [Mailtrap](https://mailtrap.io)
2. Create an account
3. Get your API token from Settings

### 4. Set Up Convex Webhooks

**For Clerk Webhook:**
1. In Convex Dashboard, go to Settings → HTTP Endpoints
2. Copy your webhook URL (e.g., `https://your-deployment.convex.cloud/api/clerk`)
3. Go to Clerk Dashboard → Webhooks
4. Create webhook pointing to: `https://your-deployment.convex.cloud/clerk-webhook`
5. Subscribe to: `user.created`, `user.updated`, `user.deleted`

**For Paystack Webhook:**
1. Go to Paystack Dashboard → Settings → API Keys & Webhooks
2. Set webhook URL to: `https://your-deployment.convex.cloud/paystack-webhook`
3. Copy webhook signing secret and add to Convex environment

### 5. Seed Initial Data (Optional)

```bash
# Run in Convex dashboard or via CLI
npx convex run seed
```

This will populate your database with sample categories and products.

### 6. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure

```
wazopets/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── checkout/          # Checkout page with payment
│   │   ├── cart/              # Shopping cart
│   │   ├── products/          # Product listing
│   │   ├── orders/            # Order history
│   │   ├── auth/              # Authentication pages
│   │   └── layout.tsx         # Root layout
│   ├── components/             # React components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── ProductGrid.tsx    # Product display
│   │   ├── Cart.tsx           # Cart component
│   │   └── ui/                # shadcn/ui components
│   ├── store/                  # Zustand state management
│   │   ├── useCartStore.ts    # Cart state
│   │   └── useCartSync.ts     # Cart sync logic
│   ├── lib/                    # Utility functions
│   │   ├── formatters.ts      # Currency formatting
│   │   └── utils.ts           # Helper functions
│   └── schema/                 # Validation schemas
├── convex/                      # Backend functions
│   ├── functions/              # Convex queries & mutations
│   │   ├── products.ts        # Product operations
│   │   ├── checkout.ts        # User profile/checkout
│   │   ├── order.ts           # Order operations
│   │   └── payments.ts        # Payment processing
│   ├── actions/                # Server-only actions
│   │   ├── payments.ts        # Paystack verification
│   │   └── emails.ts          # Email sending
│   ├── schema.ts               # Database schema
│   └── auth.config.ts          # Clerk auth config
├── public/                      # Static assets
└── next.config.ts              # Next.js configuration
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **State** | Zustand |
| **Backend** | Convex |
| **Auth** | Clerk |
| **Payments** | Paystack |
| **Email** | Mailtrap |
| **Forms** | React Hook Form, Zod |
| **UI Components** | Radix UI |

---

## 📱 Key Features Explained

### **Product Browsing**
- Search and filter products by category
- Sort by price and relevance
- View detailed product information with multiple images

### **Shopping Cart**
- Add/remove items
- Update quantities
- Persistent storage for guest users
- Auto-sync when user logs in

### **Checkout Process**
1. Fill delivery address
2. Review order summary
3. Enter payment details
4. Paystack payment gateway
5. Confirmation email with order details

### **Order Management**
- View order history
- Track order status
- Download invoices

---

## 🔒 Security Features

- ✅ Secure authentication with Clerk
- ✅ Server-authoritative pricing (client can't tamper with prices)
- ✅ Payment verification with Paystack
- ✅ HTTPS enforced
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Environment variables protected

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel Dashboard
5. Deploy!

```bash
git push origin main
```

### Deploy Admin Dashboard

The `wazopets-admin/` folder contains the admin dashboard. Deploy separately:

```bash
cd wazopets-admin
pnpm build
pnpm start
```

---

## 🌐 Environment Variables for Production

When deploying to production, update these:

```dotenv
# Use production Convex deployment
CONVEX_DEPLOYMENT=prod:your-deployment-id
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud

# Use production Paystack keys (not test keys)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...

# Use production Clerk API keys and domain
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_JWT_ISSUER_DOMAIN=https://your-prod-domain.clerk.accounts.dev
```

---

## 📊 Database Schema

### **Users Table**
- Clerk ID
- Email
- Name
- Checkout fields (phone, address, city, state)

### **Products Table**
- Name, description, price
- Images (multiple URLs)
- Category reference
- Stock status
- Search index

### **Categories Table**
- Name, description
- Banner image

### **Orders Table**
- User reference
- Items list
- Total amount
- Payment status
- Shipping address
- Delivery status

### **Cart Items Table**
- User reference
- Product reference
- Quantity

### **Payments Table**
- Order reference
- Amount, currency
- Payment method
- Status (pending, successful, failed)
- Reference and provider info

---

## 🧪 Testing the App

1. **Guest Checkout:**
   - Add items to cart
   - Go to checkout without login
   - Test payment flow

2. **User Account:**
   - Sign up with Clerk
   - Place order
   - Check order history

3. **Payment Testing:**
   - Use Paystack test cards
   - Test successful and failed payments

**Test Card Numbers:**
- Visa: `4111 1111 1111 1111`, any future date, any 3-digit CVV
- Mastercard: `5531 8866 5440 4956`

---

## 🐛 Troubleshooting

### **"Convex deployment not found"**
- Check `CONVEX_DEPLOYMENT` matches your project
- Run `npx convex dev` to sync

### **"Clerk authentication failed"**
- Ensure `CLERK_JWT_ISSUER_DOMAIN` is correct
- Check Clerk webhook is configured
- Verify JWT template exists in Convex

### **"Payment failed with Paystack"**
- Use test keys for development
- Check webhook URL is public and accessible
- Verify Paystack webhook secret in Convex

### **"Cart not syncing"**
- Check browser localStorage (DevTools → Application)
- Ensure user is authenticated before checkout
- Verify Convex connection in browser console

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Docs](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Paystack Integration Guide](https://paystack.com/docs/payments)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/AmazingFeature`
2. Commit changes: `git commit -m 'Add AmazingFeature'`
3. Push to branch: `git push origin feature/AmazingFeature`
4. Open a Pull Request

---

## 📝 License

This project is proprietary and confidential - WazoPets Nigeria

---

## 📞 Support

For issues or questions:
- Email: support@wazopets.com
- Issues: GitHub Issues
- Discord: [WazoPets Community](link-to-community)

---

**Happy selling! 🐾**
