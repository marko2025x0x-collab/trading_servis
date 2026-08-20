import { MarketCandle, Timeframe } from '@/types';
import { generateSimulatedCandles } from './simulate';

const BASE_URL = 'https://api.twelvedata.com';

const INTERVAL_MAP: Record<Timeframe, string> = {
  '1m': '1min',
  '5m': '5min',
  '15m': '15min',
  '1h': '1h',
  '4h': '4h',
  '1d': '1day',
};

/** Twelve Data uses `EUR/USD` for forex/metals and `BTC/USD` for crypto — matches our app's symbol format. */
function toTwelveDataSymbol(symbol: string): string {
  return symbol.toUpperCase();
}

interface TwelveDataSeriesValue {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume?: string;
}

interface TwelveDataSeriesResponse {
  values?: TwelveDataSeriesValue[];
  status?: string;
  code?: number;
  message?: string;
}

const TIMEFRAME_SECONDS: Record<Timeframe, number> = {
  '1m': 60,
  '5m': 5 * 60,
  '15m': 15 * 60,
  '1h': 60 * 60,
  '4h': 4 * 60 * 60,
  '1d': 24 * 60 * 60,
};

export interface CandleFetchResult {
  candles: MarketCandle[];
  source: 'LIVE' | 'SIMULATED';
  /** True when the newest candle is older than ~3 intervals — market likely closed or feed lagging. */
  stale: boolean;
  error?: string;
}

/**
 * Fetches real OHLCV candles from Twelve Data. Falls back to simulated
 * random-walk data (clearly flagged via `source`) when no API key is
 * configured or the request fails, so callers can degrade gracefully
 * instead of crashing the terminal.
 */
export async function fetchCandles(
  symbol: string,
  timeframe: Timeframe,
  outputSize = 60
): Promise<CandleFetchResult> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (!apiKey) {
    return {
      candles: generateSimulatedCandles(symbol, outputSize),
      source: 'SIMULATED',
      stale: false,
      error: 'TWELVE_DATA_API_KEY is not configured',
    };
  }

  const interval = INTERVAL_MAP[timeframe];
  const url = `${BASE_URL}/time_series?symbol=${encodeURIComponent(
    toTwelveDataSymbol(symbol)
  )}&interval=${interval}&outputsize=${outputSize}&apikey=${apiKey}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeoutId);

    const data: TwelveDataSeriesResponse = await res.json();

    if (!res.ok || data.status === 'error' || !data.values || data.values.length === 0) {
      return {
        candles: generateSimulatedCandles(symbol, outputSize),
        source: 'SIMULATED',
        stale: false,
        error: data.message || `Twelve Data request failed (HTTP ${res.status})`,
      };
    }

    // Twelve Data returns newest-first; the analytics engine expects oldest-first.
    const candles: MarketCandle[] = data.values
      .map((v) => ({
        timestamp: Math.floor(new Date(v.datetime).getTime() / 1000),
        open: parseFloat(v.open),
        high: parseFloat(v.high),
        low: parseFloat(v.low),
        close: parseFloat(v.close),
        volume: v.volume ? parseFloat(v.volume) : 0,
      }))
      .reverse();

    const newest = candles[candles.length - 1];
    const staleThresholdSec = TIMEFRAME_SECONDS[timeframe] * 3;
    const stale = newest ? Math.floor(Date.now() / 1000) - newest.timestamp > staleThresholdSec : true;

    return { candles, source: 'LIVE', stale };
  } catch (err) {
    return {
      candles: generateSimulatedCandles(symbol, outputSize),
      source: 'SIMULATED',
      stale: false,
      error: err instanceof Error ? err.message : 'Twelve Data request failed',
    };
  }
}

/** Fetches the latest real-time price quote, used to detect stale/simulated data and for slippage checks. */
export async function fetchQuote(symbol: string): Promise<{ price: number; timestamp: number } | null> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `${BASE_URL}/price?symbol=${encodeURIComponent(toTwelveDataSymbol(symbol))}&apikey=${apiKey}`,
      { signal: controller.signal, cache: 'no-store' }
    );
    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok || !data.price) return null;

    return { price: parseFloat(data.price), timestamp: Math.floor(Date.now() / 1000) };
  } catch {
    return null;
  }
}
