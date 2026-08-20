import { NextRequest, NextResponse } from 'next/server';
import { fetchQuote, fetchCandles } from '@/lib/marketData/twelveData';

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol') || 'EUR/USD';

  const quote = await fetchQuote(symbol);
  if (quote) {
    return NextResponse.json({ price: quote.price, source: 'LIVE' });
  }

  // No Twelve Data key configured — fall back to the last simulated candle's close,
  // clearly flagged so callers (e.g. closing a journal trade) know it's not a real price.
  const { candles, source } = await fetchCandles(symbol, '15m', 5);
  const last = candles[candles.length - 1];
  return NextResponse.json({ price: last?.close ?? null, source });
}
