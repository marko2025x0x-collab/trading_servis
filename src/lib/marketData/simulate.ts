import { MarketCandle } from '@/types';

/**
 * SIMULATED market data — random-walk candles, not a real price feed.
 * No live market-data provider is wired up yet (see README/DESIGN notes).
 * Every signal, chart, and quant metric derived from this is for UI/demo
 * purposes only and must not be treated as real trading data.
 */
function basePriceForSymbol(symbol: string): number {
  if (symbol.includes('BTC')) return 69379.91;
  if (symbol.includes('XAU')) return 2485;
  if (symbol.includes('SOL')) return 142.5;
  if (symbol.includes('ETH')) return 3450;
  if (symbol.includes('NVDA')) return 128.4;
  return 1.0854;
}

function decimalsForSymbol(symbol: string): number {
  if (symbol.includes('SOL') || symbol.includes('NVDA') || symbol.includes('BTC')) return 2;
  return 5;
}

export function generateSimulatedCandles(
  symbol: string,
  count = 60,
  intervalSeconds = 15 * 60
): MarketCandle[] {
  const candles: MarketCandle[] = [];
  let basePrice = basePriceForSymbol(symbol);
  const decimals = decimalsForSymbol(symbol);
  const now = Math.floor(Date.now() / 1000);

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * intervalSeconds;
    const vol = basePrice * 0.002;
    const change = (Math.random() - 0.49) * vol;
    const open = basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) + Math.random() * vol * 0.4;
    const low = Math.min(open, close) - Math.random() * vol * 0.4;
    const volume = Math.floor(Math.random() * 4000 + 1200);

    candles.push({
      timestamp,
      open: parseFloat(open.toFixed(decimals)),
      high: parseFloat(high.toFixed(decimals)),
      low: parseFloat(low.toFixed(decimals)),
      close: parseFloat(close.toFixed(decimals)),
      volume,
    });

    basePrice = close;
  }

  return candles;
}
