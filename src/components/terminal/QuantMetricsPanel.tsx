'use client';

import React from 'react';
import { QuantAnalysisResult } from '@/lib/analytics/quant';
import { DYNAMIC_SYMBOL_NEWS_FEED, getSymbolFundamentalNews } from '@/lib/analytics/newsFilter';
import { Language, getTranslation } from '@/lib/i18n';
import { Gauge, Flame, Newspaper, TrendingUp, TrendingDown } from 'lucide-react';

interface QuantMetricsPanelProps {
  quant: QuantAnalysisResult;
  symbol: string;
  lang?: Language;
}

export const QuantMetricsPanel: React.FC<QuantMetricsPanelProps> = ({ quant, symbol, lang = 'uk' }) => {
  const t = getTranslation(lang);
  const zAbs = Math.min(3, Math.abs(quant.zScore));
  const zPercentage = (zAbs / 3) * 100;

  return (
    <div className="w-full bg-[#0d1424] border border-slate-800/80 rounded-lg p-3.5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-sky-400" />
          <h3 className="font-semibold text-slate-200 text-xs tracking-wide">{t.quantMetricsTitle}</h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">{t.calculatedFor} {symbol}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Z-Score Card */}
        <div className="p-3 bg-[#111827] border border-slate-800 rounded-lg space-y-2 font-mono-num">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{t.zScoreTitle}</span>
            <span
              className={`font-bold ${
                quant.zScore > 1.8
                  ? 'text-rose-400'
                  : quant.zScore < -1.8
                  ? 'text-emerald-400'
                  : 'text-slate-300'
              }`}
            >
              {quant.zScore > 0 ? `+${quant.zScore}` : quant.zScore}
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${
                quant.zScore > 0 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${zPercentage}%` }}
            />
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>{t.oversold}</span>
            <span>{t.overbought}</span>
          </div>
        </div>

        {/* ATR Volatility Card */}
        <div className="p-3 bg-[#111827] border border-slate-800 rounded-lg space-y-1 font-mono-num">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{t.atrTitle}</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-slate-100">{quant.atr}</div>
          <div className="text-[10px] text-slate-400 font-mono">{t.dynamicStop}</div>
        </div>

        {/* Momentum Card */}
        <div className="p-3 bg-[#111827] border border-slate-800 rounded-lg space-y-1 font-mono-num">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{t.momentumTitle}</span>
            {quant.momentumScore > 50 ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            )}
          </div>
          <div className="text-lg font-bold text-sky-400">{quant.momentumScore}%</div>
          <div className="text-[10px] text-slate-400 font-mono">{t.multiTfRoc}</div>
        </div>

        {/* News Filter Card */}
        <div className="p-3 bg-[#111827] border border-slate-800 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Newspaper className="w-3.5 h-3.5 text-sky-400" /> {t.fundamentalRadar}
            </span>
            <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-mono font-bold">
              {t.safe}
            </span>
          </div>
          <div className="text-xs text-slate-300 truncate font-semibold">
            {getSymbolFundamentalNews(symbol)[0]?.title || DYNAMIC_SYMBOL_NEWS_FEED[0].title}
          </div>
          <div className="text-[10px] text-amber-400 font-mono">
            {getSymbolFundamentalNews(symbol)[0]?.currency || 'USD'} • High Impact
          </div>
        </div>
      </div>
    </div>
  );
};
