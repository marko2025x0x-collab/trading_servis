'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { OpportunitySetup } from '@/lib/analytics/opportunityRadar';
import { Language, getTranslation } from '@/lib/i18n';
import { Sparkles, X, ShieldCheck, ArrowUpRight, ArrowDownRight, Loader2, RefreshCw } from 'lucide-react';

interface TopOpportunitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (symbol: string) => void;
  lang: Language;
}

export const TopOpportunitiesModal: React.FC<TopOpportunitiesModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol,
  lang,
}) => {
  const t = getTranslation(lang);
  const [setups, setSetups] = useState<OpportunitySetup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOpportunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/opportunities/scan');
      const data = await res.json();
      setSetups(data.setups || []);
      if (data.error) setError(data.error);
    } catch {
      setError('Не вдалося просканувати ринок.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadOpportunities();
    }
  }, [isOpen, loadOpportunities]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 bg-[#090d16] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Sparkles className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-sm tracking-wide flex items-center gap-2">
                {t.topOpportunities}
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono">
                  {t.highWinRateFilter}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Реальний скан watchlist через Confluence Matrix (candlestick + SMC + quant + news)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadOpportunities}
              disabled={loading}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              title="Оновити"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Setups list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono-num">
          {loading ? (
            <div className="p-8 flex items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Сканування watchlist...
            </div>
          ) : error && setups.length === 0 ? (
            <div className="p-8 text-center text-amber-400 border border-amber-500/30 rounded-lg bg-amber-500/5">
              {error}
            </div>
          ) : (
            setups.map((setup) => (
              <div
                key={setup.symbol}
                className="p-4 bg-[#111827] border border-slate-800 hover:border-sky-500/50 rounded-xl transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-extrabold text-slate-100 text-base">{setup.symbol}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${
                        setup.direction === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {setup.direction === 'BUY' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {setup.direction}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{setup.timeframe}</span>
                    {setup.dataSource === 'SIMULATED' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        SIMULATED
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <div
                      className={`px-2.5 py-1 border rounded text-xs font-bold flex items-center gap-1 ${
                        setup.isActionable
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Confluence: {setup.confluenceScore}%
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#090d16] border border-slate-800 rounded-lg text-xs text-slate-300 leading-relaxed font-sans">
                  <span className="font-bold text-sky-400 font-mono">Аналітика: </span>
                  {lang === 'uk' ? setup.reasonUa : setup.reasonEn}
                  {!setup.isActionable && (
                    <span className="block mt-1 text-amber-400">
                      Score ≤ 80 — не досягає порогу дійсного сигналу, лише спостереження.
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#090d16] p-2.5 rounded border border-slate-800/80 text-xs font-mono text-center">
                  <div>
                    <div className="text-[10px] text-slate-400">ENTRY</div>
                    <div className="text-slate-100 font-medium">{setup.entry}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-rose-400">STOP LOSS</div>
                    <div className="text-rose-400 font-medium">{setup.sl}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-400">TAKE PROFIT</div>
                    <div className="text-emerald-400 font-medium">{setup.tp}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectSymbol(setup.symbol);
                    onClose();
                  }}
                  className="w-full py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg font-mono text-xs font-bold transition-all"
                >
                  Відкрити графік {setup.symbol} у терміналі
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
