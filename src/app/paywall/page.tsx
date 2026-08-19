'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle2, Zap, ArrowRight, Lock, Hexagon } from 'lucide-react';

export default function PaywallPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleUnlockDemo = () => {
    // Set session cookie for seamless demo access
    document.cookie = 'user_subscription_status=pro; path=/';
    router.push('/pro-dashboard?demo=true');
  };

  return (
    <div className="min-h-screen bg-[#050811] text-[#E2E8F0] flex flex-col font-neo-mono selection:bg-[#00F5D4] selection:text-[#050811]">
      {/* Top Navigation Bar */}
      <nav className="w-full border-b border-cyan-500/20 bg-[#090E1C]/90 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 neo-hud-bracket">
        <Link href="/" className="flex items-center gap-3">
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
              [SYS::PAYWALL]
            </span>
          </div>
        </Link>

        <button
          onClick={handleUnlockDemo}
          className="flex items-center gap-2 px-4 py-1.5 bg-[#00F5D4] hover:bg-[#00FF9D] text-[#050811] font-extrabold rounded-[2px] text-xs font-neo-mono transition-all shadow-[0_0_12px_rgba(0,245,212,0.3)]"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          LAUNCH INSTANT DEMO
        </button>
      </nav>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center space-y-6">
        <div className="neo-hud-badge">
          <Lock className="w-3.5 h-3.5 text-[#FFB800]" />
          PROTECTED QUANTITATIVE SUITE
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#E2E8F0] tracking-tight leading-tight max-w-3xl font-neo-display">
          Institutional-Grade Trading Analytics & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] via-[#00FF9D] to-violet-400 drop-shadow-[0_0_20px_rgba(0,245,212,0.4)]">
            TradeLocker Execution
          </span>
        </h1>

        <p className="text-[#94A3B8] text-xs sm:text-sm max-w-2xl leading-relaxed">
          Unlock real-time Smart Money Concepts (FVG, BOS), Quantitative Z-Score mean reversion algorithms, and fundamental news filters. Signals are only generated when confluence score exceeds 80%.
        </p>

        {/* Billing Switch */}
        <div className="flex items-center gap-2 bg-[#090E1C] p-1 rounded-[2px] border border-cyan-500/20 font-neo-mono text-xs">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-[2px] font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/40 shadow-[0_0_8px_rgba(0,245,212,0.3)]'
                : 'text-[#64748B] hover:text-[#E2E8F0]'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 rounded-[2px] font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/40 shadow-[0_0_8px_rgba(0,245,212,0.3)]'
                : 'text-[#64748B] hover:text-[#E2E8F0]'
            }`}
          >
            Annual Billing <span className="text-[9px] bg-[#00FF9D]/20 text-[#00FF9D] px-1.5 py-0.2 rounded border border-[#00FF9D]/40">20% OFF</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl text-left pt-4">
          {/* Pro Trader Plan */}
          <div className="p-7 neo-panel rounded-[3px] space-y-5 relative overflow-hidden shadow-2xl neo-hud-bracket">
            <div className="absolute top-0 right-0 bg-[#00F5D4] text-[#050811] text-[9px] font-extrabold uppercase font-neo-mono px-3 py-1 rounded-bl-[3px]">
              MOST POPULAR
            </div>

            <div>
              <div className="text-[#00F5D4] font-neo-mono text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00F5D4]" />
                Pro Trader
              </div>
              <div className="flex items-baseline gap-2 mt-2 font-mono-num">
                <span className="text-3xl font-extrabold text-[#E2E8F0]">
                  ${billingCycle === 'monthly' ? '49' : '39'}
                </span>
                <span className="text-[#64748B] text-xs">/ month</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-[#E2E8F0] font-neo-mono">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                <span>Real-Time Supabase WebSocket Signal Stream</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                <span>TradingView Lightweight Charts with overlays</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                <span>Smart Money Concepts (FVG, BOS, Liquidity Sweeps)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                <span>Quantitative Z-Score & ATR Volatility Engine</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                <span>1-Click Automated TradeLocker Webhook Execution</span>
              </li>
            </ul>

            <button
              onClick={handleUnlockDemo}
              className="w-full py-2.5 bg-[#00F5D4] hover:bg-[#00FF9D] text-[#050811] font-extrabold rounded-[2px] text-xs transition-all shadow-[0_0_15px_rgba(0,245,212,0.3)] flex items-center justify-center gap-2"
            >
              Start Pro Plan Trial
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Institutional Quant Plan */}
          <div className="p-7 bg-[#090E1C] border border-cyan-500/20 rounded-[3px] space-y-5 relative overflow-hidden neo-hud-bracket">
            <div>
              <div className="text-violet-400 font-neo-mono text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                Institutional Quant
              </div>
              <div className="flex items-baseline gap-2 mt-2 font-mono-num">
                <span className="text-3xl font-extrabold text-[#E2E8F0]">
                  ${billingCycle === 'monthly' ? '199' : '159'}
                </span>
                <span className="text-[#64748B] text-xs">/ month</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-[#E2E8F0] font-neo-mono">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Everything in Pro Trader Plan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Custom TradeLocker Multi-Account Routing</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>High-Impact Fundamental News Filter Custom Webhooks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Dedicated Supabase Edge Function Endpoint</span>
              </li>
            </ul>

            <button
              onClick={handleUnlockDemo}
              className="w-full py-2.5 bg-[#0F172A] hover:bg-[#090E1C] text-[#E2E8F0] border border-cyan-500/30 font-extrabold rounded-[2px] text-xs transition-all flex items-center justify-center gap-2"
            >
              Access Institutional Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
