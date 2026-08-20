'use client';

import React, { useState, useEffect } from 'react';
import { QuantAnalysisResult } from '@/lib/analytics/quant';
import { EconomicCalendarEvent } from '@/lib/news/finnhub';
import { Language, getTranslation } from '@/lib/i18n';
import { Gauge, Flame, Newspaper, TrendingUp, TrendingDown } from 'lucide-react';

interface QuantMetricsPanelProps {
  quant: QuantAnalysisResult;
  symbol: string;
  lang?: Language;
  dataSource?: 'LIVE' | 'SIMULATED' | null;
}

export const QuantMetricsPanel: React.FC<QuantMetricsPanelProps> = ({ quant, symbol, lang = 'uk', dataSource }) => {
  const t = getTranslation(lang);
  const zAbs = Math.min(3, Math.abs(quant.zScore));
  const zPercentage = (zAbs / 3) * 100;

  const [nextEvent, setNextEvent] = useState<EconomicCalendarEvent | null>(null);
  const [newsRisk, setNewsRisk] = useState<'SAFE' | 'RISK' | 'UNKNOWN'>('UNKNOWN');

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/news/calendar?symbol=${encodeURIComponent(symbol)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const events: EconomicCalendarEvent[] = data.events || [];
        if (data.source !== 'LIVE') {
          setNewsRisk('UNKNOWN');
          setNextEvent(null);
          return;
        }
        const now = Date.now();
        const upcoming = events.find((e) => new Date(e.scheduledAt).getTime() >= now) || events[0] || null;
        setNextEvent(upcoming);
        const hasImminentHighImpact = events.some(
          (e) => e.impact === 'HIGH' && Math.abs(new Date(e.scheduledAt).getTime() - now) <= 30 * 60 * 1000
        );
        setNewsRisk(hasImminentHighImpact ? 'RISK' : 'SAFE');
      })
      .catch(() => {
        if (!cancelled) {
          setNewsRisk('UNKNOWN');
          setNextEvent(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return (
    <div className="w-full neo-panel rounded-[3px] p-3.5 space-y-3 shadow-xl neo-hud-bracket font-neo-mono shrink-0">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-[#00F5D4]" />
          <h3 className="font-extrabold text-[#E2E8F0] text-xs tracking-wider uppercase flex items-center gap-2 font-neo-display">
            <span>{t.quantMetricsTitle}</span>
            <span className="neo-hud-badge">
              {'// QUANT RADAR'}
            </span>
            {dataSource && (
              <span
                className={`neo-hud-badge ${
                  dataSource === 'LIVE' ? '!text-[#00FF9D] !border-[#00FF9D]/40' : '!text-[#FFB800] !border-[#FFB800]/40'
                }`}
                title={dataSource === 'SIMULATED' ? 'TWELVE_DATA_API_KEY не налаштовано — дані симульовані' : 'Twelve Data live feed'}
              >
                [DATA::{dataSource}]
              </span>
            )}
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
            <span
              className={`neo-hud-badge ${
                newsRisk === 'RISK' ? '!text-[#FF2A6D] !border-[#FF2A6D]/40' : ''
              }`}
            >
              {newsRisk === 'RISK' ? t.risk : newsRisk === 'SAFE' ? t.safe : 'N/A'}
            </span>
          </div>
          <div className="text-xs text-[#E2E8F0] truncate font-bold">
            {nextEvent?.title || 'Немає найближчих подій'}
          </div>
          <div className="text-[9px] text-[#FFB800] font-mono-num font-bold">
            {nextEvent ? `${nextEvent.currency} • ${nextEvent.impact} IMPACT` : '—'}
          </div>
        </div>
      </div>
    </div>
  );
};
