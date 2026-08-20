'use client';

import React, { useEffect, useRef } from 'react';
import { MarketCandle, Signal } from '@/types';
import { Language } from '@/lib/i18n';
import { ArrowUpRight, ArrowDownRight, ShieldCheck, Activity } from 'lucide-react';

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
      const tv = (window as unknown as { TradingView?: { widget: new (options: Record<string, unknown>) => unknown } }).TradingView;
      if (typeof window !== 'undefined' && tv) {
        new tv.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: tvInterval,
          timezone: 'Europe/Kyiv',
          theme: 'dark',
          style: '1',
          locale: lang === 'uk' ? 'uk' : 'en',
          toolbar_bg: '#050811',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: widgetContainerId,
          hide_side_toolbar: false,
          studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
          // Neo-Mirai Custom Color Overrides (Laser Emerald #00FF9D & Cyber Rose #FF2A6D)
          overrides: {
            'mainSeriesProperties.candleStyle.upColor': '#00FF9D',
            'mainSeriesProperties.candleStyle.downColor': '#FF2A6D',
            'mainSeriesProperties.candleStyle.wickUpColor': '#00FF9D',
            'mainSeriesProperties.candleStyle.wickDownColor': '#FF2A6D',
            'mainSeriesProperties.candleStyle.borderUpColor': '#00FF9D',
            'mainSeriesProperties.candleStyle.borderDownColor': '#FF2A6D',
            'paneProperties.background': '#050811',
            'paneProperties.backgroundType': 'solid',
            'paneProperties.vertGridProperties.color': 'rgba(0, 245, 212, 0.05)',
            'paneProperties.horzGridProperties.color': 'rgba(0, 245, 212, 0.05)',
          },
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
    <div className="relative w-full h-full flex flex-col bg-[#050811] border border-cyan-500/20 rounded-[3px] overflow-hidden shadow-2xl neo-hud-bracket">
      {/* Chart HUD Control Bar */}
      <div className="px-4 py-2 bg-[#090E1C] border-b border-cyan-500/20 flex items-center justify-between font-neo-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00F5D4]" />
            <span className="font-extrabold text-[#E2E8F0] tracking-wider text-sm">{symbol}</span>
            <span className="neo-hud-badge">
              [FEED::REALTIME]
            </span>
          </div>

          <div className="h-4 w-[1px] bg-cyan-500/20" />

          {/* Timeframe Selector Pills */}
          <div className="flex items-center gap-1">
            {(['1m', '5m', '15m', '1h', '4h', '1d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2 py-0.5 text-[11px] font-neo-mono font-bold rounded-[2px] transition-all ${
                  timeframe === tf
                    ? 'bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/40 shadow-[0_0_8px_rgba(0,245,212,0.3)]'
                    : 'text-[#64748B] hover:text-[#E2E8F0] hover:bg-[#0F172A]'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {activeSignal && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#64748B]">{'// ENTRY:'}</span>
            <span
              className={`font-mono-num font-bold px-2 py-0.5 rounded-[2px] text-[11px] ${
                activeSignal.direction === 'BUY'
                  ? 'bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/40'
                  : 'bg-[#FF2A6D]/15 text-[#FF2A6D] border border-[#FF2A6D]/40'
              }`}
            >
              {activeSignal.direction} @ {activeSignal.entry}
            </span>
          </div>
        )}
      </div>

      {/* Official TradingView Advanced Widget Container */}
      <div className="relative w-full flex-1 min-h-[500px] bg-[#050811]">
        <div ref={containerRef} className="w-full h-full" />

        {/* Algorithmic Signal HUD Marker Overlay on TradingView Chart */}
        {activeSignal && (
          <div className="absolute top-4 left-4 z-20 neo-panel neo-hud-bracket p-3.5 rounded-[3px] backdrop-blur-md shadow-2xl max-w-xs font-neo-mono animate-in fade-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] text-[#00F5D4] font-bold tracking-wider uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00F5D4]" />
                [ALGO::SIGNAL_MARKER]
              </span>
              <span className="neo-hud-badge">
                {activeSignal.confluence_score}% SCORE
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2 font-mono-num">
              <span
                className={`px-2 py-0.5 rounded-[2px] text-xs font-extrabold flex items-center gap-1 ${
                  activeSignal.direction === 'BUY'
                    ? 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40 glow-bullish'
                    : 'bg-[#FF2A6D]/20 text-[#FF2A6D] border border-[#FF2A6D]/40 glow-bearish'
                }`}
              >
                {activeSignal.direction === 'BUY' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {activeSignal.direction}
              </span>
              <span className="text-xs font-bold text-[#E2E8F0]">{activeSignal.symbol}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono-num bg-[#050811] p-2 rounded-[2px] border border-cyan-500/20 text-center">
              <div>
                <div className="text-[#64748B]">ENTRY</div>
                <div className="font-bold text-[#00F5D4]">{activeSignal.entry}</div>
              </div>
              <div>
                <div className="text-[#FF2A6D]">STOP</div>
                <div className="font-bold text-[#FF2A6D]">{activeSignal.sl}</div>
              </div>
              <div>
                <div className="text-[#00FF9D]">TARGET</div>
                <div className="font-bold text-[#00FF9D]">{activeSignal.tp}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
