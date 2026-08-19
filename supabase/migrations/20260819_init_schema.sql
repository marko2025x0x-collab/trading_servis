-- Create profiles table linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    subscription_status TEXT NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, subscription_status)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        COALESCE(new.raw_user_meta_data->>'subscription_status', 'free')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create signals table
CREATE TABLE IF NOT EXISTS public.signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('BUY', 'SELL')),
    entry NUMERIC(14, 5) NOT NULL,
    sl NUMERIC(14, 5) NOT NULL,
    tp NUMERIC(14, 5) NOT NULL,
    confluence_score INT NOT NULL CHECK (confluence_score >= 0 AND confluence_score <= 100),
    timeframe VARCHAR(10) NOT NULL DEFAULT '15m',
    pattern_detected VARCHAR(50) NOT NULL,
    smc_confluence JSONB NOT NULL DEFAULT '{}'::jsonb,
    quant_confluence JSONB NOT NULL DEFAULT '{}'::jsonb,
    news_filter_passed BOOLEAN NOT NULL DEFAULT true,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on signals
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view signals
CREATE POLICY "Allow public select for active signals" ON public.signals
    FOR SELECT USING (true);

-- Create market_data cache table
CREATE TABLE IF NOT EXISTS public.market_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    timeframe VARCHAR(10) NOT NULL,
    timestamp BIGINT NOT NULL,
    open NUMERIC(14, 5) NOT NULL,
    high NUMERIC(14, 5) NOT NULL,
    low NUMERIC(14, 5) NOT NULL,
    close NUMERIC(14, 5) NOT NULL,
    volume NUMERIC(18, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_symbol_tf_time UNIQUE (symbol, timeframe, timestamp)
);

-- Enable RLS on market_data
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for market_data" ON public.market_data
    FOR SELECT USING (true);

-- Enable Supabase Realtime for signals table
ALTER PUBLICATION supabase_realtime ADD TABLE public.signals;
