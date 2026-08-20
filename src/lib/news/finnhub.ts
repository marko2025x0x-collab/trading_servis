const BASE_URL = 'https://finnhub.io/api/v1';

export interface EconomicCalendarEvent {
  id: string;
  title: string;
  country: string;
  currency: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  scheduledAt: string; // ISO timestamp
  actual: string | null;
  estimate: string | null;
  previous: string | null;
}

interface FinnhubCalendarRaw {
  event: string;
  country: string;
  impact: string; // 'low' | 'medium' | 'high'
  time: string; // 'YYYY-MM-DD HH:mm:ss' UTC
  actual: number | null;
  estimate: number | null;
  prev: number | null;
}

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: 'USD',
  EU: 'EUR',
  GB: 'GBP',
  JP: 'JPY',
  CN: 'CNY',
  AU: 'AUD',
  CA: 'CAD',
  CH: 'CHF',
  NZ: 'NZD',
};

let cache: { fetchedAt: number; events: EconomicCalendarEvent[] } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

function toIsoUtc(finnhubTime: string): string {
  // Finnhub returns "YYYY-MM-DD HH:mm:ss" in UTC without a timezone suffix.
  return new Date(`${finnhubTime.replace(' ', 'T')}Z`).toISOString();
}

/**
 * Fetches the real economic calendar from Finnhub for the next ~2 days
 * (today through tomorrow, covering timezone edge cases), cached for 5
 * minutes to stay well within free-tier rate limits.
 */
export async function fetchEconomicCalendar(): Promise<{
  events: EconomicCalendarEvent[];
  source: 'LIVE' | 'UNAVAILABLE';
  error?: string;
}> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return { events: [], source: 'UNAVAILABLE', error: 'FINNHUB_API_KEY is not configured' };
  }

  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return { events: cache.events, source: 'LIVE' };
  }

  const from = new Date();
  const to = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(
      `${BASE_URL}/calendar/economic?from=${fmt(from)}&to=${fmt(to)}&token=${apiKey}`,
      { signal: controller.signal, cache: 'no-store' }
    );
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { events: [], source: 'UNAVAILABLE', error: `Finnhub request failed (HTTP ${res.status})` };
    }

    const data: { economicCalendar?: FinnhubCalendarRaw[] } = await res.json();
    const raw = data.economicCalendar || [];

    const events: EconomicCalendarEvent[] = raw.map((e, idx) => ({
      id: `fh-${e.country}-${idx}-${e.time}`,
      title: e.event,
      country: e.country,
      currency: COUNTRY_TO_CURRENCY[e.country] || e.country,
      impact: (e.impact?.toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW') || 'LOW',
      scheduledAt: toIsoUtc(e.time),
      actual: e.actual !== null && e.actual !== undefined ? String(e.actual) : null,
      estimate: e.estimate !== null && e.estimate !== undefined ? String(e.estimate) : null,
      previous: e.prev !== null && e.prev !== undefined ? String(e.prev) : null,
    }));

    cache = { fetchedAt: Date.now(), events };
    return { events, source: 'LIVE' };
  } catch (err) {
    return {
      events: [],
      source: 'UNAVAILABLE',
      error: err instanceof Error ? err.message : 'Finnhub request failed',
    };
  }
}

/** Symbol → currency codes the event's `currency` must match to be considered relevant. */
export function currenciesForSymbol(symbol: string): string[] {
  const upper = symbol.toUpperCase();
  const found = new Set<string>();
  for (const code of ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF', 'NZD']) {
    if (upper.includes(code)) found.add(code);
  }
  if (upper.includes('XAU') || upper.includes('BTC') || upper.includes('ETH') || upper.includes('SOL')) {
    found.add('USD');
  }
  return Array.from(found);
}
