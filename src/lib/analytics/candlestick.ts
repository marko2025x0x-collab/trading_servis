import { MarketCandle, PatternType } from '@/types';

export interface CandlestickAnalysisResult {
  pattern: PatternType | 'NONE';
  bullish: boolean;
  score: number; // 0 to 100
  description: string;
}

/**
 * Technical Candlestick Pattern Detector
 */
export function analyzeCandlestickPattern(candles: MarketCandle[]): CandlestickAnalysisResult {
  if (candles.length < 3) {
    return { pattern: 'NONE', bullish: false, score: 0, description: 'Insufficient candle data' };
  }

  const current = candles[candles.length - 1];
  const previous = candles[candles.length - 2];
  const prevTwo = candles[candles.length - 3];

  const bodyCurrent = Math.abs(current.close - current.open);
  const totalRangeCurrent = current.high - current.low;
  const upperWickCurrent = current.high - Math.max(current.open, current.close);
  const lowerWickCurrent = Math.min(current.open, current.close) - current.low;

  // 1. Detect Pin Bar / Hammer
  if (totalRangeCurrent > 0 && lowerWickCurrent / totalRangeCurrent >= 0.60 && bodyCurrent / totalRangeCurrent <= 0.25) {
    return {
      pattern: 'PIN_BAR',
      bullish: true,
      score: 85,
      description: 'Bullish Pin Bar / Hammer rejected lower prices with high conviction wick',
    };
  }

  if (totalRangeCurrent > 0 && upperWickCurrent / totalRangeCurrent >= 0.60 && bodyCurrent / totalRangeCurrent <= 0.25) {
    return {
      pattern: 'PIN_BAR',
      bullish: false,
      score: 85,
      description: 'Bearish Shooting Star / Pin Bar rejected higher prices with long upper wick',
    };
  }

  // 2. Detect Bullish Engulfing
  const isPrevBearish = previous.close < previous.open;
  const isCurrBullish = current.close > current.open;
  if (isPrevBearish && isCurrBullish && current.close > previous.open && current.open < previous.close) {
    return {
      pattern: 'BULLISH_ENGULFING',
      bullish: true,
      score: 90,
      description: 'Bullish Engulfing candle completely overrides previous bearish range',
    };
  }

  // 3. Detect Bearish Engulfing
  const isPrevBullish = previous.close > previous.open;
  const isCurrBearish = current.close < current.open;
  if (isPrevBullish && isCurrBearish && current.close < previous.open && current.open > previous.close) {
    return {
      pattern: 'BEARISH_ENGULFING',
      bullish: false,
      score: 90,
      description: 'Bearish Engulfing candle completely absorbs previous bullish momentum',
    };
  }

  // 4. Detect Morning Star (3-candle bullish reversal)
  const isPrevTwoBearish = prevTwo.close < prevTwo.open;
  const isPrevDojiOrSmall = Math.abs(previous.close - previous.open) < (prevTwo.high - prevTwo.low) * 0.3;
  if (isPrevTwoBearish && isPrevDojiOrSmall && isCurrBullish && current.close > (prevTwo.open + prevTwo.close) / 2) {
    return {
      pattern: 'MORNING_STAR',
      bullish: true,
      score: 88,
      description: 'Morning Star 3-candle reversal pattern confirmed at demand zone',
    };
  }

  // 5. Detect Doji (Indecision)
  if (totalRangeCurrent > 0 && bodyCurrent / totalRangeCurrent <= 0.1) {
    return {
      pattern: 'DOJI',
      bullish: current.close >= current.open,
      score: 60,
      description: 'Doji neutral indecision candle formed',
    };
  }

  return { pattern: 'NONE', bullish: current.close > current.open, score: 30, description: 'Standard price movement' };
}
