export interface TradeLockerAccountInfo {
  accountId: string;
  accountName: string;
  server: string; // e.g. "TradeLocker-Demo-Server-01"
  balance: number;
  equity: number;
  freeMargin: number;
  currency: string; // "USD"
  leverage: string; // "1:100"
  isDemo: boolean;
  connected: boolean;
}

export interface TradeLockerPosition {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number; // Lot size e.g. 0.5
  openPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  unrealizedPnl: number;
  openedAt: string;
}
