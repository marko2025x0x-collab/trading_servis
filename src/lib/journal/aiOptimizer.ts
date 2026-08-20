import { JournalTrade, JournalStats, AITradeOptimizationAdvice } from '@/types/journal';

function winRateOf(trades: JournalTrade[]): number {
  const closed = trades.filter((t) => t.status !== 'OPEN');
  if (closed.length === 0) return 0;
  const wins = closed.filter((t) => t.status === 'CLOSED_WIN').length;
  return (wins / closed.length) * 100;
}

/** Groups closed trades by a key and returns each group's win rate, sorted best-first. */
function rankByWinRate(
  trades: JournalTrade[],
  keyOf: (t: JournalTrade) => string,
  minSampleSize = 2
): { key: string; winRate: number; count: number }[] {
  const closed = trades.filter((t) => t.status !== 'OPEN');
  const groups = new Map<string, JournalTrade[]>();
  for (const t of closed) {
    const key = keyOf(t);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }
  return Array.from(groups.entries())
    .filter(([, ts]) => ts.length >= minSampleSize)
    .map(([key, ts]) => ({ key, winRate: winRateOf(ts), count: ts.length }))
    .sort((a, b) => b.winRate - a.winRate);
}

export function calculateJournalStats(trades: JournalTrade[]): JournalStats {
  const closed = trades.filter((t) => t.status !== 'OPEN');
  const winCount = closed.filter((t) => t.status === 'CLOSED_WIN').length;
  const lossCount = closed.filter((t) => t.status === 'CLOSED_LOSS').length;
  const totalTrades = closed.length;
  const winRate = totalTrades > 0 ? parseFloat(((winCount / totalTrades) * 100).toFixed(1)) : 0;

  const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  const grossProfit = closed.filter((t) => (t.pnl || 0) > 0).reduce((sum, t) => sum + (t.pnl || 0), 0);
  const grossLoss = Math.abs(closed.filter((t) => (t.pnl || 0) < 0).reduce((sum, t) => sum + (t.pnl || 0), 0));
  const profitFactor = grossLoss > 0 ? parseFloat((grossProfit / grossLoss).toFixed(2)) : grossProfit > 0 ? 99.0 : 0;

  const bySymbol = rankByWinRate(trades, (t) => t.symbol);
  const byTimeframe = rankByWinRate(trades, (t) => t.timeframe);
  const byTag = rankByWinRate(trades, (t) => t.tags[0] || 'UNTAGGED');

  return {
    totalTrades,
    winCount,
    lossCount,
    winRate,
    totalPnL: parseFloat(totalPnL.toFixed(2)),
    profitFactor,
    bestSymbol: bySymbol.length > 0 ? `${bySymbol[0].key} (${bySymbol[0].winRate.toFixed(1)}% WR, n=${bySymbol[0].count})` : 'Недостатньо даних',
    bestTimeframe: byTimeframe.length > 0 ? `${byTimeframe[0].key} (${byTimeframe[0].winRate.toFixed(1)}% WR, n=${byTimeframe[0].count})` : 'Недостатньо даних',
    bestSetupPattern: byTag.length > 0 ? `${byTag[0].key} (${byTag[0].winRate.toFixed(1)}% WR, n=${byTag[0].count})` : 'Недостатньо даних',
  };
}

/** Simplified Sharpe-style ratio: mean(pnl) / stddev(pnl) across closed trades, annualization omitted (not enough trade frequency data to annualize meaningfully). */
export function calculateSharpeRatio(trades: JournalTrade[]): number | null {
  const closed = trades.filter((t) => t.status !== 'OPEN' && typeof t.pnl === 'number');
  if (closed.length < 3) return null;
  const pnls = closed.map((t) => t.pnl as number);
  const mean = pnls.reduce((s, v) => s + v, 0) / pnls.length;
  const variance = pnls.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / pnls.length;
  const stdDev = Math.sqrt(variance);
  if (stdDev === 0) return null;
  return parseFloat((mean / stdDev).toFixed(2));
}

