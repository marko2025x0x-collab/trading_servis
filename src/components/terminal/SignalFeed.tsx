'use client';

import React from 'react';
import { Signal } from '@/types';
import { Language, getTranslation } from '@/lib/i18n';
import { ShieldCheck, Zap, ArrowUpRight, ArrowDownRight, Layers, Sparkles } from 'lucide-react';

interface SignalFeedProps {
  signals: Signal[];
  selectedSignal: Signal | null;
  onSelectSignal: (sig: Signal) => void;
  onTriggerScan: () => void;
  isScanning: boolean;
  lang?: Language;
}

export const SignalFeed: React.FC<SignalFeedProps> = ({
  signals,
  selectedSignal,
  onSelectSignal,
  onTriggerScan,
  isScanning,
  lang = 'uk',
}) => {
  const t = getTranslation(lang);

  return (
    <div className="w-full h-full bg-[#0d1424] border border-slate-800/80 rounded-lg flex flex-col overflow-hidden shadow-2xl">
      {/* Header Panel */}
      <div className="p-3.5 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Zap className="w-4 h-4 text-sky-400" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
          </div>
          <h2 className="font-semibold text-slate-100 text-sm tracking-wide">{t.liveSignals}</h2>
        </div>

        <button
          onClick={onTriggerScan}
          disabled={isScanning}
          className="flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded text-xs font-mono font-bold transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? t.scanning : t.scanMarket}
        </button>
      </div>

      {/* Signal Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-2">
        {signals.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
            {t.noSignals}
          </div>
        ) : (
          signals.map((sig) => {
            const isSelected = selectedSignal?.id === sig.id;
            const isBuy = sig.direction === 'BUY';

            return (
              <div
                key={sig.id}
                onClick={() => onSelectSignal(sig)}
                className={`p-3 rounded-lg border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? isBuy
                      ? 'bg-emerald-950/25 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                      : 'bg-rose-950/25 border-rose-500/50 shadow-lg shadow-rose-950/20'
                    : 'bg-[#111827]/80 hover:bg-[#1f293d]/80 border-slate-800/90'
                }`}
              >
                {/* Confluence score top badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-num font-bold text-slate-100 text-sm tracking-tight">
                      {sig.symbol}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        isBuy
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {isBuy ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {sig.direction}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{sig.timeframe}</span>
                    <div className="flex items-center gap-1 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3 text-sky-400" />
                      <span className="font-mono-num text-xs font-bold text-sky-300">
                        {sig.confluence_score}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Entry / SL / TP Grid */}
                <div className="grid grid-cols-3 gap-1 bg-[#090d16]/80 p-2 rounded border border-slate-800/60 font-mono-num text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">{t.entry}</div>
                    <div className="text-slate-200 font-medium">{sig.entry}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-rose-400">{t.stopLoss}</div>
                    <div className="text-rose-300 font-medium">{sig.sl}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-400">{t.takeProfit}</div>
                    <div className="text-emerald-300 font-medium">{sig.tp}</div>
                  </div>
                </div>

                {/* Pattern & Technical tags */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">
                      {sig.pattern_detected}
                    </span>
                    {sig.smc_confluence.fvg_detected && (
                      <span className="px-1.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800/40 rounded text-[10px]">
                        FVG
                      </span>
                    )}
                    {sig.smc_confluence.bos_detected && (
                      <span className="px-1.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-800/40 rounded text-[10px]">
                        BOS
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono" suppressHydrationWarning>
                    {new Date(sig.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
