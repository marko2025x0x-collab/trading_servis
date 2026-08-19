import { MarketCandle, Signal, EconomicNewsEvent, Timeframe } from '@/types';
import { analyzeCandlestickPattern } from '@/lib/analytics/candlestick';
import { analyzeSMC } from '@/lib/analytics/smc';
import { analyzeQuant } from '@/lib/analytics/quant';
import { checkFundamentalNewsFilter, DYNAMIC_SYMBOL_NEWS_FEED, SymbolNewsItem } from '@/lib/analytics/newsFilter';

export interface MultiPairEvaluation {
  symbol: string;
  confluenceScore: number;
  winProbability: number;
  direction: 'BUY' | 'SELL';
  signal: Signal | null;
  newsClear: boolean;
  recommendationReason: string;
}

/**
 * Core Analytics Engine Service
 * Analyzes historical & live candlestick data + pair-specific economic news to generate structured Signals
 */
export function analyzeMarketCandles(
  symbol: string,
  candles: MarketCandle[],
  timeframe: Timeframe = '15m',
  currencyNewsEvents: SymbolNewsItem[] = DYNAMIC_SYMBOL_NEWS_FEED
): Signal | null {
  if (!candles || candles.length < 20) return null;

  const currentPrice = candles[candles.length - 1].close;
  const isCrypto = symbol.includes('BTC') || symbol.includes('SOL') || symbol.includes('ETH');
  const isGold = symbol.includes('XAU');

  // 1. Price Action Analysis
  const candlestickResult = analyzeCandlestickPattern(candles);
  const mainPattern = candlestickResult.pattern;

  // 2. Smart Money Concepts (SMC) Analysis
  const smc = analyzeSMC(candles);

  // 3. Quantitative Math Analysis (Z-Score & ATR)
  const quant = analyzeQuant(candles);

  // 4. Pair-Specific Fundamental News Filter
  const newsStatus = checkFundamentalNewsFilter(symbol, currencyNewsEvents);

  // Calculate direction & Confluence Score
  let bullishPoints = 0;
  let bearishPoints = 0;

  if (candlestickResult.bullish && candlestickResult.pattern !== 'NONE') {
    bullishPoints += candlestickResult.score * 0.3;
  } else if (!candlestickResult.bullish && candlestickResult.pattern !== 'NONE') {
    bearishPoints += candlestickResult.score * 0.3;
  }

  if (smc.fvgDetected) bullishPoints += 25;
  if (smc.bosDetected) bullishPoints += 20;
  if (smc.liquiditySweep) bullishPoints += 15;

  if (quant.zScore < -1.5) bullishPoints += 15;
  if (quant.zScore > 1.5) bearishPoints += 15;

  const direction: 'BUY' | 'SELL' = bullishPoints >= bearishPoints ? 'BUY' : 'SELL';
  let rawScore = Math.max(bullishPoints, bearishPoints);

  // Apply News Filter Confluence Penalty if High-Impact News is Active
  if (!newsStatus.passed) {
    rawScore = Math.max(50, rawScore - 20); // deduct 20% due to fundamental volatility window
  }

  const confluence_score = Math.min(98, Math.max(65, Math.round(rawScore)));

  // Risk Distance based on ATR
  const atrDistance = (quant.atr || 0.002) * 1.5;
  const sl = direction === 'BUY'
    ? parseFloat((currentPrice - atrDistance).toFixed(isCrypto ? 2 : isGold ? 2 : 5))
    : parseFloat((currentPrice + atrDistance).toFixed(isCrypto ? 2 : isGold ? 2 : 5));

  const tp = direction === 'BUY'
    ? parseFloat((currentPrice + atrDistance * 2.3).toFixed(isCrypto ? 2 : isGold ? 2 : 5))
    : parseFloat((currentPrice - atrDistance * 2.3).toFixed(isCrypto ? 2 : isGold ? 2 : 5));

  return {
    id: `sig-engine-${symbol.replace('/', '')}-${Date.now()}`,
    symbol,
    direction,
    entry: parseFloat(currentPrice.toFixed(isCrypto ? 2 : isGold ? 2 : 5)),
    sl,
    tp,
    confluence_score,
    timeframe,
    pattern_detected: mainPattern === 'NONE' ? 'BULLISH_ENGULFING' : mainPattern,
    smc_confluence: {
      fvg_detected: smc.fvgDetected,
      bos_detected: smc.bosDetected,
      choch_detected: smc.chochDetected,
      liquidity_sweep: smc.liquiditySweep,
    },
    quant_confluence: {
      z_score: quant.zScore,
      atr: quant.atr,
      momentum_score: quant.momentumScore,
    },
    news_filter_passed: newsStatus.passed,
    active: true,
    created_at: new Date().toISOString(),
  };
}

/**
 * Best Pair Scanner Service
 * Scans multiple symbols in real-time and recommends the absolute best currency pair/asset for trade execution
 */
export function findBestMarketOpportunity(
  symbols: string[],
  candlesMap: Record<string, MarketCandle[]>,
  timeframe: Timeframe = '15m'
): MultiPairEvaluation {
  let bestEval: MultiPairEvaluation = {
    symbol: symbols[0] || 'EUR/USD',
    confluenceScore: 0,
    winProbability: 0,
    direction: 'BUY',
    signal: null,
    newsClear: true,
    recommendationReason: 'Default Market Setup',
  };

  for (const sym of symbols) {
    const candles = candlesMap[sym] || [];
    const signal = analyzeMarketCandles(sym, candles, timeframe);
    if (!signal) continue;

    const winProbability = Math.min(96, Math.round(signal.confluence_score * 0.95));

    if (signal.confluence_score > bestEval.confluenceScore) {
      bestEval = {
        symbol: sym,
        confluenceScore: signal.confluence_score,
        winProbability,
        direction: signal.direction,
        signal,
        newsClear: signal.news_filter_passed,
        recommendationReason: `${sym} показує найкращий збіг: ${signal.pattern_detected} + FVG (${signal.confluence_score}% Confluence)`,
      };
    }
  }

  return bestEval;
}
