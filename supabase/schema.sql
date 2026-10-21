-- ========================================================================
-- CakeStory Desserts - Complete Supabase Database Schema
-- Paste and Run this in your Supabase Project -> SQL Editor
-- ========================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------
-- 1. FRANCHISE ENQUIRIES (Lead Management)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY DEFAULT ('enq-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || FLOOR(RANDOM() * 1000)::TEXT),
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  city_area TEXT NOT NULL,
  investment_readiness TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  source TEXT DEFAULT 'CakeStory Website — Franchise Enquiry Modal',
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for status filtering and sorting
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_submitted_at ON public.enquiries(submitted_at DESC);

-- ------------------------------------------------------------------------
-- 2. FRANCHISES / OUTLETS (68+ Verified Locations)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.franchises (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  outlet_name TEXT,
  zone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'Maharashtra',
  country TEXT DEFAULT 'India',
  latitude NUMERIC(10, 6) NOT NULL,
  longitude NUMERIC(10, 6) NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT 'care@cakestorydesserts.com',
  opening_hours TEXT DEFAULT '10:00 AM - 11:30 PM',
  manager TEXT,
  services JSONB DEFAULT '["Celebration Cakes", "Artisanal Pastries", "100% Pure Veg", "Custom Orders", "Takeaway"]'::JSONB,
  description TEXT,
  image TEXT,
  active BOOLEAN DEFAULT TRUE,
  established TEXT DEFAULT '2021',
  city_slug TEXT DEFAULT 'pune',
  locality TEXT,
  legacy_slugs JSONB DEFAULT '[]'::JSONB,
  google_maps_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_franchises_slug ON public.franchises(slug);
CREATE INDEX IF NOT EXISTS idx_franchises_city_slug ON public.franchises(city_slug);
CREATE INDEX IF NOT EXISTS idx_franchises_zone ON public.franchises(zone);
CREATE INDEX IF NOT EXISTS idx_franchises_active ON public.franchises(active);

-- ------------------------------------------------------------------------
-- 3. GALLERY REELS (Sweet Scenes Section)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_reels (
  id TEXT PRIMARY KEY,
  reel_url TEXT,
  title TEXT NOT NULL,
  marathi_title TEXT,
  video_url TEXT NOT NULL,
  thumbnail TEXT,
  category TEXT DEFAULT 'celebrations',
  category_label TEXT DEFAULT 'Celebrations',
  duration TEXT DEFAULT '0:24',
  description TEXT,
  order_index INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_reels_order ON public.gallery_reels(order_index ASC);
CREATE INDEX IF NOT EXISTS idx_gallery_reels_enabled ON public.gallery_reels(enabled);

-- ------------------------------------------------------------------------
-- 4. GALLERY SETTINGS (Sweet Scenes Configuration)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  enabled BOOLEAN DEFAULT TRUE,
  eyebrow TEXT DEFAULT 'INSTAGRAM',
  eyebrow_marathi TEXT DEFAULT 'इन्स्टाग्राम',
  heading TEXT DEFAULT 'Moments That Make Life Sweeter',
  heading_marathi TEXT DEFAULT 'आयुष्याला अधिक गोड बनवणारे खास क्षण',
  subtitle TEXT DEFAULT 'From custom creations to happy celebrations — catch the latest from CakeStory Desserts on Instagram.',
  subtitle_marathi TEXT DEFAULT 'कस्टम केक्सपासून ते प्रत्येक आनंदाच्या क्षणांपर्यंत — पहा केक स्टोरीचे ताजे रील्स आणि सेलिब्रेशन्स.',
  decorative_phrase TEXT DEFAULT 'Real Stories, Real Celebrations',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/cakestorydesserts/',
  show_categories BOOLEAN DEFAULT FALSE,
  show_highlights BOOLEAN DEFAULT TRUE,
  cta_label TEXT DEFAULT 'Follow @cakestorydesserts',
  autoplay BOOLEAN DEFAULT TRUE,
  default_muted BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 5. CAKE CATEGORIES
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '🎂',
  color TEXT DEFAULT 'from-pink-200 to-rose-200',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 6. CAKES (Menu Catalog)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cakes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_id TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image TEXT,
  ingredients JSONB DEFAULT '[]'::JSONB,
  flavor TEXT,
  size TEXT DEFAULT '500g / 1kg',
  availability TEXT DEFAULT 'in-stock',
  featured BOOLEAN DEFAULT FALSE,
  tags JSONB DEFAULT '["eggless"]'::JSONB,
  rating NUMERIC(2, 1) DEFAULT 4.9,
  color TEXT DEFAULT 'brown',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cakes_category_id ON public.cakes(category_id);
CREATE INDEX IF NOT EXISTS idx_cakes_featured ON public.cakes(featured);

-- ------------------------------------------------------------------------
-- 7. CUSTOM CAKE ORDERS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT ('ord-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || FLOOR(RANDOM() * 1000)::TEXT),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  cake_type TEXT,
  flavor TEXT,
  weight TEXT,
  custom_message TEXT,
  delivery_date DATE,
  delivery_address TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_kitchen', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 8. EVENTS & MASTERCLASSES
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  location TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  seats_available INTEGER DEFAULT 20,
  price NUMERIC(10, 2) DEFAULT 0,
  image TEXT,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 9. RECIPES & BLOG
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recipes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  prep_time TEXT,
  cook_time TEXT,
  servings TEXT,
  difficulty TEXT,
  description TEXT,
  ingredients JSONB DEFAULT '[]'::JSONB,
  instructions JSONB DEFAULT '[]'::JSONB,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT DEFAULT 'Chef CakeStory',
  published_at DATE DEFAULT CURRENT_DATE,
  image TEXT,
  tags JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 10. FAQS & TESTIMONIALS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  question_marathi TEXT,
  answer TEXT NOT NULL,
  answer_marathi TEXT,
  category TEXT DEFAULT 'franchise',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Customer',
  outlet TEXT,
  rating INTEGER DEFAULT 5,
  comment TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 11. SITE CONTENT (Hero, Stats, Brand Config)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (Storefront visitor access)
CREATE POLICY "Public read franchises" ON public.franchises FOR SELECT USING (true);
CREATE POLICY "Public read gallery_reels" ON public.gallery_reels FOR SELECT USING (true);
CREATE POLICY "Public read gallery_settings" ON public.gallery_settings FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read cakes" ON public.cakes FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Public read blog_posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT USING (true);

-- PUBLIC WRITE POLICIES (Visitors submitting enquiries and custom orders)
CREATE POLICY "Public insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

-- AUTHENTICATED / SERVICE ROLE FULL ACCESS (Admin dashboard)
CREATE POLICY "Admin full access enquiries" ON public.enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access franchises" ON public.franchises FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access gallery_reels" ON public.gallery_reels FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access gallery_settings" ON public.gallery_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access cakes" ON public.cakes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access events" ON public.events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access recipes" ON public.recipes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access blog_posts" ON public.blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access faqs" ON public.faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access site_content" ON public.site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ANON KEY FULL ACCESS FOR DEMO/ADMIN (Optional: allows anon key to manage via admin UI until Auth JWT is wired)
CREATE POLICY "Anon full access franchises" ON public.franchises FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access gallery_reels" ON public.gallery_reels FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access gallery_settings" ON public.gallery_settings FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access enquiries" ON public.enquiries FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access cakes" ON public.cakes FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access site_content" ON public.site_content FOR ALL TO anon USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------
-- 13. ADMIN USERS (Secure Portal Authentication)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT DEFAULT 'CakeStory Administrator',
  email TEXT DEFAULT 'admin@cakestorydesserts.in',
  role TEXT DEFAULT 'admin',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users(username);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read admin_users for login" ON public.admin_users FOR SELECT USING (true);
CREATE POLICY "Allow anon update admin_users" ON public.admin_users FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon insert admin_users" ON public.admin_users FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin full access admin_users" ON public.admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Automatic password hashing trigger (always stores passwords as 64-character SHA-256 hashes)
CREATE OR REPLACE FUNCTION public.hash_admin_password()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.password IS NOT NULL AND NEW.password !~ '^[a-fA-F0-9]{64}$' THEN
    NEW.password := encode(sha256(NEW.password::bytea), 'hex');
  ELSE
    NEW.password := lower(NEW.password);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_hash_admin_password ON public.admin_users;
CREATE TRIGGER trigger_hash_admin_password
BEFORE INSERT OR UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.hash_admin_password();
