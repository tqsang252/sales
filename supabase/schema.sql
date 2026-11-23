-- ==============================================================================
-- AI Sales Radar - Supabase Database Schema & Seed Data
-- ==============================================================================
-- Run this script in your Supabase Dashboard -> SQL Editor to initialize the database.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CREATE TABLE: sources
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'tiktok', 'instagram', 'other')),
    source_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE TABLE: categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE TABLE: sales_posts
CREATE TABLE IF NOT EXISTS sales_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    external_post_id TEXT,
    original_url TEXT NOT NULL,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    product_name TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    price NUMERIC(12, 2),
    currency TEXT DEFAULT 'USD',
    location TEXT,
    condition TEXT DEFAULT 'unknown' CHECK (condition IN ('new', 'used', 'refurbished', 'unknown')),
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_sales_posts_published_at ON sales_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_posts_source_id ON sales_posts(source_id);
CREATE INDEX IF NOT EXISTS idx_sales_posts_category_id ON sales_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_sales_posts_price ON sales_posts(price);
CREATE INDEX IF NOT EXISTS idx_sales_posts_condition ON sales_posts(condition);
CREATE INDEX IF NOT EXISTS idx_sales_posts_external_id ON sales_posts(external_post_id);

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_posts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access for public data
CREATE POLICY "Allow public read access on sources" ON sources
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on sales_posts" ON sales_posts
    FOR SELECT USING (true);

-- 7. SEED DATA (Demo Sources, Categories, and Posts)
DO $$
DECLARE
    src_fb UUID := gen_random_uuid();
    src_tt UUID := gen_random_uuid();
    src_ig UUID := gen_random_uuid();
    src_ot UUID := gen_random_uuid();

    cat_elec UUID := gen_random_uuid();
    cat_furn UUID := gen_random_uuid();
    cat_fash UUID := gen_random_uuid();
    cat_auto UUID := gen_random_uuid();
    cat_spor UUID := gen_random_uuid();
