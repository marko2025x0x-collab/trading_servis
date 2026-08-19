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
    <div className="w-full h-full neo-panel rounded-[3px] flex flex-col overflow-hidden neo-hud-bracket font-neo-mono">
      {/* Header Panel */}
      <div className="p-3 bg-[#090E1C] border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Zap className="w-4 h-4 text-[#00F5D4]" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5D4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF9D]"></span>
            </span>
          </div>
          <h2 className="font-extrabold text-[#E2E8F0] text-xs tracking-wider uppercase flex items-center gap-1.5 font-neo-display">
            <span>{t.liveSignals}</span>
            <span className="neo-hud-badge">
              [SMC::MATRIX]
            </span>
          </h2>
        </div>

        <button
          onClick={onTriggerScan}
          disabled={isScanning}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#00F5D4]/10 hover:bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/30 rounded-[2px] text-xs font-neo-mono font-bold transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? t.scanning : t.scanMarket}
        </button>
      </div>

      {/* Signal Items List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {signals.length === 0 ? (
          <div className="p-8 text-center text-[#94A3B8] text-xs font-neo-mono">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#00F5D4]" />
            {t.noSignals}
          </div>
        ) : (
          signals.map((sig) => {
            const isSelected = selectedSignal?.id === sig.id;
            const isBuy = sig.direction === 'BUY';
            const isHighConfluence = sig.confluence_score >= 80;

            return (
              <div
                key={sig.id}
                onClick={() => onSelectSignal(sig)}
                className={`p-3 rounded-[3px] border transition-all cursor-pointer relative overflow-hidden font-neo-mono ${
                  isSelected
                    ? isBuy
                      ? 'bg-[#00FF9D]/10 border-[#00FF9D]/60 shadow-[0_0_15px_rgba(0,255,157,0.25)] glow-bullish'
                      : 'bg-[#FF2A6D]/10 border-[#FF2A6D]/60 shadow-[0_0_15px_rgba(255,42,109,0.25)] glow-bearish'
                    : 'bg-[#090E1C] hover:bg-[#0F172A] border-cyan-500/20'
                }`}
              >
                {/* Confluence score top badge with glow if > 80 score */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-num font-bold text-[#E2E8F0] text-sm tracking-tight">
                      {sig.symbol}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-[2px] text-[11px] font-extrabold ${
                        isBuy
                          ? 'bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/40'
                          : 'bg-[#FF2A6D]/15 text-[#FF2A6D] border border-[#FF2A6D]/40'
                      }`}
                    >
                      {isBuy ? <ArrowUpRight className="w-3 h-3 text-[#00FF9D]" /> : <ArrowDownRight className="w-3 h-3 text-[#FF2A6D]" />}
                      {sig.direction}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#94A3B8] uppercase font-mono">{sig.timeframe}</span>
                    <div
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-[2px] border ${
                        isHighConfluence
                          ? 'bg-[#00F5D4]/15 border-[#00F5D4]/60 text-[#00F5D4] shadow-[0_0_10px_rgba(0,245,212,0.3)]'
                          : 'bg-[#0F172A] border-cyan-500/20 text-[#94A3B8]'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3 text-[#00F5D4]" />
                      <span className="font-mono-num text-xs font-extrabold">
                        {sig.confluence_score}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Entry / SL / TP Matrix */}
                <div className="grid grid-cols-3 gap-1 bg-[#050811] p-2 rounded-[2px] border border-cyan-500/15 font-mono-num text-xs">
                  <div>
                    <div className="text-[9px] text-[#94A3B8] font-semibold">ENTRY</div>
                    <div className="text-[#00F5D4] font-bold">{sig.entry}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#FF2A6D] font-semibold">STOP</div>
                    <div className="text-[#FF2A6D] font-bold">{sig.sl}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#00FF9D] font-semibold">TARGET</div>
                    <div className="text-[#00FF9D] font-bold">{sig.tp}</div>
                  </div>
                </div>

                {/* Technical Tags & Timestamp */}
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.2 bg-[#0F172A] text-[#E2E8F0] border border-cyan-500/20 rounded-[2px]">
                      {sig.pattern_detected}
                    </span>
                    {sig.smc_confluence.fvg_detected && (
                      <span className="neo-hud-badge">
                        [SMC::FVG]
                      </span>
                    )}
                    {sig.smc_confluence.bos_detected && (
                      <span className="neo-hud-badge">
                        [SMC::BOS]
                      </span>
                    )}
                  </div>

                  <span className="text-[#94A3B8] font-mono-num" suppressHydrationWarning>
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
