import { NextRequest, NextResponse } from 'next/server';
import { fetchEconomicCalendar, currenciesForSymbol } from '@/lib/news/finnhub';

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol') || 'EUR/USD';
  const { events, source, error } = await fetchEconomicCalendar();

  const relevantCurrencies = currenciesForSymbol(symbol);
  const symbolEvents = events
    .filter((e) => relevantCurrencies.includes(e.currency))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  return NextResponse.json({ events: symbolEvents, source, error: error || null });
}