/** Max drawdown as a percentage of the running equity peak, walking closed trades in chronological order. */
export function calculateMaxDrawdown(trades: JournalTrade[]): number | null {
  const closed = trades
    .filter((t) => t.status !== 'OPEN' && typeof t.pnl === 'number' && t.closedAt)
    .sort((a, b) => new Date(a.closedAt!).getTime() - new Date(b.closedAt!).getTime());
  if (closed.length === 0) return null;

  let equity = 0;
  let peak = 0;
  let maxDrawdownPct = 0;
  for (const t of closed) {
    equity += t.pnl as number;
    peak = Math.max(peak, equity);
    if (peak > 0) {
      const drawdownPct = ((peak - equity) / peak) * 100;
      maxDrawdownPct = Math.max(maxDrawdownPct, drawdownPct);
    }
  }
  return parseFloat(maxDrawdownPct.toFixed(2));
}

export function generateAIJournalOptimizations(trades: JournalTrade[]): AITradeOptimizationAdvice[] {
  const closed = trades.filter((t) => t.status !== 'OPEN');
  if (closed.length < 3) {
    return [
      {
        id: 'adv-insufficient-data',
        category: 'SETUP_OPTIMIZATION',
        title: 'Недостатньо даних для аналізу',
        description: `У щоденнику ${closed.length} закритих угод. Потрібно щонайменше 3 для статистично значущих рекомендацій.`,
        impactScore: 'MEDIUM',
        actionableStep: 'Продовжуйте логувати угоди — рекомендації з’являться автоматично, коли назбирається достатньо даних.',
      },
    ];
  }

  const advice: AITradeOptimizationAdvice[] = [];
  const stats = calculateJournalStats(trades);

  const byTimeframe = rankByWinRate(trades, (t) => t.timeframe);
  const byTag = rankByWinRate(trades, (t) => t.tags[0] || 'UNTAGGED');

  if (byTimeframe.length > 1) {
    const best = byTimeframe[0];
    const worst = byTimeframe[byTimeframe.length - 1];
    if (best.winRate - worst.winRate >= 15) {
      advice.push({
        id: 'adv-timeframe',
        category: 'TIMEFRAME_SELECTION',
        title: `Таймфрейм ${worst.key} показує слабший результат`,
        description: `${worst.key}: ${worst.winRate.toFixed(1)}% WR (n=${worst.count}) проти ${best.key}: ${best.winRate.toFixed(1)}% WR (n=${best.count}).`,
        impactScore: worst.winRate < 40 ? 'CRITICAL' : 'HIGH',
        actionableStep: `Розгляньте зниження частоти угод на ${worst.key} або додайте додаткові фільтри підтвердження.`,
      });
    }
  }

  if (byTag.length > 1) {
    const best = byTag[0];
    advice.push({
      id: 'adv-setup',
      category: 'SETUP_OPTIMIZATION',
      title: `Сетап "${best.key}" показує найкращий результат`,
      description: `${best.winRate.toFixed(1)}% Win Rate на ${best.count} угодах з тегом "${best.key}".`,
      impactScore: best.winRate >= 70 ? 'CRITICAL' : 'HIGH',
      actionableStep: `Пріоритезуйте угоди з цим фактором конфлюенції; розгляньте збільшення розміру позиції для цього сетапу.`,
    });
  }

  const avgWin = closed.filter((t) => (t.pnl || 0) > 0).reduce((s, t) => s + (t.pnl || 0), 0) /
    Math.max(1, closed.filter((t) => (t.pnl || 0) > 0).length);
  const avgLoss = Math.abs(
    closed.filter((t) => (t.pnl || 0) < 0).reduce((s, t) => s + (t.pnl || 0), 0) /
      Math.max(1, closed.filter((t) => (t.pnl || 0) < 0).length)
  );
  if (avgLoss > 0 && avgWin / avgLoss < 1.5) {
    advice.push({
      id: 'adv-risk',
      category: 'RISK_MANAGEMENT',
      title: 'Співвідношення Risk:Reward нижче оптимального',
      description: `Середній виграш $${avgWin.toFixed(2)} проти середнього збитку $${avgLoss.toFixed(2)} (R:R ≈ 1:${(avgWin / avgLoss).toFixed(2)}).`,
      impactScore: 'HIGH',
      actionableStep: 'Розгляньте ширші тейк-профіт цілі або тісніші стоп-лосси для покращення R:R до мінімум 1:2.',
    });
  }

  if (advice.length === 0) {
    advice.push({
      id: 'adv-stable',
      category: 'SETUP_OPTIMIZATION',
      title: 'Стабільна продуктивність без явних відхилень',
      description: `Win Rate ${stats.winRate}% на ${stats.totalTrades} угодах без статистично значущих слабких місць.`,
      impactScore: 'MEDIUM',
      actionableStep: 'Продовжуйте поточну стратегію та накопичуйте більше даних для точнішого аналізу.',
    });
  }

  return advice;
}

