import { MarketCandle, Signal, SignalDirection } from '@/types';
import { analyzeCandlestickPattern } from './candlestick';
import { analyzeSMC } from './smc';
import { analyzeQuant } from './quant';
import { checkFundamentalNewsFilter } from './newsFilter';

export interface SignalGenerationResult {
  generatedSignal: Signal | null;
  confluenceScore: number;
  breakdown: {
    candlestickScore: number;
    smcScore: number;
    quantScore: number;
    newsPassed: boolean;
    newsReason: string;
  };
}

/**
 * Analytical Engine - Master Confluence Matrix
 * Calculates weighted score from Candlestick, SMC, Quant, and Fundamental News.
 * Only returns a valid signal if confluence_score > 80.
 */
export function processSignalMatrix(
  symbol: string,
  candles: MarketCandle[],
  timeframe: '15m' | '1h' | '4h' = '15m',
  forceBypassNews = false
): SignalGenerationResult {
  const candleRes = analyzeCandlestickPattern(candles);
  const smcRes = analyzeSMC(candles);
  const quantRes = analyzeQuant(candles);
  const newsRes = checkFundamentalNewsFilter(symbol);

  const newsPassed = newsRes.passed || forceBypassNews;

  // Weight breakdown
  const candlestickWeight = 0.25;
  const smcWeight = 0.35;
  const quantWeight = 0.25;
  const newsWeight = 0.15;

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
      pattern_detected: candleRes.pattern !== 'NONE' ? candleRes.pattern : 'PIN_BAR',
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
    },
  };
}
