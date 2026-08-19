-- ====================================================================
-- NEXUS QUANT TERMINAL - SUPABASE DATABASE SCHEMA
-- Execute this SQL in your Supabase SQL Editor (https://app.supabase.com)
-- ====================================================================

-- 1. PROFILES TABLE
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

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Quant Trader'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. TRADELOCKER ENCRYPTED CREDENTIALS VAULT TABLE
CREATE TABLE IF NOT EXISTS public.tradelocker_credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
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

ALTER TABLE public.tradelocker_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own TradeLocker credentials" ON public.tradelocker_credentials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own TradeLocker credentials" ON public.tradelocker_credentials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own TradeLocker credentials" ON public.tradelocker_credentials
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own TradeLocker credentials" ON public.tradelocker_credentials
  FOR DELETE USING (auth.uid() = user_id);


-- 3. TRADING POSITIONS TABLE
CREATE TABLE IF NOT EXISTS public.trading_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
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

ALTER TABLE public.trading_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own positions" ON public.trading_positions
  FOR ALL USING (auth.uid() = user_id);


-- 4. QUANTUM SIGNALS TABLE
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
  FOR SELECT USING (true);
