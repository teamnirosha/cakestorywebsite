-- ========================================================================
-- CakeStory Desserts - Admin Table & User Credentials Setup
-- Paste and Run this in your Supabase Project -> SQL Editor
-- ========================================================================

-- 1. Create the admin_users table
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

-- Index for instant username lookup
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users(username);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Security Policies:
DROP POLICY IF EXISTS "Allow anon read admin_users for login" ON public.admin_users;
CREATE POLICY "Allow anon read admin_users for login" ON public.admin_users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon update admin_users" ON public.admin_users;
CREATE POLICY "Allow anon update admin_users" ON public.admin_users FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon insert admin_users" ON public.admin_users;
CREATE POLICY "Allow anon insert admin_users" ON public.admin_users FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access admin_users" ON public.admin_users;
CREATE POLICY "Admin full access admin_users" ON public.admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------
-- 2. AUTOMATIC PASSWORD HASHING TRIGGER
-- Guarantees the database ALWAYS stores a 64-character SHA-256 hash.
-- Even if you enter plain text in a query, PostgreSQL automatically hashes it!
-- ------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.hash_admin_password()
RETURNS TRIGGER AS $$
BEGIN
  -- If password is NOT already a 64-character hex SHA-256 hash, hash it with SHA-256
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

-- Convert any existing plain-text passwords in the table to SHA-256 hash immediately
UPDATE public.admin_users
SET password = encode(sha256(password::bytea), 'hex')
WHERE password !~ '^[a-fA-F0-9]{64}$';

-- ------------------------------------------------------------------------
-- 3. INSERT OR UPDATE ADMIN CREDENTIALS
-- Enter your desired username and password below.
-- The trigger above will automatically hash the password before saving!
-- ------------------------------------------------------------------------
INSERT INTO public.admin_users (username, password, name, role, active)
VALUES (
  'admin@cakestory.in',               -- << YOUR DESIRED USERNAME
  'YourSecurePasswordHere123#',       -- << YOUR DESIRED PASSWORD (Trigger hashes it automatically)
  'CakeStory Admin',                  -- Full Name / Title
  'admin',
  TRUE
)
ON CONFLICT (username) 
DO UPDATE SET 
  password = EXCLUDED.password,
  active = TRUE,
  updated_at = NOW();
