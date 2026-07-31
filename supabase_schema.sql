-- ============================================================
-- SQL FIX & SCHEMA UNTUK CARELM STORE (SUPABASE)
-- Jalankan seluruh script ini di Supabase SQL Editor:
-- Dashboard Supabase -> SQL Editor -> New Query -> Run
-- ============================================================

-- A. UBAH TIPE KOLOM DARI UUID KE TEXT (JIKA TABEL SUDAH ADA SEBELUMNYA DENGAN TIPE UUID)
DO $$
BEGIN
  -- Convert ID di tabel-tabel utama ke TEXT
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='customers') THEN
    ALTER TABLE public.customers ALTER COLUMN id TYPE text USING id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='services') THEN
    ALTER TABLE public.services ALTER COLUMN id TYPE text USING id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='bookings') THEN
    ALTER TABLE public.bookings ALTER COLUMN id TYPE text USING id::text;
    ALTER TABLE public.bookings ALTER COLUMN customer_id TYPE text USING customer_id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='transactions') THEN
    ALTER TABLE public.transactions ALTER COLUMN id TYPE text USING id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='inventory_items') THEN
    ALTER TABLE public.inventory_items ALTER COLUMN id TYPE text USING id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='equipment') THEN
    ALTER TABLE public.equipment ALTER COLUMN id TYPE text USING id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='shopping_list') THEN
    ALTER TABLE public.shopping_list ALTER COLUMN id TYPE text USING id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='investments') THEN
    ALTER TABLE public.investments ALTER COLUMN id TYPE text USING id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='notes') THEN
    ALTER TABLE public.notes ALTER COLUMN id TYPE text USING id::text;
  END IF;
END $$;


-- B. BUAT TABEL DENGAN TIPE DATA TEXT (JIKA BELUM ADA)

-- 1. Table Customers
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  motorcycle TEXT DEFAULT '',
  helmet_brand TEXT DEFAULT '',
  helmet_type TEXT DEFAULT '',
  helmet_color TEXT DEFAULT '',
  purchase_date TEXT DEFAULT NULL,
  address TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  customer_since TEXT DEFAULT NULL,
  referral BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to customers" ON public.customers;
CREATE POLICY "Allow all access to customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);

-- 2. Table Services
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  est_time INT DEFAULT 0,
  description TEXT DEFAULT '',
  required_products TEXT DEFAULT '',
  addons TEXT DEFAULT '',
  profit_margin NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to services" ON public.services;
CREATE POLICY "Allow all access to services" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- 3. Table Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  customer_id TEXT DEFAULT NULL,
  date TEXT DEFAULT NULL,
  time TEXT DEFAULT '',
  service TEXT DEFAULT '',
  price NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Pending',
  payment_status TEXT DEFAULT 'Unpaid',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to bookings" ON public.bookings;
CREATE POLICY "Allow all access to bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

-- 4. Table Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  category TEXT DEFAULT '',
  amount NUMERIC DEFAULT 0,
  date TEXT DEFAULT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to transactions" ON public.transactions;
CREATE POLICY "Allow all access to transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

-- 5. Table Inventory Items
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT '',
  current_stock NUMERIC DEFAULT 0,
  min_stock NUMERIC DEFAULT 0,
  unit TEXT DEFAULT '',
  purchase_price NUMERIC DEFAULT 0,
  supplier TEXT DEFAULT '',
  usage_per_service NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to inventory_items" ON public.inventory_items;
CREATE POLICY "Allow all access to inventory_items" ON public.inventory_items FOR ALL USING (true) WITH CHECK (true);

-- 6. Table Equipment
CREATE TABLE IF NOT EXISTS public.equipment (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  purchase_date TEXT DEFAULT NULL,
  purchase_price NUMERIC DEFAULT 0,
  lifetime_months INT DEFAULT 0,
  condition TEXT DEFAULT 'Good',
  maintenance_schedule TEXT DEFAULT '',
  warranty TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to equipment" ON public.equipment;
CREATE POLICY "Allow all access to equipment" ON public.equipment FOR ALL USING (true) WITH CHECK (true);

-- 7. Table Shopping List
CREATE TABLE IF NOT EXISTS public.shopping_list (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT DEFAULT '',
  category TEXT DEFAULT '',
  priority TEXT DEFAULT 'Medium',
  price NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'not_purchased',
  supplier TEXT DEFAULT '',
  purchase_date TEXT DEFAULT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.shopping_list ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to shopping_list" ON public.shopping_list;
CREATE POLICY "Allow all access to shopping_list" ON public.shopping_list FOR ALL USING (true) WITH CHECK (true);

-- 8. Table Investments
CREATE TABLE IF NOT EXISTS public.investments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT '',
  priority TEXT DEFAULT 'Medium',
  estimated_cost NUMERIC DEFAULT 0,
  target_date TEXT DEFAULT NULL,
  reason TEXT DEFAULT '',
  business_impact TEXT DEFAULT '',
  current_progress NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Planned',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to investments" ON public.investments;
CREATE POLICY "Allow all access to investments" ON public.investments FOR ALL USING (true) WITH CHECK (true);

-- 9. Table Notes
CREATE TABLE IF NOT EXISTS public.notes (
  id TEXT PRIMARY KEY,
  title TEXT DEFAULT '',
  content TEXT DEFAULT '',
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to notes" ON public.notes;
CREATE POLICY "Allow all access to notes" ON public.notes FOR ALL USING (true) WITH CHECK (true);

-- 10. Table App KV (Settings & Daily Ops)
CREATE TABLE IF NOT EXISTS public.app_kv (
  user_id UUID NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, key)
);
ALTER TABLE public.app_kv ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to app_kv" ON public.app_kv;
CREATE POLICY "Allow all access to app_kv" ON public.app_kv FOR ALL USING (true) WITH CHECK (true);
