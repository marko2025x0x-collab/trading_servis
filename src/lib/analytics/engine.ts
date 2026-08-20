import { MarketCandle, Signal, SignalDirection } from '@/types';
import { analyzeCandlestickPattern } from './candlestick';
import { analyzeSMC } from './smc';
import { analyzeQuant } from './quant';
import { checkFundamentalNewsFilter } from './newsFilter';
import { ConfluenceWeights } from '@/lib/journal/aiOptimizer';

const DEFAULT_WEIGHTS: ConfluenceWeights = {
  candlestickWeight: 0.25,
  smcWeight: 0.35,
  quantWeight: 0.25,
  newsWeight: 0.15,
};

export interface SignalGenerationResult {
  generatedSignal: Signal | null;
  confluenceScore: number;
  breakdown: {
    candlestickScore: number;
    smcScore: number;
    quantScore: number;
    newsPassed: boolean;
    newsReason: string;
    dataStale: boolean;
  };
}

/**
 * Analytical Engine - Master Confluence Matrix
 * Calculates weighted score from Candlestick, SMC, Quant, and Fundamental News.
 * Only returns a valid signal if confluence_score > 80.
 */
export async function processSignalMatrix(
  symbol: string,
  candles: MarketCandle[],
  timeframe: '15m' | '1h' | '4h' = '15m',
  forceBypassNews = false,
  dataStale = false,
  weights: ConfluenceWeights = DEFAULT_WEIGHTS
): Promise<SignalGenerationResult> {
  const candleRes = analyzeCandlestickPattern(candles);
  const smcRes = analyzeSMC(candles);
  const quantRes = analyzeQuant(candles);
  const newsRes = await checkFundamentalNewsFilter(symbol);

  const newsPassed = newsRes.passed || forceBypassNews;

  // Weight breakdown — base weights, or statistically optimized from the trader's own journal history (see computeOptimizedWeights)
  const { candlestickWeight, smcWeight, quantWeight, newsWeight } = weights;

  let confluenceScore = Math.round(
    candleRes.score * candlestickWeight +
    smcRes.smcScore * smcWeight +
    quantRes.quantScore * quantWeight +
    (newsPassed ? 100 : 0) * newsWeight
  );

  // Hard safety override: If fundamental news filter fails, score is penalized below 80
  if (!newsPassed) {
    confluenceScore = Math.min(confluenceScore, 45);
  }

  // Hard safety override: stale/lagging market data is noise, not signal — never let it score as actionable
  if (dataStale) {
    confluenceScore = Math.min(confluenceScore, 30);
  }

  // Determine direction from SMC and Candlestick alignment
  const direction: SignalDirection = smcRes.bullishBias || candleRes.bullish ? 'BUY' : 'SELL';

  let generatedSignal: Signal | null = null;

  // Only return valid signal if score > 80
  if (confluenceScore > 80) {
    const currentPrice = candles[candles.length - 1].close;
    const atr = quantRes.atr;

    // Dynamic Risk Management (1:2 Risk to Reward Ratio using ATR)
    const slDistance = Math.max(atr * 1.5, currentPrice * 0.003);
    const tpDistance = slDistance * 2.0;

    const entry = parseFloat(currentPrice.toFixed(5));
    const sl = parseFloat(
      (direction === 'BUY' ? currentPrice - slDistance : currentPrice + slDistance).toFixed(5)
    );
    const tp = parseFloat(
      (direction === 'BUY' ? currentPrice + tpDistance : currentPrice - tpDistance).toFixed(5)
    );

    generatedSignal = {
      id: `sig-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      symbol,
      direction,
      entry,
      sl,
      tp,
      confluence_score: confluenceScore,
      timeframe,
      pattern_detected: candleRes.pattern,
      smc_confluence: {
        fvg_detected: smcRes.fvgDetected,
        bos_detected: smcRes.bosDetected,
        choch_detected: smcRes.chochDetected,
        liquidity_sweep: smcRes.liquiditySweep,
      },
      quant_confluence: {
        z_score: quantRes.zScore,
        atr: quantRes.atr,
        momentum_score: quantRes.momentumScore,
      },
      news_filter_passed: newsPassed,
      active: true,
      created_at: new Date().toISOString(),
    };
  }

  return {
    generatedSignal,
    confluenceScore,
    breakdown: {
      candlestickScore: candleRes.score,
      smcScore: smcRes.smcScore,
      quantScore: quantRes.quantScore,
      newsPassed,
      newsReason: newsRes.reason,
      dataStale,
    },
  };
}
