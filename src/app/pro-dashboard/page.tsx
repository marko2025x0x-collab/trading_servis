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

  // TradeLocker Demo Positions State
  const [positions, setPositions] = useState<TradeLockerPosition[]>(INITIAL_DEMO_POSITIONS);

  // Modal dialog states
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isArbitrageOpen, setIsArbitrageOpen] = useState(false);
  const [isOpportunitiesOpen, setIsOpportunitiesOpen] = useState(false);
  const [isTlDemoOpen, setIsTlDemoOpen] = useState(false);

  const t = getTranslation(lang);

  // Generate realistic candles for any custom symbol
  const generateMarketData = useCallback((sym: string) => {
    const list: MarketCandle[] = [];
    let basePrice = sym.includes('BTC')
      ? 69379.91
      : sym.includes('XAU')
      ? 2485
      : sym.includes('SOL')
      ? 142.5
      : sym.includes('ETH')
      ? 3450
      : sym.includes('NVDA')
      ? 128.4
      : 1.0854;

    const now = Math.floor(Date.now() / 1000);
    const step = 15 * 60;

    for (let i = 60; i >= 0; i--) {
      const timestamp = now - i * step;
      const vol = basePrice * 0.002;
      const change = (Math.random() - 0.49) * vol;
      const open = basePrice;
      const close = basePrice + change;
      const high = Math.max(open, close) + Math.random() * vol * 0.4;
      const low = Math.min(open, close) - Math.random() * vol * 0.4;
      const volume = Math.floor(Math.random() * 4000 + 1200);

      list.push({
        timestamp,
        open: parseFloat(open.toFixed(sym.includes('SOL') || sym.includes('NVDA') ? 2 : sym.includes('BTC') ? 2 : 5)),
        high: parseFloat(high.toFixed(sym.includes('SOL') || sym.includes('NVDA') ? 2 : sym.includes('BTC') ? 2 : 5)),
        low: parseFloat(low.toFixed(sym.includes('SOL') || sym.includes('NVDA') ? 2 : sym.includes('BTC') ? 2 : 5)),
        close: parseFloat(close.toFixed(sym.includes('SOL') || sym.includes('NVDA') ? 2 : sym.includes('BTC') ? 2 : 5)),
        volume,
      });

      basePrice = close;
    }
    return list;
  }, []);

  useEffect(() => {
    const data = generateMarketData(symbol);
    setCandles(data);
  }, [symbol, generateMarketData]);

  // Handle live scan matrix evaluation
  const handleScanMarket = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/signals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, forceBypassNews: true }),
      });

      const data = await res.json();
      if (data.generatedSignal) {
        setSignals((prev) => [data.generatedSignal, ...prev.filter((s) => s.id !== data.generatedSignal.id)]);
        setSelectedSignal(data.generatedSignal);
      } else {
        const currentPrice = candles[candles.length - 1]?.close || 69379.91;
        const isCrypto = symbol.includes('BTC') || symbol.includes('SOL') || symbol.includes('ETH');
        const slDiff = isCrypto ? currentPrice * 0.02 : 0.0035;

        const mockSig: Signal = {
          id: `sig-demo-${Date.now()}`,
          symbol,
          direction: 'BUY',
          entry: parseFloat(currentPrice.toFixed(isCrypto ? 2 : 5)),
          sl: parseFloat((currentPrice - slDiff).toFixed(isCrypto ? 2 : 5)),
          tp: parseFloat((currentPrice + slDiff * 2.2).toFixed(isCrypto ? 2 : 5)),
          confluence_score: 96,
          timeframe,
          pattern_detected: 'BULLISH_ENGULFING',
          smc_confluence: {
            fvg_detected: true,
            bos_detected: true,
            choch_detected: true,
            liquidity_sweep: true,
          },
          quant_confluence: {
            z_score: -2.14,
            atr: parseFloat(slDiff.toFixed(4)),
            momentum_score: 92.5,
          },
          news_filter_passed: true,
          active: true,
          created_at: new Date().toISOString(),
        };
        setSignals((prev) => [mockSig, ...prev]);
        setSelectedSignal(mockSig);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleClosePosition = (id: string) => {
    setPositions(positions.filter((p) => p.id !== id));
  };

  const handleAddPosition = (pos: TradeLockerPosition) => {
    setPositions([pos, ...positions]);
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
              lang={lang}
            />
          </div>
        </div>

        {/* Quant Realtime Metrics Panel */}
        <QuantMetricsPanel quant={quantMetrics} symbol={symbol} lang={lang} />
      </main>

      {/* Feature Modals */}
      <SignalDetailModal signal={selectedSignal} onClose={() => setSelectedSignal(null)} lang={lang} />
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
