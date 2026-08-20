import { NextRequest, NextResponse } from 'next/server';
import { fetchCandles } from '@/lib/marketData/twelveData';
import { Timeframe } from '@/types';

const VALID_TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1d'];

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol') || 'EUR/USD';
  const timeframeParam = request.nextUrl.searchParams.get('timeframe') || '15m';
  const timeframe = VALID_TIMEFRAMES.includes(timeframeParam as Timeframe)
    ? (timeframeParam as Timeframe)
    : '15m';
  const outputSize = Math.min(200, Math.max(10, Number(request.nextUrl.searchParams.get('count')) || 60));

  const result = await fetchCandles(symbol, timeframe, outputSize);
  return NextResponse.json(result);
}
