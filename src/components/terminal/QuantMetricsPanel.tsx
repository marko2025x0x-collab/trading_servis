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
    <div className="w-full neo-panel rounded-[3px] p-3.5 space-y-3 shadow-xl neo-hud-bracket font-neo-mono shrink-0">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-[#00F5D4]" />
          <h3 className="font-extrabold text-[#E2E8F0] text-xs tracking-wider uppercase flex items-center gap-2 font-neo-display">
            <span>{t.quantMetricsTitle}</span>
            <span className="neo-hud-badge">
              // QUANT RADAR
            </span>
          </h3>
        </div>
        <span className="text-[10px] text-[#94A3B8] font-mono-num">{t.calculatedFor} [{symbol}]</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Z-Score Card */}
        <div className="p-3 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] space-y-2 font-mono-num">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#94A3B8] font-medium">{t.zScoreTitle}</span>
            <span
              className={`font-extrabold ${
                quant.zScore > 1.8
                  ? 'text-[#FF2A6D]'
                  : quant.zScore < -1.8
                  ? 'text-[#00FF9D]'
                  : 'text-[#E2E8F0]'
              }`}
            >
              {quant.zScore > 0 ? `+${quant.zScore}` : quant.zScore}
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#0F172A] rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${
                quant.zScore > 0 ? 'bg-[#FF2A6D]' : 'bg-[#00FF9D]'
              }`}
              style={{ width: `${zPercentage}%` }}
            />
          </div>

          <div className="text-[9px] text-[#94A3B8] flex items-center justify-between font-mono">
            <span>{t.oversold}</span>
            <span>{t.overbought}</span>
          </div>
        </div>

        {/* ATR Volatility Card */}
        <div className="p-3 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] space-y-1 font-mono-num">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#94A3B8] font-medium">{t.atrTitle}</span>
            <Flame className="w-3.5 h-3.5 text-[#FFB800]" />
          </div>
          <div className="text-lg font-extrabold text-[#E2E8F0]">{quant.atr}</div>
          <div className="text-[9px] text-[#94A3B8] font-mono">{t.dynamicStop}</div>
        </div>

        {/* Momentum Card */}
        <div className="p-3 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] space-y-1 font-mono-num">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#94A3B8] font-medium">{t.momentumTitle}</span>
            {quant.momentumScore > 50 ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#00FF9D]" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#FF2A6D]" />
            )}
          </div>
          <div className="text-lg font-extrabold text-[#00F5D4]">{quant.momentumScore}%</div>
          <div className="text-[9px] text-[#94A3B8] font-mono">{t.multiTfRoc}</div>
        </div>

        {/* News Filter Card */}
        <div className="p-3 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#94A3B8] font-medium flex items-center gap-1">
              <Newspaper className="w-3.5 h-3.5 text-[#00F5D4]" /> {t.fundamentalRadar}
            </span>
            <span className="neo-hud-badge">
              {t.safe}
            </span>
          </div>
          <div className="text-xs text-[#E2E8F0] truncate font-bold">
            {getSymbolFundamentalNews(symbol)[0]?.title || DYNAMIC_SYMBOL_NEWS_FEED[0].title}
          </div>
          <div className="text-[9px] text-[#FFB800] font-mono-num font-bold">
            {getSymbolFundamentalNews(symbol)[0]?.currency || 'USD'} • High Impact
          </div>
        </div>
      </div>
    </div>
  );
};
