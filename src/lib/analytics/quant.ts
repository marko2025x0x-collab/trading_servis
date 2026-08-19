import { MarketCandle } from '@/types';

export interface QuantAnalysisResult {
  zScore: number;
  atr: number;
  momentumScore: number; // 0 to 100
  meanReversionSignal: 'OVERBOUGHT' | 'OVERSOLD' | 'NEUTRAL';
  quantScore: number; // 0 to 100
}

/**
 * Quantitative Math Module (Z-Score, ATR Volatility, Momentum Engine)
 */
export function analyzeQuant(candles: MarketCandle[], period = 20): QuantAnalysisResult {
  if (candles.length < period) {
    return {
      zScore: 0,
      atr: 0.0010,
      momentumScore: 50,
      meanReversionSignal: 'NEUTRAL',
      quantScore: 50,
    };
  }

  const recentCandles = candles.slice(-period);
  const closePrices = recentCandles.map((c) => c.close);

  // 1. Calculate Simple Moving Average (SMA)
  const mean = closePrices.reduce((sum, val) => sum + val, 0) / period;

  // 2. Calculate Standard Deviation & Z-Score
  const variance = closePrices.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
  const stdDev = Math.sqrt(variance) || 0.0001;

  const currentPrice = candles[candles.length - 1].close;
  const zScore = (currentPrice - mean) / stdDev;

  let meanReversionSignal: 'OVERBOUGHT' | 'OVERSOLD' | 'NEUTRAL' = 'NEUTRAL';
  if (zScore > 2.0) meanReversionSignal = 'OVERBOUGHT';
  if (zScore < -2.0) meanReversionSignal = 'OVERSOLD';

  // 3. Calculate Average True Range (ATR)
  let trSum = 0;
  for (let i = 1; i < recentCandles.length; i++) {
    const high = recentCandles[i].high;
    const low = recentCandles[i].low;
    const prevClose = recentCandles[i - 1].close;

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trSum += tr;
  }
  const atr = trSum / (period - 1);

  // 4. Momentum Score (Rate of Change + Price relative to SMA)
  const firstPrice = recentCandles[0].close;
  const roc = ((currentPrice - firstPrice) / firstPrice) * 100;
  
  // Normalize momentum to scale 0 to 100
  let momentumScore = Math.min(100, Math.max(0, 50 + roc * 25));

  // Quant score combines mean-reversion opportunity with strong directional momentum
  let quantScore = 50;

  if (zScore < -1.8) {
    // Highly oversold, prime mean-reversion BUY
    quantScore = 90;
  } else if (zScore > 1.8) {
    // Highly overbought, prime mean-reversion SELL
    quantScore = 90;
  } else {
    // Trend continuation mode
    quantScore = 60 + Math.min(30, Math.abs(roc) * 10);
  }

  return {
    zScore: parseFloat(zScore.toFixed(3)),
    atr: parseFloat(atr.toFixed(5)),
    momentumScore: parseFloat(momentumScore.toFixed(1)),
    meanReversionSignal,
    quantScore: Math.min(100, Math.round(quantScore)),
  };
}
