'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { EconomicCalendarEvent } from '@/lib/news/finnhub';
import { Language } from '@/lib/i18n';
import { Newspaper, X, ShieldAlert, Clock, Loader2 } from 'lucide-react';

interface FundamentalNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  lang: Language;
}

export const FundamentalNewsModal: React.FC<FundamentalNewsModalProps> = ({
  isOpen,
  onClose,
  symbol,
}) => {
  const [newsList, setNewsList] = useState<EconomicCalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'LIVE' | 'UNAVAILABLE' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCalendar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news/calendar?symbol=${encodeURIComponent(symbol)}`);
      const data = await res.json();
      setNewsList(data.events || []);
      setSource(data.source);
      setError(data.error);
    } catch {
      setSource('UNAVAILABLE');
      setError('Не вдалося завантажити економічний календар.');
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadCalendar();
    }
  }, [isOpen, loadCalendar]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#090d16] border border-slate-700/80 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in duration-200 font-sans">
        {/* Header */}
        <div className="p-4 bg-[#0d1424] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-100 text-sm tracking-wider flex items-center gap-2 font-mono">
                ЕКОНОМІЧНИЙ КАЛЕНДАР: <span className="text-cyan-400 font-extrabold">{symbol}</span>
                <span
                  className={`px-2 py-0.5 rounded border text-[10px] ${
                    source === 'LIVE'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {source === 'LIVE' ? 'FINNHUB LIVE' : 'ФІЛЬТР ВИМКНЕНО'}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Реальний економічний календар Finnhub для валют, що впливають на пару
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Algorithm Risk Protocol Banner */}
        <div className="p-3 bg-[#0d1424] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              HIGH-impact події в межах 30 хв блокують генерацію сигналів (Confluence Matrix).
            </span>
          </div>
          <span
            className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
              source === 'LIVE'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {source === 'LIVE' ? 'ФІЛЬТР АКТИВНИЙ' : 'НЕ НАЛАШТОВАНО'}
          </span>
        </div>

        {/* News Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {loading ? (
            <div className="p-8 flex items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Завантаження календаря...
            </div>
          ) : error && source === 'UNAVAILABLE' ? (
            <div className="p-8 text-center text-amber-400 border border-amber-500/30 rounded-lg bg-amber-500/5">
              {error}
            </div>
          ) : newsList.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border border-slate-800 rounded-lg">
              Немає запланованих подій для пари {symbol} у найближчі 2 дні.
            </div>
          ) : (
            newsList.map((item) => {
              const isHigh = item.impact === 'HIGH';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all space-y-2 ${
                    isHigh ? 'bg-[#121929] border-cyan-500/40 shadow-lg' : 'bg-[#0d1424] border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isHigh
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {item.impact} IMPACT ({item.currency})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>
                        {new Date(item.scheduledAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm">{item.title}</h3>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-4 text-[11px] text-slate-400">
                    <span>Факт: <span className="text-slate-200 font-bold">{item.actual ?? '—'}</span></span>
                    <span>Прогноз: <span className="text-slate-200 font-bold">{item.estimate ?? '—'}</span></span>
                    <span>Попередній: <span className="text-slate-200 font-bold">{item.previous ?? '—'}</span></span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
