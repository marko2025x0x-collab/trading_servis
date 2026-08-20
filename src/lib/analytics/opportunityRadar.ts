import { SignalDirection } from '@/types';
import { fetchCandles } from '@/lib/marketData/twelveData';
import { processSignalMatrix } from './engine';

export interface OpportunitySetup {
  symbol: string;
  direction: SignalDirection;
  confluenceScore: number;
  isActionable: boolean; // true when confluenceScore > 80, matching the live signal engine's threshold
  timeframe: string;
  reasonUa: string;
  reasonEn: string;
  entry: number;
  sl: number;
  tp: number;
  dataSource: 'LIVE' | 'SIMULATED';
}

const WATCHLIST = ['EUR/USD', 'BTC/USD', 'XAU/USD', 'SOL/USDT', 'ETH/USD', 'GBP/USD', 'NVDA'];

function buildReason(
  bd: { candlestickScore: number; smcScore: number; quantScore: number; newsPassed: boolean },
  pattern: string,
  zScore: number
): { ua: string; en: string } {
  const parts: string[] = [];
  const partsEn: string[] = [];
  if (bd.smcScore >= 55) {
    parts.push('SMC-структура (FVG/BOS) підтверджує напрямок');
    partsEn.push('SMC structure (FVG/BOS) confirms direction');
  }
  if (pattern !== 'NONE') {
    parts.push(`свічковий патерн ${pattern}`);
    partsEn.push(`${pattern} candlestick pattern`);
  }
  if (Math.abs(zScore) > 1.8) {
    parts.push(`Z-Score ${zScore.toFixed(2)} (сильне відхилення від середнього)`);
    partsEn.push(`Z-Score ${zScore.toFixed(2)} (strong mean deviation)`);
  }
  if (!bd.newsPassed) {
    parts.push('УВАГА: поруч важлива новина');
    partsEn.push('WARNING: high-impact news nearby');
  }
  return {
    ua: parts.length ? parts.join(', ') + '.' : 'Недостатньо факторів конфлюенції.',
    en: partsEn.length ? partsEn.join(', ') + '.' : 'Insufficient confluence factors.',
  };
}

/**
 * Scans the watchlist through the real confluence engine (candlestick +
 * SMC + quant + news) using live Twelve Data candles where configured,
 * and returns the highest-scoring setups — not a canned list.
 */
export async function scanTopMarketOpportunities(
  symbols: string[] = WATCHLIST,
  limit = 5
): Promise<OpportunitySetup[]> {
  const results = await Promise.all(
    symbols.map(async (symbol) => {
      const { candles, source, stale } = await fetchCandles(symbol, '15m', 40);
      if (candles.length < 20) return null;

      const result = await processSignalMatrix(symbol, candles, '15m', false, stale);
      const currentPrice = candles[candles.length - 1].close;
      const direction: SignalDirection = result.generatedSignal?.direction ?? 'BUY';
      const reason = buildReason(
        result.breakdown,
        result.generatedSignal?.pattern_detected ?? 'NONE',
        result.generatedSignal?.quant_confluence.z_score ?? 0
      );

      const setup: OpportunitySetup = {
        symbol,
        direction,
        confluenceScore: result.confluenceScore,
        isActionable: result.confluenceScore > 80,
        timeframe: '15m',
        reasonUa: reason.ua,
        reasonEn: reason.en,
        entry: result.generatedSignal?.entry ?? currentPrice,
        sl: result.generatedSignal?.sl ?? currentPrice,
        tp: result.generatedSignal?.tp ?? currentPrice,
        dataSource: source,
      };
      return setup;
    })
  );

  return results
    .filter((r): r is OpportunitySetup => r !== null)
    .sort((a, b) => b.confluenceScore - a.confluenceScore)
    .slice(0, limit);
}
