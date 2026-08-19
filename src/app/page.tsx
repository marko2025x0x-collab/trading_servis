import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Cpu,
  Gauge,
  Newspaper,
  Send,
  Lock,
  Hexagon,
  LogIn,
  UserPlus,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050811] text-[#E2E8F0] flex flex-col font-neo-mono selection:bg-[#00F5D4] selection:text-[#050811]">
      {/* Navigation Header */}
      <nav className="w-full border-b border-cyan-500/20 bg-[#090E1C]/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 neo-hud-bracket">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-[3px] bg-gradient-to-tr from-[#00F5D4] via-[#00FF9D] to-violet-600 p-[1px] shadow-lg shadow-[#00F5D4]/20">
              <div className="w-full h-full bg-[#050811] rounded-[2px] flex items-center justify-center">
                <Hexagon className="w-4 h-4 text-[#00F5D4] fill-[#00F5D4]/20" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#00FF9D] rounded-full border-2 border-[#050811] animate-pulse" />
          </div>

          <div className="font-extrabold text-sm tracking-wider text-[#E2E8F0] font-neo-display flex items-center gap-2">
            <span>NEXUS</span>
            <span className="bg-gradient-to-r from-[#00F5D4] via-[#00FF9D] to-violet-400 bg-clip-text text-transparent">
              QUANT
            </span>
            <span className="neo-hud-badge">
              [SYS::ONLINE]
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-1 text-xs text-[#E2E8F0] hover:text-[#00F5D4] font-neo-mono font-bold transition-colors uppercase tracking-wider px-3 py-1.5 rounded-[2px] bg-[#090E1C] border border-cyan-500/20"
          >
            <LogIn className="w-3.5 h-3.5 text-[#00F5D4]" />
            ВХІД
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-1 text-xs text-[#00FF9D] hover:text-white font-neo-mono font-bold transition-colors uppercase tracking-wider px-3 py-1.5 rounded-[2px] bg-[#00FF9D]/10 border border-[#00FF9D]/30"
          >
            <UserPlus className="w-3.5 h-3.5" />
            РЕЄСТРАЦІЯ
          </Link>

          <Link
            href="/pro-dashboard?demo=true"
            className="flex items-center gap-2 px-4 py-1.5 bg-[#00F5D4] hover:bg-[#00FF9D] text-[#050811] font-extrabold rounded-[2px] text-xs font-neo-mono transition-all shadow-[0_0_12px_rgba(0,245,212,0.3)]"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            LAUNCH TERMINAL
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-16 lg:py-24 max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
        <div className="neo-hud-badge">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00F5D4]" />
          SUPABASE & TRADELOCKER INTEGRATED QUANT SUITE
        </div>

        <h1 className="text-3xl sm:text-6xl font-extrabold text-[#E2E8F0] tracking-tight leading-tight max-w-4xl font-neo-display">
          High-Confluence Algorithmic <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] via-[#00FF9D] to-violet-400 drop-shadow-[0_0_20px_rgba(0,245,212,0.4)]">
            Trading Engine & Webhook Bridge
          </span>
        </h1>

        <p className="text-[#94A3B8] text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
          Combines Candlestick Patterns, Smart Money Concepts (FVG, BOS), Quantitative Z-Score mean reversion, and Fundamental News filters. Only signals with <span className="text-[#00F5D4] font-mono-num font-bold">&gt; 80% Confluence Score</span> are dispatched.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <Link
            href="/pro-dashboard?demo=true"
            className="w-full sm:w-auto px-8 py-3 bg-[#00F5D4] hover:bg-[#00FF9D] text-[#050811] font-extrabold rounded-[3px] text-xs font-neo-mono transition-all shadow-[0_0_20px_rgba(0,245,212,0.4)] flex items-center justify-center gap-2 group"
          >
            ENTER PRO TERMINAL
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/paywall"
            className="w-full sm:w-auto px-8 py-3 bg-[#090E1C] hover:bg-[#0F172A] border border-cyan-500/30 text-[#E2E8F0] font-bold rounded-[3px] text-xs font-neo-mono transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-[#FFB800]" />
            VIEW PAYWALL TIERS
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 py-14 bg-[#090E1C]/80 border-t border-cyan-500/20 neo-hud-bracket">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] font-neo-display">
              The 4-Layer Confluence Matrix
            </h2>
            <p className="text-[#64748B] text-xs max-w-xl mx-auto font-mono">
              // Mathematical execution validation across four quantitative dimensions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Feature 1 */}
            <div className="p-5 neo-panel rounded-[3px] space-y-3 font-neo-mono">
              <div className="w-9 h-9 rounded-[2px] bg-[#00F5D4]/10 border border-[#00F5D4]/30 flex items-center justify-center text-[#00F5D4]">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">Price Action & Patterns</h3>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Automated detection of Bullish/Bearish Pin Bars and Engulfing candles at key structural liquidity points.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 neo-panel rounded-[3px] space-y-3 font-neo-mono">
              <div className="w-9 h-9 rounded-[2px] bg-[#00FF9D]/10 border border-[#00FF9D]/30 flex items-center justify-center text-[#00FF9D]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">Smart Money Concepts</h3>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Identifies Fair Value Gaps (FVG), Break of Structure (BOS), and Liquidity Sweeps to align with institutional order flow.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 neo-panel rounded-[3px] space-y-3 font-neo-mono">
              <div className="w-9 h-9 rounded-[2px] bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Gauge className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">Quant & Volatility</h3>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Z-Score mean reversion algorithms, ATR dynamic volatility bands, and multi-timeframe ROC metrics.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 neo-panel rounded-[3px] space-y-3 font-neo-mono">
              <div className="w-9 h-9 rounded-[2px] bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800]">
                <Newspaper className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">Fundamental Radar</h3>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Safety buffer blocks signal generation 30 minutes prior to high-impact economic news events (CPI, NFP, ECB rates).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TradeLocker Webhook Section */}
      <section className="px-6 py-14 max-w-5xl mx-auto w-full">
        <div className="p-6 sm:p-10 neo-panel rounded-[3px] flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl neo-hud-bracket">
          <div className="space-y-3 max-w-xl">
            <div className="neo-hud-badge">
              <Send className="w-3.5 h-3.5 text-[#00F5D4]" /> TRADELOCKER REST API / WEBHOOK
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#E2E8F0] font-neo-display">
              1-Click Automated Execution to TradeLocker
            </h2>
            <p className="text-[#94A3B8] text-xs leading-relaxed">
              When high-confluence signals are detected, send order requests directly to your TradeLocker broker account with pre-calculated Entry, Stop Loss, and Take Profit values.
            </p>
          </div>

          <Link
            href="/pro-dashboard?demo=true"
            className="px-6 py-3 bg-[#00F5D4] hover:bg-[#00FF9D] text-[#050811] font-extrabold rounded-[2px] text-xs font-neo-mono transition-all shadow-[0_0_15px_rgba(0,245,212,0.3)] shrink-0"
          >
            TEST TRADELOCKER EXECUTION
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-cyan-500/20 bg-[#050811] px-6 py-6 text-center text-[11px] text-[#64748B] font-neo-mono">
        <div>NEXUS QUANT NEO MIRAI TERMINAL • Powered by Next.js 16, Supabase Realtime & TradeLocker API</div>
      </footer>
    </div>
  );
}
