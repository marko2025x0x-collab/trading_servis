import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjznmmwbmlxnbkwodwca.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-trading-terminal';
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
