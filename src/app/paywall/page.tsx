'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle2, Zap, ArrowRight, Activity, Lock, Cpu, Star } from 'lucide-react';

export default function PaywallPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleUnlockDemo = () => {
    // Set session cookie for seamless demo access
    document.cookie = 'user_subscription_status=pro; path=/';
    router.push('/pro-dashboard?demo=true');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Bar */}
      <nav className="w-full border-b border-slate-800 bg-[#0d1424]/90 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-wider text-slate-100">
            NEXUS <span className="text-sky-400">QUANT</span>
          </span>
        </Link>

        <button
          onClick={handleUnlockDemo}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-bold font-mono transition-all"
        >
          <Zap className="w-4 h-4 text-sky-400" />
          LAUNCH INSTANT DEMO
        </button>
      </nav>

      {/* Hero Header */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-medium">
          <Lock className="w-3.5 h-3.5" />
          PROTECTED QUANTITATIVE SUITE
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight max-w-3xl">
          Institutional-Grade Trading Analytics & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">TradeLocker Execution</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
          Unlock real-time Smart Money Concepts (FVG, BOS), Quantitative Z-Score mean reversion algorithms, and fundamental news filters. Signals are only generated when confluence score exceeds 80%.
        </p>

        {/* Billing Switch */}
        <div className="flex items-center gap-3 bg-[#0d1424] p-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg transition-all ${
              billingCycle === 'monthly'
                ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-950/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-950/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Annual Billing <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">20% OFF</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl text-left pt-6">
          {/* Pro Trader Plan */}
          <div className="p-8 bg-[#0d1424] border border-sky-500/40 rounded-2xl space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 bg-sky-500 text-slate-950 text-[10px] font-extrabold uppercase font-mono px-3 py-1 rounded-bl-lg">
              MOST POPULAR
            </div>

            <div>
              <div className="text-sky-400 font-mono text-xs font-bold tracking-wider uppercase">Pro Trader</div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-slate-100 font-mono">
                  ${billingCycle === 'monthly' ? '49' : '39'}
                </span>
                <span className="text-slate-400 text-sm">/ month</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time Supabase WebSocket Signal Stream</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>TradingView Lightweight Charts with overlays</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Smart Money Concepts (FVG, BOS, Liquidity Sweeps)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Quantitative Z-Score & ATR Volatility Engine</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-Click Automated TradeLocker Webhook Execution</span>
              </li>
            </ul>

            <button
              onClick={handleUnlockDemo}
              className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-sky-950/50 flex items-center justify-center gap-2"
            >
              Start Pro Plan Trial
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Institutional Quant Plan */}
          <div className="p-8 bg-[#0b0f19] border border-slate-800 rounded-2xl space-y-6 relative overflow-hidden">
            <div>
              <div className="text-indigo-400 font-mono text-xs font-bold tracking-wider uppercase">Institutional Quant</div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-slate-100 font-mono">
                  ${billingCycle === 'monthly' ? '199' : '159'}
                </span>
                <span className="text-slate-400 text-sm">/ month</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Everything in Pro Trader Plan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Custom TradeLocker Multi-Account Routing</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>High-Impact Fundamental News Filter Custom Webhooks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Dedicated Supabase Edge Function Endpoint</span>
              </li>
            </ul>

            <button
              onClick={handleUnlockDemo}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
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
