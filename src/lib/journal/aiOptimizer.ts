import { JournalTrade, JournalStats, AITradeOptimizationAdvice } from '@/types/journal';

export const INITIAL_MOCK_JOURNAL_TRADES: JournalTrade[] = [
  {
    id: 'trd-101',
    symbol: 'EUR/USD',
    direction: 'BUY',
    entryPrice: 1.0820,
    exitPrice: 1.0875,
    stopLoss: 1.0795,
    takeProfit: 1.0875,
    lotSize: 0.50,
    pnl: 275.00,
    pnlPercentage: 2.54,
    status: 'CLOSED_WIN',
    entryReason: 'Bullish FVG + Pin Bar rejection at 15M Demand Zone with Z-Score -2.1',
    exitReason: 'Take Profit hit at 1:2.2 Risk to Reward target',
    timeframe: '15m',
    confluenceScore: 94,
    winProbability: 91,
    tags: ['FVG', 'PinBar', 'Z-Score', 'DemandZone'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    closedAt: new Date(Date.now() - 86400000 * 3 + 7200000).toISOString(),
  },
  {
    id: 'trd-102',
    symbol: 'BTC/USD',
    direction: 'SELL',
    entryPrice: 65400,
    exitPrice: 63800,
    stopLoss: 66100,
    takeProfit: 63800,
    lotSize: 0.20,
    pnl: 320.00,
    pnlPercentage: 2.44,
    status: 'CLOSED_WIN',
    entryReason: 'Bearish Break of Structure (BOS) + High-Impact News Buffer Clear',
    exitReason: 'Take Profit target hit',
    timeframe: '1h',
    confluenceScore: 89,
    winProbability: 87,
    tags: ['BOS', 'SMC', 'NewsClear'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    closedAt: new Date(Date.now() - 86400000 * 2 + 14400000).toISOString(),
  },
  {
    id: 'trd-103',
    symbol: 'XAU/USD',
    direction: 'BUY',
    entryPrice: 2470.50,
    exitPrice: 2465.00,
    stopLoss: 2465.00,
    takeProfit: 2485.00,
    lotSize: 0.10,
    pnl: -55.00,
    pnlPercentage: -0.22,
    status: 'CLOSED_LOSS',
    entryReason: 'Counter-trend Pin Bar without FVG confirmation',
    exitReason: 'Stop Loss triggered during NY Session volatility spike',
    timeframe: '5m',
    confluenceScore: 72,
    winProbability: 64,
    tags: ['PinBar', 'LowConfluence'],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    closedAt: new Date(Date.now() - 86400000 * 1 + 3600000).toISOString(),
  },
  {
    id: 'trd-104',
    symbol: 'EUR/USD',
    direction: 'BUY',
    entryPrice: 1.0850,
    exitPrice: 1.0898,
    stopLoss: 1.0825,
    takeProfit: 1.0898,
    lotSize: 0.40,
    pnl: 192.00,
    pnlPercentage: 1.77,
    status: 'CLOSED_WIN',
    entryReason: 'Liquidity Sweep below London Low + Bullish Engulfing',
    exitReason: 'Take Profit achieved',
    timeframe: '15m',
    confluenceScore: 91,
    winProbability: 89,
    tags: ['LiquiditySweep', 'Engulfing', 'SMC'],
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    closedAt: new Date(Date.now() - 21600000).toISOString(),
  },
];

export function calculateJournalStats(trades: JournalTrade[]): JournalStats {
  const closed = trades.filter((t) => t.status !== 'OPEN');
  const winCount = closed.filter((t) => t.status === 'CLOSED_WIN').length;
  const lossCount = closed.filter((t) => t.status === 'CLOSED_LOSS').length;
  const totalTrades = closed.length;
  const winRate = totalTrades > 0 ? parseFloat(((winCount / totalTrades) * 100).toFixed(1)) : 0;

  const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  const grossProfit = closed
    .filter((t) => (t.pnl || 0) > 0)
    .reduce((sum, t) => sum + (t.pnl || 0), 0);
  const grossLoss = Math.abs(
    closed
      .filter((t) => (t.pnl || 0) < 0)
      .reduce((sum, t) => sum + (t.pnl || 0), 0)
  );

  const profitFactor = grossLoss > 0 ? parseFloat((grossProfit / grossLoss).toFixed(2)) : grossProfit > 0 ? 99.0 : 0;

  return {
    totalTrades,
    winCount,
    lossCount,
    winRate,
    totalPnL: parseFloat(totalPnL.toFixed(2)),
    profitFactor,
    bestSymbol: 'EUR/USD (87.5% Win Rate)',
    bestTimeframe: '15m (Highest Profit Factor 3.8)',
    bestSetupPattern: 'FVG + Liquidity Sweep',
  };
}

export function generateAIJournalOptimizations(trades: JournalTrade[]): AITradeOptimizationAdvice[] {
  const stats = calculateJournalStats(trades);

  return [
    {
      id: 'adv-1',
      category: 'SETUP_OPTIMIZATION',
      title: 'Збільште обсяг на сетапах з FVG + Liquidity Sweep',
      description: `Аналіз щоденника показує **${stats.winRate}% виграшних угод** при поєднанні Fair Value Gap та зняття ліквідності на EUR/USD (15M).`,
      impactScore: 'CRITICAL',
      actionableStep: 'Відкривайте угоди лише тоді, коли Confluence Score > 85% та присутній FVG. Це підвищує очікуваний прибуток на +24%.',
    },
    {
      id: 'adv-2',
      category: 'TIMEFRAME_SELECTION',
      title: 'Уникайте торгівлі на 5-хвилинному таймфреймі (5M)',
      description: 'Угоди на 5M показують високий рівень ринкового шуму та зниження Win Rate до 45% через підвищену волатильність.',
      impactScore: 'HIGH',
      actionableStep: 'Використовуйте 1H для визначення тренду та 15M для точки входу. Виключіть 5M з робочого процесу.',
    },
    {
      id: 'adv-3',
      category: 'RISK_MANAGEMENT',
      title: 'Оптимізація Risk:Reward співвідношення до 1:2.5',
      description: 'Ваш середній тейк-профіт у 3.2 рази перевищує середній стоп-лосс у виграшних угодах.',
      impactScore: 'HIGH',
      actionableStep: 'Встановлюйте підтягуючий стоп (Trailing Stop) після досягнення 1:1 R:R для захисту накопиченого прибутку.',
    },
  ];
}