export interface ConfluenceWeights {
  candlestickWeight: number;
  smcWeight: number;
  quantWeight: number;
  newsWeight: number;
}

const BASE_WEIGHTS: ConfluenceWeights = {
  candlestickWeight: 0.25,
  smcWeight: 0.35,
  quantWeight: 0.25,
  newsWeight: 0.15,
};

/**
 * Statistical weight optimization: nudges the confluence engine's factor
 * weights toward whichever tag category (candlestick pattern vs SMC vs
 * quant-heavy setups) has actually won more often in the trader's own
 * closed journal history. Falls back to the base weights until there's
 * enough sample size (>= 8 closed trades) to avoid overfitting on noise.
 */
export function computeOptimizedWeights(trades: JournalTrade[]): ConfluenceWeights {
  const closed = trades.filter((t) => t.status !== 'OPEN');
  if (closed.length < 8) return BASE_WEIGHTS;

  const candlestickTags = ['PinBar', 'Engulfing', 'MorningStar', 'Doji'];
  const smcTags = ['FVG', 'BOS', 'SMC', 'LiquiditySweep', 'Institutional'];
  const quantTags = ['Z-Score', 'ZScore', 'Momentum'];

  const winRateForTags = (tagList: string[]): number | null => {
    const matching = closed.filter((t) => t.tags.some((tag) => tagList.includes(tag)));
    if (matching.length < 3) return null;
    return winRateOf(matching);
  };

  const candlestickWr = winRateForTags(candlestickTags);
  const smcWr = winRateForTags(smcTags);
  const quantWr = winRateForTags(quantTags);

  const available = [candlestickWr, smcWr, quantWr].filter((v): v is number => v !== null);
  if (available.length < 2) return BASE_WEIGHTS;

  const avg = available.reduce((s, v) => s + v, 0) / available.length;
  const adjust = (wr: number | null, base: number) => {
    if (wr === null) return base;
    // Shift weight proportionally to deviation from average, capped to +/-0.1
    const delta = Math.max(-0.1, Math.min(0.1, ((wr - avg) / 100) * 0.4));
    return Math.max(0.1, base + delta);
  };

  const raw: ConfluenceWeights = {
    candlestickWeight: adjust(candlestickWr, BASE_WEIGHTS.candlestickWeight),
    smcWeight: adjust(smcWr, BASE_WEIGHTS.smcWeight),
    quantWeight: adjust(quantWr, BASE_WEIGHTS.quantWeight),
    newsWeight: BASE_WEIGHTS.newsWeight, // news filter stays a hard safety gate, not statistically tuned
  };

  const sum = raw.candlestickWeight + raw.smcWeight + raw.quantWeight + raw.newsWeight;
  return {
    candlestickWeight: raw.candlestickWeight / sum,
    smcWeight: raw.smcWeight / sum,
    quantWeight: raw.quantWeight / sum,
    newsWeight: raw.newsWeight / sum,
  };
}