BEGIN
    -- Check if data already exists
    IF NOT EXISTS (SELECT 1 FROM sources LIMIT 1) THEN
        -- Insert Sources
        INSERT INTO sources (id, name, platform, source_url) VALUES
        (src_fb, 'FB Marketplace Houston Deals', 'facebook', 'https://facebook.com/marketplace'),
        (src_tt, 'TikTok Tech Finds', 'tiktok', 'https://tiktok.com'),
        (src_ig, 'InstaStyle Thrift & Vintage', 'instagram', 'https://instagram.com'),
        (src_ot, 'Local Gear Classifieds', 'other', 'https://craigslist.org');

        -- Insert Categories
        INSERT INTO categories (id, name, slug) VALUES
        (cat_elec, 'Electronics', 'electronics'),
        (cat_furn, 'Furniture & Home', 'furniture-home'),
        (cat_fash, 'Fashion & Apparel', 'fashion-apparel'),
        (cat_auto, 'Vehicles & Automotive', 'vehicles-automotive'),
        (cat_spor, 'Sports & Outdoors', 'sports-outdoors');

        -- Insert Sales Posts
        INSERT INTO sales_posts (
            source_id, external_post_id, original_url, author_name, product_name,
            content, image_url, category_id, price, currency, location, condition, published_at
        ) VALUES
        (
            src_fb, 'fb_amy_1', 'https://facebook.com/groups/deals/posts/amy', 'Amy Rose',
            NULL,
            'What time do people line up on Friday? Specifically Lowes and Target. Trying to catch the appliance doorbusters before they sell out!',
            NULL,
            NULL, NULL, 'USD', 'Houston, TX', 'unknown', NOW() - INTERVAL '1 hour'
        ),
        (
            src_fb, 'fb_101', 'https://facebook.com/marketplace/item/101', 'Alex Johnson',
            'Apple MacBook Pro M2 14" (16GB/512GB)',
            'Selling my gently used MacBook Pro M2 Space Gray. Battery health at 98%. Comes with original 67W charger and box. No scratches or dents. Local cash or Venmo only.',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
            cat_elec, 1250.00, 'USD', 'Houston, TX', 'used', NOW() - INTERVAL '2 hours'
        ),
        (
            src_tt, 'tt_202', 'https://tiktok.com/@techshop/video/202', 'GadgetStore Official',
            'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
            'Brand new sealed in box! Industry leading noise canceling with 2 processors and 8 microphones. 30 hours battery life. Limited stock available.',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            cat_elec, 329.99, 'USD', 'Los Angeles, CA', 'new', NOW() - INTERVAL '5 hours'
        ),
        (
            src_fb, 'fb_103', 'https://facebook.com/marketplace/item/103', 'Marcus Vance',
            'Solid Oak Mid-Century Coffee Table',
            'Authentic 1960s restored oak coffee table with tempered glass top inset. Beautiful wood grain and tapered peg legs. Dimensions: 48x24x18 inches. Moving out sale.',
            'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80',
            cat_furn, 185.00, 'USD', 'Austin, TX', 'used', NOW() - INTERVAL '8 hours'
        ),
        (
            src_ig, 'ig_301', 'https://instagram.com/p/301', 'VintageThreads_NYC',
            'Vintage 90s Carhartt Detroit Jacket J97',
            'Rare faded brown distressed work jacket with blanket lining and corduroy collar. Size Large. Perfect vintage condition with authentic fade.',
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
            cat_fash, 210.00, 'USD', 'Brooklyn, NY', 'used', NOW() - INTERVAL '1 day'
        ),
        (
            src_ot, 'ot_401', 'https://craigslist.org/bik/401', 'Dave Miller',
            'Trek Domane AL 2 Disc Road Bike (54cm)',
            'Excellent entry-level endurance road bike. Shimano Claris drivetrain, mechanical disc brakes. Tuned up last month with new Continental Grand Prix tires.',
            'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
            cat_spor, 650.00, 'USD', 'Denver, CO', 'used', NOW() - INTERVAL '1 day 4 hours'
        ),
        (
            src_fb, 'fb_104', 'https://facebook.com/marketplace/item/104', 'Sarah Chen',
            'Nespresso VertuoPlus Coffee & Espresso Machine',
            'Works like new, descaled regularly. Includes milk frother and about 20 assorted coffee pods. Great morning espresso maker!',
            'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
            cat_furn, 85.00, 'USD', 'Dallas, TX', 'used', NOW() - INTERVAL '2 days'
        ),
        (
            src_tt, 'tt_203', 'https://tiktok.com/@fitgear/video/203', 'Apex Fitness',
            'Adjustable Dumbbells Set (5-52.5 lbs)',
            'Rapid weight adjustment with ergonomic grips. Perfect for small apartments and home gyms. Heavy duty rack stand included.',
            'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
            cat_spor, 249.00, 'USD', 'Chicago, IL', 'refurbished', NOW() - INTERVAL '3 days'
        ),
        (
            src_fb, 'fb_105', 'https://facebook.com/marketplace/item/105', 'Robert Taylor',
            '2018 Honda Civic EX - Low Mileage',
            'One owner, clean title, garage kept. 45,000 miles. Apple CarPlay, sunroof, backup camera. Regular synthetic oil changes at Honda dealership.',
            'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
            cat_auto, 16800.00, 'USD', 'San Antonio, TX', 'used', NOW() - INTERVAL '3 days 12 hours'
        ),
        (
            src_fb, 'fb_106', 'https://facebook.com/marketplace/item/106', 'Emily White',
            'Free Moving Boxes and Bubble Wrap',
            'Just unpacked after moving. About 30 sturdy medium and large boxes plus packing paper and bubble wrap. Free to whoever can pick up today!',
            NULL,
            cat_furn, NULL, 'USD', 'Plano, TX', 'used', NOW() - INTERVAL '4 days'
        ),
        (
            src_tt, 'tt_204', 'https://tiktok.com/@audiocave/video/204', 'StudioVibe',
            'Shure SM7B Cardioid Dynamic Vocal Microphone',
            'Industry standard podcast and broadcast microphone. Pristine audio capture with built-in pop filter and shock isolation.',
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
            cat_elec, 340.00, 'USD', 'Seattle, WA', 'new', NOW() - INTERVAL '5 days'
        ),
        (
            src_ig, 'ig_302', 'https://instagram.com/p/302', 'SneakerVault_TX',
            'Nike Air Jordan 1 Retro High OG "Chicago"',
            'Deadstock condition (never worn). Size 10.5 US. Comes with extra red and white laces and original box with receipt.',
            'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
            cat_fash, 420.00, 'USD', 'Houston, TX', 'new', NOW() - INTERVAL '6 days'
        ),
        (
            src_ot, 'ot_402', 'https://craigslist.org/sys/402', 'GeekGarage',
            'Custom Gaming PC (RTX 4070 Super / Ryzen 7 7800X3D)',
            'Custom built gaming rig: 32GB DDR5 6000MHz RAM, 2TB NVMe SSD, Corsair 750W Gold PSU. Clean cable management, stress tested and ready for 1440p / 4K gaming.',
            'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
            cat_elec, 1499.00, 'USD', 'Portland, OR', 'new', NOW() - INTERVAL '12 days'
        );
    END IF;
END $$;
