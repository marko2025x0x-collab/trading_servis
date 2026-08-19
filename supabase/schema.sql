-- ====================================================================
-- NEXUS QUANT TERMINAL - UNIFIED SUPABASE DATABASE SCHEMA
-- Compliant with Supabase Security Checklist & Postgres Best Practices 2026
-- Execute this SQL in your Supabase SQL Editor (https://app.supabase.com)
-- ====================================================================

-- Grant schema usage to API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 1. PROFILES TABLE (Linked directly to Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT 'Quant Trader',
  avatar_url TEXT,
  account_type TEXT DEFAULT 'DEMO', -- 'DEMO' or 'REAL'
  subscription_tier TEXT DEFAULT 'PRO', -- 'FREE' or 'PRO'
  demo_balance NUMERIC(12,2) DEFAULT 50000.00,
  real_balance NUMERIC(12,2) DEFAULT 12450.80,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Trigger to automatically create linked profile on Google OAuth or Email signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Quant Trader'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. TRADELOCKER ENCRYPTED CREDENTIALS VAULT TABLE (Linked to Profiles)
CREATE TABLE IF NOT EXISTS public.tradelocker_credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  account_id TEXT NOT NULL,
  server TEXT NOT NULL,
  masked_email TEXT NOT NULL,
  encrypted_email TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  environment TEXT DEFAULT 'DEMO',
  balance NUMERIC(12,2) DEFAULT 50000.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, account_id)
);

-- B-Tree Index for Fast Joins & Querying
CREATE INDEX IF NOT EXISTS idx_tradelocker_credentials_user_id ON public.tradelocker_credentials(user_id);

ALTER TABLE public.tradelocker_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own TradeLocker credentials" ON public.tradelocker_credentials
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own TradeLocker credentials" ON public.tradelocker_credentials
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own TradeLocker credentials" ON public.tradelocker_credentials
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own TradeLocker credentials" ON public.tradelocker_credentials
  FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);


-- 3. TRADING POSITIONS TABLE (Linked to Profiles)
CREATE TABLE IF NOT EXISTS public.trading_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  direction TEXT NOT NULL, -- 'BUY' or 'SELL'
  entry_price NUMERIC(14,5) NOT NULL,
  current_price NUMERIC(14,5) NOT NULL,
  stop_loss NUMERIC(14,5),
  take_profit NUMERIC(14,5),
  volume NUMERIC(8,2) DEFAULT 0.10,
  unrealized_pnl NUMERIC(12,2) DEFAULT 0.00,
  status TEXT DEFAULT 'OPEN', -- 'OPEN', 'CLOSED', 'CANCELLED'
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_trading_positions_user_id ON public.trading_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_positions_status ON public.trading_positions(status);

ALTER TABLE public.trading_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own positions" ON public.trading_positions
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own positions" ON public.trading_positions
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own positions" ON public.trading_positions
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own positions" ON public.trading_positions
  FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);


-- 4. USER SETTINGS TABLE (Linked to Profiles)
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  language TEXT DEFAULT 'uk',
  default_symbol TEXT DEFAULT 'EUR/USD',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  sound_alerts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own settings" ON public.user_settings
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);


-- 5. QUANTUM SIGNALS TABLE (Public Terminal Data)
CREATE TABLE IF NOT EXISTS public.quantum_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  direction TEXT NOT NULL,
  timeframe TEXT DEFAULT '15m',
  confluence_score INT NOT NULL,
  entry_price NUMERIC(14,5) NOT NULL,
  stop_loss NUMERIC(14,5) NOT NULL,
  take_profit_1 NUMERIC(14,5) NOT NULL,
  take_profit_2 NUMERIC(14,5) NOT NULL,
  smc_matrix_valid BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quantum_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quantum signals" ON public.quantum_signals
  FOR SELECT TO anon, authenticated
  USING (true);


-- 6. MARKET NEWS TABLE (Real-time Economic News)
CREATE TABLE IF NOT EXISTS public.market_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  impact TEXT NOT NULL, -- 'HIGH', 'MEDIUM', 'LOW'
  currency TEXT NOT NULL,
  forecast TEXT,
  previous TEXT,
  actual TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.market_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view market news" ON public.market_news
  FOR SELECT TO anon, authenticated
  USING (true);

-- Grant appropriate permissions to roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.quantum_signals, public.market_news TO anon;
