'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Signal, MarketCandle } from '@/types';
import { TradeLockerPosition } from '@/types/tradelocker';
import { INITIAL_DEMO_POSITIONS } from '@/lib/tradelocker/demoStore';
import { Language, getTranslation } from '@/lib/i18n';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';
import { TradingChart } from '@/components/terminal/TradingChart';
import { SignalFeed } from '@/components/terminal/SignalFeed';
import { QuantMetricsPanel } from '@/components/terminal/QuantMetricsPanel';
import { OpenPositionsPanel } from '@/components/terminal/OpenPositionsPanel';
import { SignalDetailModal } from '@/components/terminal/SignalDetailModal';
import { TraderJournalModal } from '@/components/terminal/TraderJournalModal';
import { ArbitrageScannerModal } from '@/components/terminal/ArbitrageScannerModal';
import { TopOpportunitiesModal } from '@/components/terminal/TopOpportunitiesModal';
import { TradeLockerDemoModal } from '@/components/terminal/TradeLockerDemoModal';
import { analyzeQuant } from '@/lib/analytics/quant';
import { computeOptimizedWeights } from '@/lib/journal/aiOptimizer';
import { loadJournalTrades } from '@/lib/journal/storage';

const POLL_INTERVAL_MS: Record<string, number> = {
  '1m': 15_000,
  '5m': 30_000,
  '15m': 60_000,
  '1h': 5 * 60_000,
  '4h': 15 * 60_000,
  '1d': 30 * 60_000,
};

