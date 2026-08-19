import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Zap, ArrowRight, TrendingUp, Cpu, Gauge, Newspaper, Send, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Navigation Header */}
      <nav className="w-full border-b border-slate-800/80 bg-[#0d1424]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-950/40">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-wider text-slate-100">
            NEXUS <span className="text-sky-400">QUANT</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/paywall"
            className="text-xs text-slate-400 hover:text-slate-200 font-mono transition-colors"
          >
            PRICING
          </Link>

          <Link
            href="/pro-dashboard?demo=true"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-lg text-xs font-mono transition-all shadow-lg shadow-sky-950/50"
          >
            <Zap className="w-4 h-4" />
            LAUNCH TERMINAL
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-28 max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-medium">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          SUPABASE & TRADELOCKER INTEGRATED ANALYTICS
        </div>

        <h1 className="text-4xl sm:text-7xl font-extrabold text-slate-100 tracking-tight leading-tight max-w-4xl">
          High-Confluence Algorithmic <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400">
            Trading Engine & Webhook Bridge
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-xl max-w-2xl font-normal leading-relaxed">
          Combines Candlestick Patterns, Smart Money Concepts (FVG, BOS), Quantitative Z-Score mean reversion, and Fundamental News filters. Only signals with <span className="text-sky-400 font-mono font-bold">&gt; 80% confluence score</span> are dispatched.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Link
            href="/pro-dashboard?demo=true"
            className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm font-mono transition-all shadow-xl shadow-sky-950/60 flex items-center justify-center gap-2 group"
          >
            ENTER PRO TERMINAL
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/paywall"
            className="w-full sm:w-auto px-8 py-4 bg-[#0d1424] hover:bg-[#151f36] border border-slate-800 text-slate-300 font-bold rounded-xl text-sm font-mono transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            VIEW PAYWALL TIERS
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 py-16 bg-[#0d1424]/60 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100">
              The 4-Layer Confluence Matrix
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto font-mono">
              Every signal must satisfy strict mathematical parameters across four distinct analytical dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-[#090d16] border border-slate-800 rounded-xl space-y-3 hover:border-sky-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Price Action & Patterns</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated detection of Bullish/Bearish Pin Bars, Engulfing candles, and Morning Stars at key market structure pivot points.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-[#090d16] border border-slate-800 rounded-xl space-y-3 hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Smart Money Concepts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identifies Fair Value Gaps (FVG), Break of Structure (BOS), and Liquidity Sweeps to align with institutional order flow.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-[#090d16] border border-slate-800 rounded-xl space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Quant & Volatility Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates Z-Score for statistical mean reversion, ATR volatility metrics for dynamic SL/TP placement, and momentum ROC.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-[#090d16] border border-slate-800 rounded-xl space-y-3 hover:border-amber-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Newspaper className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Fundamental Radar</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Safety buffer blocks signal generation 30 minutes prior to high-impact economic news events like CPI, NFP, and FOMC rate cuts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TradeLocker Webhook Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto w-full">
        <div className="p-8 sm:p-12 bg-gradient-to-r from-[#0d1424] to-[#111a30] border border-slate-800 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono">
              <Send className="w-3.5 h-3.5" /> TRADELOCKER REST API / WEBHOOK
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100">
              1-Click Trade Execution to TradeLocker
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              When high-confluence signals are detected, send order requests directly to your TradeLocker broker account with pre-calculated Entry, Stop Loss, and Take Profit values.
            </p>
          </div>

          <Link
            href="/pro-dashboard?demo=true"
            className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm font-mono transition-all shadow-xl shadow-sky-950/60 shrink-0"
          >
            TEST TRADELOCKER EXECUTION
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#090d16] px-6 py-8 text-center text-xs text-slate-500 font-mono">
        <div>NEXUS QUANT TERMINAL • Powered by Next.js 16, Supabase Realtime & TradeLocker API</div>
      </footer>
    </div>
  );
}
