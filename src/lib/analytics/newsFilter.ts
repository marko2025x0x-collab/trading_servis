import { fetchEconomicCalendar, currenciesForSymbol, EconomicCalendarEvent } from '@/lib/news/finnhub';

export interface NewsFilterResult {
  passed: boolean;
  upcomingEvent?: EconomicCalendarEvent;
  reason: string;
}

/**
 * Blocks signal generation when a HIGH-impact economic event for the
 * symbol's underlying currencies falls within `windowMinutes` (real
 * Finnhub economic calendar). If Finnhub isn't configured, passes open
 * with a reason explaining the filter is inactive rather than silently
 * pretending the fundamental background is clean.
 */
export async function checkFundamentalNewsFilter(
  symbol: string,
  windowMinutes = 30
): Promise<NewsFilterResult> {
  const { events, source, error } = await fetchEconomicCalendar();

  if (source === 'UNAVAILABLE') {
    return {
      passed: true,
      reason: `Фундаментальний фільтр вимкнено: ${error || 'новинний провайдер не налаштований'}.`,
    };
  }

  const relevantCurrencies = currenciesForSymbol(symbol);
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;

  const symbolEvents = events.filter((e) => relevantCurrencies.includes(e.currency));

  for (const item of symbolEvents) {
    if (item.impact !== 'HIGH') continue;

    const eventTime = new Date(item.scheduledAt).getTime();
    const timeDiff = Math.abs(eventTime - now);

    if (timeDiff <= windowMs) {
      const minsLeft = Math.round((eventTime - now) / (60 * 1000));
      return {
        passed: false,
        upcomingEvent: item,
        reason: `Важлива економічна новина "${item.title}" (${item.currency}) за ${minsLeft} хв. Сигнал заблоковано через підвищений ризик.`,
      };
    }
  }

  return {
    passed: true,
    reason: `Фундаментальний фон чистий. Важливих новин протягом ${windowMinutes} хвилин не виявлено.`,
  };
}
