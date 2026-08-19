import { MarketCandle } from '@/types';

export interface SMCAnalysisResult {
  fvgDetected: boolean;
  bosDetected: boolean;
  chochDetected: boolean;
  liquiditySweep: boolean;
  bullishBias: boolean;
  smcScore: number; // 0 to 100
  notes: string[];
}

/**
 * Smart Money Concepts (SMC) Analytical Module
 */
export function analyzeSMC(candles: MarketCandle[]): SMCAnalysisResult {
  if (candles.length < 5) {
    return {
      fvgDetected: false,
      bosDetected: false,
      chochDetected: false,
      liquiditySweep: false,
      bullishBias: true,
      smcScore: 0,
      notes: ['Insufficient candles for SMC analysis'],
    };
  }

  const notes: string[] = [];
  const cCurrent = candles[candles.length - 1];
  const cPrev1 = candles[candles.length - 2];
  const cPrev2 = candles[candles.length - 3];
  const cPrev3 = candles[candles.length - 4];
  const cPrev4 = candles[candles.length - 5];

  // 1. Detect Fair Value Gap (FVG)
  // Bullish FVG: Low of candle 1 > High of candle 3
  const bullishFVG = cPrev1.low > cPrev3.high;
  // Bearish FVG: High of candle 1 < Low of candle 3
  const bearishFVG = cPrev1.high < cPrev3.low;
  const fvgDetected = bullishFVG || bearishFVG;

  if (bullishFVG) notes.push('Bullish Fair Value Gap (FVG) inefficiency identified');
  if (bearishFVG) notes.push('Bearish Fair Value Gap (FVG) inefficiency identified');

  // 2. Detect Break of Structure (BOS)
  const recentHigh = Math.max(cPrev2.high, cPrev3.high, cPrev4.high);
  const recentLow = Math.min(cPrev2.low, cPrev3.low, cPrev4.low);

  const bullishBOS = cCurrent.close > recentHigh;
  const bearishBOS = cCurrent.close < recentLow;
  const bosDetected = bullishBOS || bearishBOS;

  if (bullishBOS) notes.push('Bullish Break of Structure (BOS) above previous swing high');
  if (bearishBOS) notes.push('Bearish Break of Structure (BOS) below previous swing low');

  // 3. Detect Liquidity Sweep
  // Sweep occurs if high/low breaks structural swing but candle closes back inside range
  const bullishSweep = cCurrent.low < recentLow && cCurrent.close > recentLow;
  const bearishSweep = cCurrent.high > recentHigh && cCurrent.close < recentHigh;
  const liquiditySweep = bullishSweep || bearishSweep;

  if (bullishSweep) notes.push('Sell-side Liquidity Sweep below key support levels');
  if (bearishSweep) notes.push('Buy-side Liquidity Sweep above key resistance levels');

  // 4. Detect Change of Character (CHoCH)
  const chochDetected = liquiditySweep && bosDetected;
  if (chochDetected) notes.push('Change of Character (CHoCH) structural reversal confirmed');

  // Calculate SMC Score
  let score = 40;
  if (fvgDetected) score += 20;
  if (bosDetected) score += 20;
  if (liquiditySweep) score += 15;
  if (chochDetected) score += 15;

  const bullishBias = bullishBOS || bullishFVG || bullishSweep;

  return {
    fvgDetected,
    bosDetected,
    chochDetected,
    liquiditySweep,
    bullishBias,
    smcScore: Math.min(100, score),
    notes,
  };
}
