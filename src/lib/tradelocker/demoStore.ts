import { TradeLockerAccountInfo, TradeLockerPosition } from '@/types/tradelocker';

export const INITIAL_DEMO_ACCOUNT: TradeLockerAccountInfo = {
  accountId: '1787179051833048700',
  accountName: 'TradeLocker Real/Demo Account',
  server: 'TradeLocker-Demo-Server-01',
  balance: 50000.00,
  equity: 51240.50,
  freeMargin: 48950.00,
  currency: 'USD',
  leverage: '1:100',
  isDemo: true,
  connected: true,
};

export const INITIAL_DEMO_POSITIONS: TradeLockerPosition[] = [
  {
    id: 'pos-tl-101',
    symbol: 'EUR/USD',
    type: 'BUY',
    volume: 0.50,
    openPrice: 1.0820,
    currentPrice: 1.0854,
    stopLoss: 1.0790,
    takeProfit: 1.0890,
    unrealizedPnl: 170.00,
    openedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'pos-tl-102',
    symbol: 'SOL/USDT',
    type: 'BUY',
    volume: 1.00,
    openPrice: 140.50,
    currentPrice: 142.50,
    stopLoss: 136.00,
    takeProfit: 150.00,
    unrealizedPnl: 200.00,
    openedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];
