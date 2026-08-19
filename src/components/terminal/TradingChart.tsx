'use client';

import React, { useEffect, useRef } from 'react';
import { MarketCandle, Signal } from '@/types';
import { Language, getTranslation } from '@/lib/i18n';
import { ArrowUpRight, ArrowDownRight, Target, AlertCircle, ShieldCheck } from 'lucide-react';

interface TradingChartProps {
  symbol: string;
  candles: MarketCandle[];
  activeSignal?: Signal | null;
  timeframe: string;
  onTimeframeChange: (tf: '1m' | '5m' | '15m' | '1h' | '4h' | '1d') => void;
  lang?: Language;
}

// Convert user symbols (EUR/USD, SOL/USDT, BTC/USD) to TradingView Widget ticker format
function formatTradingViewSymbol(sym: string): string {
  const clean = sym.replace('/', '').toUpperCase();

  if (clean === 'EURUSD') return 'FX:EURUSD';
  if (clean === 'GBPUSD') return 'FX:GBPUSD';
  if (clean === 'USDJPY') return 'FX:USDJPY';
  if (clean === 'XAUUSD') return 'OANDA:XAUUSD';
  if (clean === 'BTCUSD' || clean === 'BTCUSDT') return 'BINANCE:BTCUSDT';
  if (clean === 'SOLUSD' || clean === 'SOLUSDT') return 'BINANCE:SOLUSDT';
  if (clean === 'ETHUSD' || clean === 'ETHUSDT') return 'BINANCE:ETHUSDT';
  if (clean === 'NVDA') return 'NASDAQ:NVDA';

  return `FX:${clean}`;
}

// Convert timeframe string to TradingView interval string
function formatTradingViewInterval(tf: string): string {
  if (tf === '1m') return '1';
  if (tf === '5m') return '5';
  if (tf === '15m') return '15';
  if (tf === '1h') return '60';
  if (tf === '4h') return '240';
  if (tf === '1d') return 'D';
  return '15';
}

export const TradingChart: React.FC<TradingChartProps> = ({
  symbol,
  activeSignal,
  timeframe,
  onTimeframeChange,
  lang = 'uk',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(lang);

  const tvSymbol = formatTradingViewSymbol(symbol);
  const tvInterval = formatTradingViewInterval(timeframe);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';
    const widgetContainerId = `tradingview_${Math.random().toString(36).substring(7)}`;

    const widgetDiv = document.createElement('div');
    widgetDiv.id = widgetContainerId;
    widgetDiv.style.width = '100%';
    widgetDiv.style.height = '100%';
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).TradingView) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: tvInterval,
          timezone: 'Europe/Kyiv',
          theme: 'dark',
          style: '1',
          locale: lang === 'uk' ? 'uk' : 'en',
          toolbar_bg: '#090d16',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: widgetContainerId,
          hide_side_toolbar: false,
          studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [tvSymbol, tvInterval, lang]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#090d16] border border-slate-800/80 rounded-lg overflow-hidden shadow-2xl">
      {/* Chart Control Bar */}
      <div className="px-4 py-2.5 bg-[#0f172a]/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 tracking-wider text-sm">{symbol}</span>
            <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
              TRADINGVIEW REALTIME FEED ({tvSymbol})
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-700/60" />

          {/* Timeframe Selector Pills */}
          <div className="flex items-center gap-1">
            {(['1m', '5m', '15m', '1h', '4h', '1d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-all ${
                  timeframe === tf
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {activeSignal && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">{t.entry}:</span>
            <span
              className={`font-mono-num font-bold px-2 py-0.5 rounded text-[11px] ${
                activeSignal.direction === 'BUY'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {activeSignal.direction} @ {activeSignal.entry}
            </span>
          </div>
        )}
      </div>

      {/* Official TradingView Advanced Widget Container */}
      <div className="relative w-full flex-1 min-h-[500px] bg-[#090d16]">
        <div ref={containerRef} className="w-full h-full" />

        {/* Step 4: Algorithmic Signal Marker Overlay on TradingView Chart */}
        {activeSignal && (
          <div className="absolute top-4 left-4 z-20 bg-[#090d16]/90 border border-sky-500/40 p-3 rounded-lg backdrop-blur-md shadow-2xl max-w-xs font-mono animate-in fade-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] text-sky-400 font-bold tracking-wider uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                ALGO SIGNAL MARKER DETECTED
              </span>
              <span className="px-1.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded text-[9px]">
                {activeSignal.confluence_score}% Confluence
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2 font-mono-num">
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${
                  activeSignal.direction === 'BUY'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {activeSignal.direction === 'BUY' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {activeSignal.direction} SIGNAL
              </span>
              <span className="text-xs font-bold text-slate-100">{activeSignal.symbol}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono-num bg-[#0f172a] p-2 rounded border border-slate-800 text-center">
              <div>
                <div className="text-slate-400">ENTRY</div>
                <div className="font-bold text-sky-300">{activeSignal.entry}</div>
              </div>
              <div>
                <div className="text-rose-400">STOP</div>
                <div className="font-bold text-rose-400">{activeSignal.sl}</div>
              </div>
              <div>
                <div className="text-emerald-400">TARGET</div>
                <div className="font-bold text-emerald-400">{activeSignal.tp}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
