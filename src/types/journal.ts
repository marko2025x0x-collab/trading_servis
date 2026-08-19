export type JournalTradeStatus = 'OPEN' | 'CLOSED_WIN' | 'CLOSED_LOSS';

export interface JournalTrade {
  id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice?: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  pnl?: number; // PnL in USD
  pnlPercentage?: number;
  status: JournalTradeStatus;
  entryReason: string;
  exitReason?: string;
  timeframe: string;
  confluenceScore: number;
  winProbability: number;
  tags: string[]; // e.g. ['FVG', 'BOS', 'Z-Score', 'PinBar']
  createdAt: string;
  closedAt?: string;
}

export interface JournalStats {
  totalTrades: number;
  winCount: number;
  lossCount: number;
  winRate: number; // percentage e.g. 78.5%
  totalPnL: number;
  profitFactor: number;
  bestSymbol: string;
  bestTimeframe: string;
  bestSetupPattern: string;
}

export interface AITradeOptimizationAdvice {
  id: string;
  category: 'RISK_MANAGEMENT' | 'SETUP_OPTIMIZATION' | 'TIMEFRAME_SELECTION' | 'TIMING';
  title: string;
  description: string;
  impactScore: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  actionableStep: string;
}
