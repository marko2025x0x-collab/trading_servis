-- Migration for Trader's Diary and Arbitrage Opportunities tables

-- 1. Create trader_diary table
CREATE TABLE IF NOT EXISTS public.trader_diary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    symbol VARCHAR(30) NOT NULL,
    direction VARCHAR(10) NOT NULL DEFAULT 'BUY',
    entry_price NUMERIC(18, 6) NOT NULL,
    exit_price NUMERIC(18, 6),
    pnl NUMERIC(18, 2),
    screenshot_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on trader_diary
ALTER TABLE public.trader_diary ENABLE ROW LEVEL SECURITY;

-- Policies for trader_diary: Users can read, insert, update, and delete their own trades
CREATE POLICY "Users can view own trades" ON public.trader_diary
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own trades" ON public.trader_diary
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own trades" ON public.trader_diary
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own trades" ON public.trader_diary
    FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);


-- 2. Create arbitrage_opportunities table for live spread caching
CREATE TABLE IF NOT EXISTS public.arbitrage_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(30) NOT NULL,
    exchange_a VARCHAR(50) NOT NULL,
    exchange_b VARCHAR(50) NOT NULL,
    spread_percentage NUMERIC(6, 2) NOT NULL,
    est_profit_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on arbitrage_opportunities
ALTER TABLE public.arbitrage_opportunities ENABLE ROW LEVEL SECURITY;

-- Public read access policy
CREATE POLICY "Public read arbitrage opportunities" ON public.arbitrage_opportunities
    FOR SELECT USING (true);
