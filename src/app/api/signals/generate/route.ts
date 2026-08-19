import { NextRequest, NextResponse } from 'next/server';
import { processSignalMatrix } from '@/lib/analytics/engine';
import { MarketCandle } from '@/types';

// Helper to generate realistic market candle dataset for analytical testing
function generateCandlesForSymbol(symbol: string): MarketCandle[] {
  const candles: MarketCandle[] = [];
  let basePrice = symbol.includes('BTC')
    ? 64500
    : symbol.includes('XAU')
    ? 2480
    : symbol.includes('ETH')
    ? 3450
    : 1.0850;

  const now = Math.floor(Date.now() / 1000);
  const interval = 15 * 60; // 15 mins

  for (let i = 40; i >= 0; i--) {
    const timestamp = now - i * interval;
    const volatility = basePrice * 0.002;
    const change = (Math.random() - 0.48) * volatility;
    const open = basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 5000 + 1000);

    candles.push({
      timestamp,
      open: parseFloat(open.toFixed(5)),
      high: parseFloat(high.toFixed(5)),
      low: parseFloat(low.toFixed(5)),
      close: parseFloat(close.toFixed(5)),
      volume,
    });

    basePrice = close;
  }

  return candles;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const symbol = body.symbol || 'EUR/USD';
    const forceBypassNews = body.forceBypassNews || false;

    const candles = generateCandlesForSymbol(symbol);
    const result = processSignalMatrix(symbol, candles, '15m', forceBypassNews);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate signal' },
      { status: 500 }
    );
  }
}
