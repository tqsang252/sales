# AI Sales Radar — MVP

A modern, responsive SaaS Dashboard and Sales Feed to monitor, filter, and track sales posts from Facebook, TikTok, Instagram, and other social channels.

## 🚀 Features (MVP Scope)

- **Modern SaaS Dashboard:**
  - 4 Key Metrics: Total Posts, Posts Today, Posts This Week, Favorites.
  - Interactive Visualizations: Posts by Platform and Posts by Category (using Recharts).
  - Recent Sales Posts table/list with direct preview and one-click navigation.
- **Sales Feed:**
  - Live Multi-Field Search (Product, Content, Author, Location) with 400ms debounce.
  - Comprehensive Filters: Platform (Facebook, TikTok, Instagram, Other), Category, Condition (New, Used, Refurbished), Price Range (Min/Max USD), Date Range, and Sorting.
  - Card View & Compact List View toggle.
  - Server-side range pagination (20, 50, 100 items per page).
  - Browser-persistent Favorites system (`localStorage`).
  - Robust UI states: Loading skeletons, Empty state, No Search Results, and Error/Retry fallbacks.
- **Supabase Integration:**
  - Direct `@supabase/supabase-js` data service layer.
  - Full Row Level Security (RLS) policies.
  - Automatic fallback to rich Mock Data when Supabase keys are not yet configured.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 6, Tailwind CSS 3
- **Routing:** React Router 7
- **Icons:** Lucide React
- **Charts:** Recharts
- **Date Handling:** Date-fns (aligned with client browser timezone)
- **Database:** Supabase PostgreSQL

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase (Optional for Live DB)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Supabase Project URL and Anon Key:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
*(Note: If left empty, the application runs automatically in Mock Data Mode with 14+ realistic sample listings).*

### 3. Run Supabase Database Migration
Open your **Supabase Dashboard** -> **SQL Editor** and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
This script will:
1. Create `sources`, `categories`, and `sales_posts` tables.
2. Enable Row Level Security (RLS) with public read policies.
3. Create optimized B-tree indexes for fast filtering, pagination, and sorting.
4. Insert initial seed data (Categories, Sources, and realistic Posts).

### 4. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🏗️ Project Structure

```text
├── src/
│   ├── components/
│   │   ├── common/         # PlatformBadge, LoadingState, EmptyState, ErrorState
│   │   ├── dashboard/      # StatCard, PostsByPlatformChart, PostsByCategoryChart, RecentPosts
│   │   ├── layout/         # AppLayout, Sidebar, Header, PageHeader
│   │   └── sales/          # SalesCard, SalesListRow, SalesFilters, SalesSearch, SalesPagination, ViewToggle
│   ├── hooks/              # useSalesPosts, useDashboardStats, useFavorites
│   ├── mocks/              # salesPosts.js (Rich mock data fallback)
│   ├── pages/              # DashboardPage, SalesFeedPage
│   ├── services/           # supabaseClient, salesService, dashboardService, favoritesService
│   ├── utils/              # formatCurrency, formatDate, constants
│   ├── App.jsx             # React Router routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind directives
├── supabase/
│   └── schema.sql          # PostgreSQL DDL, RLS policies, and Seed Data
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```
