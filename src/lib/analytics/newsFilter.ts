import { EconomicNewsEvent } from '@/types';

export interface SymbolNewsItem {
  id: string;
  title: string;
  category: 'MACRO' | 'CENTRAL_BANK' | 'CRYPTO' | 'EQUITY' | 'GEO_POLITICAL';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  currency: string;
  scheduledAt: string;
  summary: string;
  affectedSymbols: string[];
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export interface NewsFilterResult {
  passed: boolean;
  upcomingEvent?: EconomicNewsEvent | SymbolNewsItem;
  reason: string;
}

export const DYNAMIC_SYMBOL_NEWS_FEED: SymbolNewsItem[] = [
  // EUR / USD
  {
    id: 'news-eur-1',
    title: 'Рішення ЄЦБ щодо процентної ставки (ECB Rate Decision)',
    category: 'CENTRAL_BANK',
    impact: 'HIGH',
    currency: 'EUR',
    scheduledAt: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    summary: 'Європейський центробанк оголосить рішення щодо облікової ставки. Очікується зниження на 25 б.п.',
    affectedSymbols: ['EUR/USD', 'EUR/GBP', 'EUR/JPY'],
    sentiment: 'BEARISH',
  },
  {
    id: 'news-usd-1',
    title: 'US CPI Inflation Rate (Рівень інфляції у США)',
    category: 'MACRO',
    impact: 'HIGH',
    currency: 'USD',
    scheduledAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    summary: 'Публікація індексу споживчих цін США. Прогноз: 2.9% YoY.',
    affectedSymbols: ['EUR/USD', 'BTC/USD', 'XAU/USD', 'GBP/USD', 'NVDA'],
    sentiment: 'NEUTRAL',
  },

  // BTC / USD & SOL / USDT
  {
    id: 'news-btc-1',
    title: 'Приплив капіталу в Spot Bitcoin ETF (+$420M)',
    category: 'CRYPTO',
    impact: 'HIGH',
    currency: 'BTC',
    scheduledAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    summary: 'Інституційні фонди BlackRock та Fidelity зафіксували рекордний чистий приплив у $420M за добу.',
    affectedSymbols: ['BTC/USD', 'SOL/USDT', 'ETH/USD'],
    sentiment: 'BULLISH',
  },
  {
    id: 'news-sol-1',
    title: 'Оновлення мережі Solana Firedancer & TVL Growth',
    category: 'CRYPTO',
    impact: 'MEDIUM',
    currency: 'SOL',
    scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    summary: 'TVL в екосистемі Solana досяг нового річного максимуму завдяки запуску нових DEX пулів.',
    affectedSymbols: ['SOL/USDT', 'BTC/USD'],
    sentiment: 'BULLISH',
  },

  // XAU / USD (Gold)
  {
    id: 'news-xau-1',
    title: 'Закупівля золота Центральними Банками & Геополітичний ризик',
    category: 'GEO_POLITICAL',
    impact: 'HIGH',
    currency: 'XAU',
    scheduledAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    summary: 'Центробанки Азії збільшили резерви золота на 14 тонн на тлі послаблення долара США.',
    affectedSymbols: ['XAU/USD', 'EUR/USD'],
    sentiment: 'BULLISH',
  },

  // NVDA & Tech Stocks
  {
    id: 'news-nvda-1',
    title: 'Квартальний звіт Nvidia (NVDA Q3 Earnings & AI Microchips Demand)',
    category: 'EQUITY',
    impact: 'HIGH',
    currency: 'USD',
    scheduledAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    summary: 'Аналітики прогнозують зростання виручки NVDA на 112% завдяки попиту на чіпи H100/Blackwell.',
    affectedSymbols: ['NVDA', 'BTC/USD'],
    sentiment: 'BULLISH',
  },
];

/**
 * Returns news filtered specifically for the selected symbol
 */
export function getSymbolFundamentalNews(symbol: string): SymbolNewsItem[] {
  const cleanSym = symbol.toUpperCase();
  return DYNAMIC_SYMBOL_NEWS_FEED.filter(
    (item) =>
      item.affectedSymbols.includes(cleanSym) ||
      cleanSym.includes(item.currency) ||
      (item.currency === 'USD' && (cleanSym.includes('USD') || cleanSym.includes('BTC') || cleanSym.includes('XAU')))
  );
}

export function checkFundamentalNewsFilter(
  symbol: string,
  newsEvents: SymbolNewsItem[] = DYNAMIC_SYMBOL_NEWS_FEED,
  windowMinutes = 30
): NewsFilterResult {
  const symbolNews = getSymbolFundamentalNews(symbol);
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;

  for (const item of symbolNews) {
    if (item.impact !== 'HIGH') continue;

    const eventTime = new Date(item.scheduledAt).getTime();
    const timeDiff = Math.abs(eventTime - now);

    if (timeDiff <= windowMs) {
      const minsLeft = Math.round((eventTime - now) / (60 * 1000));
      return {
        passed: false,
        upcomingEvent: item,
        reason: `Важлива економічна новина "${item.title}" (${item.currency}) за ${minsLeft} хв. Сигнал згенеровано з підвищеним ризиком.`,
      };
    }
  }

  return {
    passed: true,
    reason: `Фундаментальний фон чистий. Важливих новин протягом ${windowMinutes} хвилин не виявлено.`,
  };
}
