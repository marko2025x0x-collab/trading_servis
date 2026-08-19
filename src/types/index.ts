export type SubscriptionStatus = 'free' | 'pro';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  subscription_status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export type SignalDirection = 'BUY' | 'SELL';

export type PatternType = 'PIN_BAR' | 'BULLISH_ENGULFING' | 'BEARISH_ENGULFING' | 'DOJI' | 'MORNING_STAR';

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

export interface Signal {
  id: string;
  symbol: string;
  direction: SignalDirection;
  entry: number;
  sl: number;
  tp: number;
  confluence_score: number;
  timeframe: Timeframe;
  pattern_detected: PatternType;
  smc_confluence: {
    fvg_detected: boolean;
    bos_detected: boolean;
    choch_detected: boolean;
    liquidity_sweep: boolean;
  };
  quant_confluence: {
    z_score: number;
    atr: number;
    momentum_score: number;
  };
  news_filter_passed: boolean;
  active: boolean;
  created_at: string;
}

export interface MarketCandle {
  timestamp: number; // unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradeLockerExecutionRequest {
  symbol: string;
  direction: SignalDirection;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  volume: number; // lot size
  accountId?: string;
}

export interface TradeLockerExecutionResponse {
  success: boolean;
  orderId?: string;
  executedPrice?: number;
  message: string;
  timestamp: string;
}

export interface EconomicNewsEvent {
  id: string;
  title: string;
  currency: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  scheduledAt: string; // ISO String
  forecast?: string;
  previous?: string;
}
