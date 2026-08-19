'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  Lock,
  Hexagon,
  Cpu,
  Layers,
  Sparkles,
  ArrowLeft,
  XCircle,
  HelpCircle,
} from 'lucide-react';

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
      {/* HUD Navigation Header */}
      <nav className="w-full border-b border-cyan-500/20 bg-[#090E1C]/90 px-4 py-3 flex items-center justify-between sticky top-0 z-40 neo-hud-bracket backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-[3px] bg-gradient-to-tr from-[#00F5D4] via-[#00FF9D] to-violet-600 p-[1px] shadow-lg shadow-[#00F5D4]/20 group-hover:shadow-[#00F5D4]/50 transition-all duration-300">
                <div className="w-full h-full bg-[#050811] rounded-[2px] flex items-center justify-center">
                  <Hexagon className="w-4 h-4 text-[#00F5D4] fill-[#00F5D4]/20" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#00FF9D] rounded-full border-2 border-[#050811] animate-pulse" />
            </div>

            <div className="font-extrabold text-xs sm:text-sm tracking-wider text-[#E2E8F0] font-neo-display flex items-center gap-2">
              <span>NEXUS</span>
              <span className="bg-gradient-to-r from-[#00F5D4] via-[#00FF9D] to-violet-400 bg-clip-text text-transparent">
                QUANT
              </span>
              <span className="neo-hud-badge">
                [SYS::PAYWALL]
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/pro-dashboard?demo=true"
            className="flex items-center gap-1.5 px-3 py-1 bg-[#090E1C] hover:bg-[#0F172A] text-[#94A3B8] hover:text-[#E2E8F0] border border-cyan-500/20 rounded-[2px] text-xs font-neo-mono transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">НАЗАД ДО ТЕРМІНАЛУ</span>
          </Link>

          <button
            onClick={handleUnlockDemo}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00F5D4] hover:bg-[#00FF9D] text-[#050811] font-extrabold rounded-[2px] text-xs font-neo-mono transition-all shadow-[0_0_12px_rgba(0,245,212,0.3)]"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            БЕЗКОШТОВНИЙ ДЕМО-ДОСТУП
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 flex flex-col items-center justify-center text-center space-y-8 w-full">
        {/* Top Status Badge */}
        <div className="neo-hud-badge">
          <Lock className="w-3.5 h-3.5 text-[#FFB800]" />
          // INSTITUTIONAL QUANT SUITE & TRADELOCKER ROUTER
        </div>

        {/* Hero Title */}
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#E2E8F0] tracking-tight leading-tight font-neo-display">
            Алгоритмічний Трейдинг & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] via-[#00FF9D] to-violet-400 drop-shadow-[0_0_20px_rgba(0,245,212,0.4)]">
               TradeLocker Webhook Інтеграція
            </span>
          </h1>

          <p className="text-[#94A3B8] text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-neo-mono">
            Отримайте повний доступ до SMC матриці (FVG, BOS), Quantitative Z-Score алгоритмів та автоматичного виконання ордерів через TradeLocker API з оцінкою конфлюенсу &gt; 80%.
          </p>
        </div>

        {/* Billing Selector Switch */}
        <div className="flex items-center gap-2 bg-[#090E1C] p-1 rounded-[3px] border border-cyan-500/20 font-neo-mono text-xs shadow-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-1.5 rounded-[2px] font-extrabold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/50 shadow-[0_0_10px_rgba(0,245,212,0.3)]'
                : 'text-[#64748B] hover:text-[#E2E8F0]'
            }`}
          >
            ЩОМІСЯЧНО
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-1.5 rounded-[2px] font-extrabold transition-all flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/50 shadow-[0_0_10px_rgba(0,245,212,0.3)]'
                : 'text-[#64748B] hover:text-[#E2E8F0]'
            }`}
          >
            РІЧНИЙ ПЛАН
            <span className="text-[9px] bg-[#00FF9D]/20 text-[#00FF9D] px-1.5 py-0.5 rounded-[2px] border border-[#00FF9D]/40 font-mono-num font-extrabold">
              -20% ЗНИЖКА
            </span>
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl text-left pt-2">
          {/* Pro Trader Plan Card */}
          <div className="neo-panel rounded-[3px] p-6 space-y-6 relative overflow-hidden shadow-2xl neo-hud-bracket border-[#00F5D4]/40">
            <div className="absolute top-0 right-0 bg-[#00F5D4] text-[#050811] text-[9px] font-extrabold uppercase font-neo-mono px-3 py-1 rounded-bl-[3px] shadow-md">
              [НАЙБІЛЬШ ПОПУЛЯРНИЙ]
            </div>

            <div>
              <div className="text-[#00F5D4] font-neo-display text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00F5D4]" />
                PRO TRADER PLAN
              </div>
              <div className="flex items-baseline gap-2 mt-2 font-mono-num">
                <span className="text-4xl font-extrabold text-[#E2E8F0]">
                  ${billingCycle === 'monthly' ? '49' : '39'}
                </span>
                <span className="text-[#94A3B8] text-xs font-mono">/ місяць</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-[#E2E8F0] font-neo-mono border-t border-cyan-500/15 pt-4">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                <span>Real-Time Supabase WebSocket потік сигналів</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                <span>Інтерактивні TradingView графіки з індикаторами</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                <span>Smart Money Concepts (FVG, BOS, Liquidity Sweeps)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                <span>Кількісний Z-Score та ATR Волатильний Радар</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                <span>1-Click Автоматична відправка угод у TradeLocker</span>
              </li>
            </ul>

            <button
              onClick={handleUnlockDemo}
              className="w-full py-3 bg-[#00F5D4] hover:bg-[#00FF9D] text-[#050811] font-extrabold rounded-[2px] text-xs transition-all shadow-[0_0_18px_rgba(0,245,212,0.35)] flex items-center justify-center gap-2 group"
            >
              АКТИВУВАТИ PRO ТАРИФ [ДЕМО-РЕЖИМ]
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Institutional Quant Plan Card */}
          <div className="bg-[#090E1C] border border-cyan-500/20 rounded-[3px] p-6 space-y-6 relative overflow-hidden neo-hud-bracket">
            <div>
              <div className="text-violet-400 font-neo-display text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-violet-400" />
                INSTITUTIONAL QUANT
              </div>
              <div className="flex items-baseline gap-2 mt-2 font-mono-num">
                <span className="text-4xl font-extrabold text-[#E2E8F0]">
                  ${billingCycle === 'monthly' ? '199' : '159'}
                </span>
                <span className="text-[#94A3B8] text-xs font-mono">/ місяць</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-[#E2E8F0] font-neo-mono border-t border-cyan-500/15 pt-4">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Всі можливості тарифу Pro Trader</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Мульти-аккаунт маршрутизація TradeLocker</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Персональні Webhook-сповіщення важливих новин</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Окремий Supabase Edge Function API ендпоінт</span>
              </li>
            </ul>

            <button
              onClick={handleUnlockDemo}
              className="w-full py-3 bg-[#0F172A] hover:bg-[#090E1C] text-[#E2E8F0] border border-cyan-500/30 font-extrabold rounded-[2px] text-xs transition-all flex items-center justify-center gap-2 group"
            >
              ПІДКТЮЧИТИ ІНСТИТУЦІЙНИЙ ДОСТУП
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Tiers Comparison Table */}
        <div className="w-full max-w-4xl pt-6 space-y-3 font-neo-mono text-xs">
          <div className="text-left font-bold text-[#E2E8F0] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00F5D4]" />
            // МАТРИЦЯ ПОРІВНЯННЯ ТАРИФІВ
          </div>

          <div className="neo-panel rounded-[3px] overflow-x-auto border border-cyan-500/20 neo-hud-bracket">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#050811] border-b border-cyan-500/20 text-[10px] text-[#94A3B8] uppercase">
                  <th className="p-3">МОЖЛИВОСТІ PLATFORM</th>
                  <th className="p-3 text-center">DEMO / FREE</th>
                  <th className="p-3 text-center text-[#00F5D4]">PRO TRADER</th>
                  <th className="p-3 text-center text-violet-400">INSTITUTIONAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10 text-xs">
                <tr>
                  <td className="p-3 font-semibold text-[#E2E8F0]">TradingView Графіки та Потоки Цінових Парей</td>
                  <td className="p-3 text-center text-[#00FF9D]">✓</td>
                  <td className="p-3 text-center text-[#00FF9D]">✓</td>
                  <td className="p-3 text-center text-[#00FF9D]">✓</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#E2E8F0]">SMC Сигнали (FVG, BOS & Confluence Score &gt; 80%)</td>
                  <td className="p-3 text-center text-[#FF2A6D]">Затримка 15 хв</td>
                  <td className="p-3 text-center text-[#00FF9D] font-bold">Realtime (0ms)</td>
                  <td className="p-3 text-center text-[#00FF9D] font-bold">Realtime (0ms)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#E2E8F0]">Автоматичний TradeLocker REST API Webhook Bridge</td>
                  <td className="p-3 text-center text-[#64748B] font-mono">Тестовий мок</td>
                  <td className="p-3 text-center text-[#00FF9D] font-bold">1 Акаунт</td>
                  <td className="p-3 text-center text-[#00FF9D] font-bold">Безліміт Акаунтів</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#E2E8F0]">Фундаментальний Фільтр Новин (CPI, NFP, ECB)</td>
                  <td className="p-3 text-center text-[#FF2A6D]">✗</td>
                  <td className="p-3 text-center text-[#00FF9D]">✓</td>
                  <td className="p-3 text-center text-[#00FF9D]">✓</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#E2E8F0]">AI Торговий Щоденник з Навчанням Стратегії</td>
                  <td className="p-3 text-center text-[#FF2A6D]">Обмежено 5 угодами</td>
                  <td className="p-3 text-center text-[#00FF9D]">Необмежено</td>
                  <td className="p-3 text-center text-[#00FF9D]">Необмежено</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-cyan-500/20 bg-[#050811] px-6 py-6 text-center text-[11px] text-[#64748B] font-neo-mono">
        <div>NEXUS QUANT TERMINAL • Protected Quantitative Suite & TradeLocker Execution Engine</div>
      </footer>
    </div>
  );
}
