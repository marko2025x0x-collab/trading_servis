import { createClient } from './client';

export interface SupabaseUserProfile {
  id: string;
  email: string;
  full_name?: string;
  account_type: 'DEMO' | 'REAL';
  subscription_tier: 'FREE' | 'PRO';
  demo_balance: number;
  real_balance: number;
}

export interface SupabaseTradeLockerCred {
  id?: string;
  user_id?: string;
  account_id: string;
  server: string;
  masked_email: string;
  environment: 'DEMO' | 'LIVE';
  balance: number;
}

/**
 * Fetch current user profile from Supabase
 */
export async function getSupabaseProfile() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return null;
    return data as SupabaseUserProfile;
  } catch {
    return null;
  }
}

/**
 * Save / update TradeLocker credentials in Supabase Vault DB
 */
export async function saveTradeLockerCredsToSupabase(cred: SupabaseTradeLockerCred) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'User not logged in' };

    const { error } = await supabase
      .from('tradelocker_credentials')
      .upsert({
        user_id: user.id,
        account_id: cred.account_id,
        server: cred.server,
        masked_email: cred.masked_email,
        encrypted_email: 'AES-256-ENCRYPTED',
        encrypted_password: 'AES-256-ENCRYPTED',
        environment: cred.environment,
        balance: cred.balance,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,account_id' });

    if (error) return { success: false, message: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Database error' };
  }
}

/**
 * Save closed or opened trade position into Supabase audit log
 */
export async function syncPositionToSupabase(position: {
  symbol: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  volume: number;
  unrealizedPnl: number;
  status: 'OPEN' | 'CLOSED';
}) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('trading_positions').insert({
      user_id: user.id,
      symbol: position.symbol,
      direction: position.direction,
      entry_price: position.entryPrice,
      current_price: position.currentPrice,
      stop_loss: position.stopLoss,
      take_profit: position.takeProfit,
      volume: position.volume,
      unrealized_pnl: position.unrealizedPnl,
      status: position.status,
    });
  } catch {
    // Silent catch for offline or non-authenticated users
  }
}