const INITIAL_HIGH_CONFLUENCE_SIGNALS: Signal[] = [
  {
    id: 'sig-init-btc-15m',
    symbol: 'BTC/USD',
    direction: 'BUY',
    entry: 69380.00,
    sl: 68100.00,
    tp: 72400.00,
    confluence_score: 96,
    timeframe: '15m',
    pattern_detected: 'BULLISH_ENGULFING',
    smc_confluence: {
      fvg_detected: true,
      bos_detected: true,
      choch_detected: true,
      liquidity_sweep: true,
    },
    quant_confluence: {
      z_score: -2.14,
      atr: 450.00,
      momentum_score: 92.4,
    },
    news_filter_passed: true,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sig-init-eur-15m',
    symbol: 'EUR/USD',
    direction: 'BUY',
    entry: 1.0854,
    sl: 1.0819,
    tp: 1.0930,
    confluence_score: 94,
    timeframe: '15m',
    pattern_detected: 'PIN_BAR',
    smc_confluence: {
      fvg_detected: true,
      bos_detected: true,
      choch_detected: false,
      liquidity_sweep: true,
    },
    quant_confluence: {
      z_score: -1.88,
      atr: 0.0035,
      momentum_score: 88.0,
    },
    news_filter_passed: true,
    active: true,
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'sig-init-sol-15m',
    symbol: 'SOL/USDT',
    direction: 'BUY',
    entry: 142.50,
    sl: 138.00,
    tp: 152.00,
    confluence_score: 91,
    timeframe: '15m',
    pattern_detected: 'BULLISH_ENGULFING',
    smc_confluence: {
      fvg_detected: true,
      bos_detected: true,
      choch_detected: true,
      liquidity_sweep: true,
    },
    quant_confluence: {
      z_score: -1.65,
      atr: 2.20,
      momentum_score: 85.2,
    },
    news_filter_passed: true,
    active: true,
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
];

export default function ProDashboardPage() {
  const [lang, setLang] = useState<Language>('uk'); // Ukrainian language by default
  const [symbol, setSymbol] = useState<string>('BTC/USD');
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('15m');
  const [candles, setCandles] = useState<MarketCandle[]>([]);
  const [signals, setSignals] = useState<Signal[]>(INITIAL_HIGH_CONFLUENCE_SIGNALS);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(INITIAL_HIGH_CONFLUENCE_SIGNALS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'LIVE' | 'SIMULATED' | null>(null);

  // TradeLocker Demo Positions State
  const [positions, setPositions] = useState<TradeLockerPosition[]>(INITIAL_DEMO_POSITIONS);

  // Modal dialog states
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isArbitrageOpen, setIsArbitrageOpen] = useState(false);
  const [isOpportunitiesOpen, setIsOpportunitiesOpen] = useState(false);
  const [isTlDemoOpen, setIsTlDemoOpen] = useState(false);

  const t = getTranslation(lang);

  // Fetch real candles for the selected symbol+timeframe and keep them fresh
  const loadCandles = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/market-data/candles?symbol=${encodeURIComponent(symbol)}&timeframe=${timeframe}&count=60`
      );
      const data = await res.json();
      setCandles(data.candles || []);
      setDataSource(data.source || null);
    } catch (e) {
      console.warn('Market data fetch failed:', e);
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCandles();
    const intervalMs = POLL_INTERVAL_MS[timeframe] || 60_000;
    const interval = setInterval(loadCandles, intervalMs);
    return () => clearInterval(interval);
  }, [loadCandles, timeframe]);

  // Sync open positions with TradeLocker REST API
  const fetchPositions = useCallback(async () => {
    try {
      const res = await fetch('/api/tradelocker/positions');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.positions) && data.positions.length > 0) {
          setPositions(data.positions);
        }
      }
    } catch (e) {
      console.warn('TradeLocker positions sync warning:', e);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPositions();
    const interval = setInterval(fetchPositions, 5000);
    return () => clearInterval(interval);
  }, [fetchPositions]);

  // Handle live scan matrix evaluation
  const handleScanMarket = async () => {
    setIsScanning(true);
    try {
      const weights = computeOptimizedWeights(loadJournalTrades());
      const res = await fetch('/api/signals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, weights }),
      });

      const data = await res.json();
      if (data.generatedSignal) {
        setScanMessage(null);
        setSignals((prev) => [data.generatedSignal, ...prev.filter((s) => s.id !== data.generatedSignal.id)]);
        setSelectedSignal(data.generatedSignal);
      } else {
        setScanMessage(
          `No confluence: score ${data.confluenceScore ?? '—'}/100 (needs >80). ${
            data.breakdown?.newsPassed === false ? `News filter: ${data.breakdown.newsReason}.` : ''
          }`
        );
      }
    } catch (err) {
      console.error(err);
      setScanMessage('Scan failed — see console for details.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleClosePosition = async (id: string) => {
    try {
      await fetch(`/api/tradelocker/positions?id=${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setPositions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddPosition = (pos: TradeLockerPosition) => {
    setPositions((prev) => [pos, ...prev]);
  };

  const quantMetrics = analyzeQuant(candles);

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans">
      {/* Terminal Header with i18n & Modals */}
      <TerminalHeader
        selectedSymbol={symbol}
        onSymbolSelect={(sym) => {
          setSymbol(sym);
          setSelectedSignal(null);
        }}
        lang={lang}
        onLanguageToggle={() => setLang(lang === 'uk' ? 'en' : 'uk')}
        onOpenJournal={() => setIsJournalOpen(true)}
        onOpenArbitrage={() => setIsArbitrageOpen(true)}
        onOpenOpportunities={() => setIsOpportunitiesOpen(true)}
        onOpenTradeLockerDemo={() => setIsTlDemoOpen(true)}
        isProUser={true}
      />

      {/* Main Terminal Grid Workspace */}
      <main className="flex-1 p-3 lg:p-4 space-y-4 max-w-[1920px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[580px]">
          {/* Left Column (8 cols) Split into 2 Stacked Halves: Top = Chart, Bottom = TradeLocker Positions */}
          <div className="lg:col-span-8 flex flex-col gap-3 h-full">
            {/* Top Half: Trading Chart */}
            <div className="h-[380px] lg:h-[400px] flex flex-col">
              <TradingChart
                symbol={symbol}
                candles={candles}
                activeSignal={selectedSignal}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                lang={lang}
              />
            </div>

            {/* Bottom Half: TradeLocker Open Positions Matrix */}
            <div className="flex-1 min-h-[180px] flex flex-col">
              <OpenPositionsPanel
                positions={positions}
                onClosePosition={handleClosePosition}
                onOpenTradeLockerModal={() => setIsTlDemoOpen(true)}
                lang={lang}
              />
            </div>
          </div>

          {/* Right Column (4 cols): Live Signal Feed */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <SignalFeed
              signals={signals}
              selectedSignal={selectedSignal}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
              onTriggerScan={handleScanMarket}
              isScanning={isScanning}
              scanMessage={scanMessage}
              lang={lang}
            />
          </div>
        </div>

        {/* Quant Realtime Metrics Panel */}
        <QuantMetricsPanel quant={quantMetrics} symbol={symbol} lang={lang} dataSource={dataSource} />
      </main>

      <SignalDetailModal
        signal={selectedSignal}
        onClose={() => setSelectedSignal(null)}
        onAddPosition={handleAddPosition}
        lang={lang}
      />
      <TraderJournalModal isOpen={isJournalOpen} onClose={() => setIsJournalOpen(false)} lang={lang} />
      <ArbitrageScannerModal isOpen={isArbitrageOpen} onClose={() => setIsArbitrageOpen(false)} lang={lang} />
      <TopOpportunitiesModal
        isOpen={isOpportunitiesOpen}
        onClose={() => setIsOpportunitiesOpen(false)}
        onSelectSymbol={(sym) => setSymbol(sym)}
        lang={lang}
      />
      <TradeLockerDemoModal
        isOpen={isTlDemoOpen}
        onClose={() => setIsTlDemoOpen(false)}
        lang={lang}
        positions={positions}
        onClosePosition={handleClosePosition}
        onAddPosition={handleAddPosition}
      />
    </div>
  );
}
