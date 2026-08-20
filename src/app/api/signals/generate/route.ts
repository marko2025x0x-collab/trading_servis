import { NextRequest, NextResponse } from 'next/server';
import { processSignalMatrix } from '@/lib/analytics/engine';
import { fetchCandles } from '@/lib/marketData/twelveData';
import { ConfluenceWeights } from '@/lib/journal/aiOptimizer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const symbol = body.symbol || 'EUR/USD';
    const forceBypassNews = body.forceBypassNews || false;
    const weights: ConfluenceWeights | undefined = body.weights;

    const { candles, source, stale, error: dataError } = await fetchCandles(symbol, '15m', 40);
    const result = weights
      ? await processSignalMatrix(symbol, candles, '15m', forceBypassNews, stale, weights)
      : await processSignalMatrix(symbol, candles, '15m', forceBypassNews, stale);

    return NextResponse.json({ ...result, dataSource: source, dataSourceError: dataError });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate signal' },
      { status: 500 }
    );
  }
}
