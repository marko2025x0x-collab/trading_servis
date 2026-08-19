-- Supabase Migration for GDPR-compliant Encrypted TradeLocker Credentials Vault

CREATE TABLE IF NOT EXISTS public.tradelocker_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    environment VARCHAR(10) NOT NULL DEFAULT 'DEMO', -- 'DEMO' or 'LIVE'
    server_url VARCHAR(255) NOT NULL,
    email_encrypted TEXT NOT NULL, -- AES-256-GCM Encrypted
    password_encrypted TEXT NOT NULL, -- AES-256-GCM Encrypted
    acc_id_encrypted TEXT, -- AES-256-GCM Encrypted
    encryption_iv TEXT NOT NULL, -- Unique per-record IV
    encryption_auth_tag TEXT NOT NULL, -- AES-256 Auth Tag
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS strictly
ALTER TABLE public.tradelocker_credentials ENABLE ROW LEVEL SECURITY;

-- Strict GDPR RLS Policy: ONLY the authenticated user can access their own encrypted credentials
CREATE POLICY "Users can only select own encrypted credentials" 
    ON public.tradelocker_credentials FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert own encrypted credentials" 
    ON public.tradelocker_credentials FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update own encrypted credentials" 
    ON public.tradelocker_credentials FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own encrypted credentials" 
    ON public.tradelocker_credentials FOR DELETE 
    USING (auth.uid() = user_id);
