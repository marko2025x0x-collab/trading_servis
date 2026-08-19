'use client';

import React from 'react';
import { SymbolNewsItem, getSymbolFundamentalNews } from '@/lib/analytics/newsFilter';
import { Language, getTranslation } from '@/lib/i18n';
import { Newspaper, X, Flame, ShieldAlert, TrendingUp, TrendingDown, Clock, Sparkles } from 'lucide-react';

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
  lang,
}) => {
  const t = getTranslation(lang);
  const newsList = getSymbolFundamentalNews(symbol);

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
                ФУНДАМЕНТАЛЬНИЙ РАДАР НОВИН: <span className="text-cyan-400 font-extrabold">{symbol}</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px]">
                  LIVE AUTO-FILTER
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Динамічний аналіз новин для вибранної валютної пари перед відкриттям угод
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
              Алгоритм Nexus Quant враховує ці новини при розрахунку Risk Protocol та Confluence Score.
            </span>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
            ФІЛЬТР АКТИВНИЙ
          </span>
        </div>

        {/* News Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {newsList.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border border-slate-800 rounded-lg">
              Немає критичних новин для пара {symbol} у найближчому часовому вікні.
            </div>
          ) : (
            newsList.map((item) => {
              const isHigh = item.impact === 'HIGH';
              const isBull = item.sentiment === 'BULLISH';
              const isBear = item.sentiment === 'BEARISH';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all space-y-2 ${
                    isHigh
                      ? 'bg-[#121929] border-cyan-500/40 shadow-lg'
                      : 'bg-[#0d1424] border-slate-800'
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

                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm">{item.title}</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{item.summary}</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Вплив на ринок:</span>
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          isBull ? 'text-emerald-400' : isBear ? 'text-rose-400' : 'text-slate-300'
                        }`}
                      >
                        {isBull && <TrendingUp className="w-3.5 h-3.5" />}
                        {isBear && <TrendingDown className="w-3.5 h-3.5" />}
                        {item.sentiment}
                      </span>
                    </div>

                    <div className="text-slate-400">
                      Впливає на: <span className="text-cyan-400 font-bold">{item.affectedSymbols.join(', ')}</span>
                    </div>
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
