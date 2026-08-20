'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
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
  CheckCircle2,
  Sparkles,
  Mail,
  Check,
  Star,
} from 'lucide-react';

export default function LandingPage() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus(`Дякуємо! Пошту ${newsletterEmail} успішно додано до VIP-списку сигналів.`);
    setNewsletterEmail('');
  };

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
            className="flex items-center gap-1.5 text-xs text-[#E2E8F0] hover:text-[#00F5D4] font-neo-mono font-bold transition-colors uppercase tracking-wider px-3.5 py-1.5 rounded-[2px] bg-[#090E1C] border border-cyan-500/30 hover:border-[#00F5D4]"
          >
            <LogIn className="w-3.5 h-3.5 text-[#00F5D4]" />
            ВХІД
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-1.5 text-xs text-[#00FF9D] hover:text-white font-neo-mono font-bold transition-colors uppercase tracking-wider px-3.5 py-1.5 rounded-[2px] bg-[#00FF9D]/10 border border-[#00FF9D]/40 hover:bg-[#00FF9D]/20"
          >
            <UserPlus className="w-3.5 h-3.5" />
            РЕЄСТРАЦІЯ
          </Link>

          <Link
            href="/pro-dashboard?demo=true"
            className="flex items-center gap-2 px-4 py-1.5 bg-[#00F5D4] hover:bg-[#00FF9D] text-[#050811] font-extrabold rounded-[2px] text-xs font-neo-mono transition-all shadow-[0_0_12px_rgba(0,245,212,0.3)]"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            ТЕРМІНАЛ
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-16 lg:py-24 max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
        <div className="neo-hud-badge">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00F5D4]" />
          КВАНТОВИЙ АЛГОРИТМІЧНИЙ ТЕРМІНАЛ ТА ТРЕЙДІНГ-СУМІСНИЙ WEBHOOK BRIDGE
        </div>

        <h1 className="text-3xl sm:text-6xl font-extrabold text-[#E2E8F0] tracking-tight leading-tight max-w-4xl font-neo-display">
          Високоточні Квантові Сигнали <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] via-[#00FF9D] to-violet-400 drop-shadow-[0_0_20px_rgba(0,245,212,0.4)]">
            Smart Money Concepts & TradeLocker
          </span>
        </h1>

        <p className="text-[#94A3B8] text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
          Поєднує свічкові паттерни, Smart Money Concepts (FVG, BOS), статистичну реверсію Z-Score та фільтрацію новин. Сигнали надсилаються лише при <span className="text-[#00F5D4] font-mono-num font-bold">Confluence Score &gt; 80%</span> з 1-клік виконання у TradeLocker.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#00FF9D] hover:bg-[#00F5D4] text-[#050811] font-extrabold rounded-[3px] text-xs font-neo-mono transition-all shadow-[0_0_20px_rgba(0,255,157,0.4)] flex items-center justify-center gap-2 group uppercase tracking-wider"
          >
            <UserPlus className="w-4 h-4" />
            ЗАРЕЄСТРУВАТИСЯ ЗАРАЗ
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#090E1C] hover:bg-[#0F172A] border border-cyan-500/30 text-[#00F5D4] font-bold rounded-[3px] text-xs font-neo-mono transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <LogIn className="w-4 h-4 text-[#00F5D4]" />
            УВІЙТИ В АКАУНТ
          </Link>
        </div>
      </section>

      {/* Feature Matrix Grid */}
      <section className="px-6 py-14 bg-[#090E1C]/80 border-t border-cyan-500/20 neo-hud-bracket">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] font-neo-display">
              4-Шарова Конфлюенс-Матриця
            </h2>
            <p className="text-[#64748B] text-xs max-w-xl mx-auto font-mono">
              {'// Багаторівневий алгоритм валідації угод перед їх відправкою на брокера'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Feature 1 */}
            <div className="p-5 neo-panel rounded-[3px] space-y-3 font-neo-mono">
              <div className="w-9 h-9 rounded-[2px] bg-[#00F5D4]/10 border border-[#00F5D4]/30 flex items-center justify-center text-[#00F5D4]">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">Price Action & Паттерни</h3>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Автоматичне визначення Bullish/Bearish Pin Bar та поглинань у структурних зонах ліквідності.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 neo-panel rounded-[3px] space-y-3 font-neo-mono">
              <div className="w-9 h-9 rounded-[2px] bg-[#00FF9D]/10 border border-[#00FF9D]/30 flex items-center justify-center text-[#00FF9D]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">Smart Money Concepts</h3>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Аналіз Fair Value Gap (FVG), Break of Structure (BOS) та Liquidity Sweeps для точного входу.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 neo-panel rounded-[3px] space-y-3 font-neo-mono">
              <div className="w-9 h-9 rounded-[2px] bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Gauge className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">Квантова Волатильність</h3>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Алгоритми Z-Score реверсії до середнього значення, динамічні смуги ATR та ROC індикатори.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 neo-panel rounded-[3px] space-y-3 font-neo-mono">
              <div className="w-9 h-9 rounded-[2px] bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800]">
                <Newspaper className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">Фундаментальний Радар</h3>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Автоматичне блокування сигналів за 30 хвилин до виходу важливих новин (CPI, NFP, рішення ставок).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Tiers Section */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2">
          <div className="neo-hud-badge">
            <Lock className="w-3.5 h-3.5 text-[#00F5D4]" />
            ТАРИФНІ ПЛАНИ ТА ВАРТІСТЬ ПІДПИСКИ
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#E2E8F0] font-neo-display">
            Оберіть свій рівень доступу до терміналу
          </h2>
          <p className="text-[#94A3B8] text-xs max-w-xl mx-auto">
            Отримайте доступ до квантових сигналів, шифрованого сховища TradeLocker та сканера арбітражу
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FREE TIER */}
          <div className="p-6 bg-[#090E1C] border border-cyan-500/20 rounded-[3px] space-y-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all font-neo-mono">
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#94A3B8] uppercase">FREE DEMO TIER</div>
              <div className="text-3xl font-extrabold text-[#E2E8F0] font-mono-num">$0 <span className="text-xs font-normal text-[#64748B]">/ місяць</span></div>
              <p className="text-xs text-[#94A3B8]">Базовий ознайомчий доступ до графіків та демо-сигналів терміналу.</p>
              
              <ul className="space-y-2.5 text-xs text-[#CBD5E1] pt-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00F5D4]" /> Базові графіки валютних пар</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00F5D4]" /> Демо-баланс $50,000</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00F5D4]" /> Сигнали з Confluence Score &lt; 70%</li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-2.5 bg-[#050811] hover:bg-cyan-500/10 text-[#00F5D4] border border-cyan-500/30 rounded-[2px] font-bold text-center text-xs transition-all block"
            >
              ЗАРЕЄСТРУВАТИСЯ БЕЗКОШТОВНО
            </Link>
          </div>

          {/* PRO QUANT TIER */}
          <div className="p-6 bg-gradient-to-b from-[#090E1C] via-[#0D162A] to-[#090E1C] border-2 border-[#00F5D4] rounded-[3px] space-y-6 flex flex-col justify-between shadow-[0_0_30px_rgba(0,245,212,0.15)] relative font-neo-mono">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#00F5D4] text-[#050811] text-[10px] font-extrabold uppercase rounded-[2px] shadow">
              РЕКОМЕНДОВАНО ДЛЯ ТРЕЙДЕРІВ
            </div>

            <div className="space-y-4 pt-1">
              <div className="text-xs font-bold text-[#00F5D4] uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> PRO QUANT TIER
              </div>
              <div className="text-3xl font-extrabold text-[#00F5D4] font-mono-num">$49 <span className="text-xs font-normal text-[#94A3B8]">/ місяць</span></div>
              <p className="text-xs text-[#94A3B8]">Повний спектр квантових сигналів та автоматизація вказівками у TradeLocker.</p>
              
              <ul className="space-y-2.5 text-xs text-[#E2E8F0] pt-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00FF9D]" /> <strong>Confluence Score &gt; 80%</strong></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00FF9D]" /> <strong>TradeLocker AES-256 Execution</strong></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00FF9D]" /> Арбітражний сканер реального часу</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00FF9D]" /> Фундаментальний захисний радар</li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3 bg-[#00F5D4] hover:bg-[#00FF9D] text-[#050811] font-extrabold rounded-[2px] text-center text-xs transition-all block shadow-lg uppercase tracking-wider"
            >
              ПІДПИСАТИСЯ НА PRO ($49)
            </Link>
          </div>

          {/* VIP ENTERPRISE TIER */}
          <div className="p-6 bg-[#090E1C] border border-violet-500/30 rounded-[3px] space-y-6 flex flex-col justify-between hover:border-violet-500/50 transition-all font-neo-mono">
            <div className="space-y-4">
              <div className="text-xs font-bold text-violet-400 uppercase">ENTERPRISE VIP</div>
              <div className="text-3xl font-extrabold text-[#E2E8F0] font-mono-num">$149 <span className="text-xs font-normal text-[#64748B]">/ місяць</span></div>
              <p className="text-xs text-[#94A3B8]">Для проп-трейдерів, фондів та інституційних керуючих рахунками.</p>
              
              <ul className="space-y-2.5 text-xs text-[#CBD5E1] pt-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Безлімітні акаунти TradeLocker</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Персональний Webhook Bridge API</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> Пріоритетний сервер сигналів (&lt;10ms)</li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-2.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 rounded-[2px] font-bold text-center text-xs transition-all block"
            >
              ОТРИМАТИ ENTERPRISE ACCESS
            </Link>
          </div>
        </div>
      </section>

      {/* Email Subscription Newsletter Section */}
      <section className="px-6 py-14 bg-[#090E1C] border-t border-b border-cyan-500/20 max-w-5xl mx-auto w-full rounded-[3px] neo-hud-bracket my-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-4">
          <div className="space-y-2 max-w-lg">
            <div className="neo-hud-badge">
              <Mail className="w-3.5 h-3.5 text-[#00F5D4]" /> EMAIL ПІДПИСКА НА СИГНАЛИ
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#E2E8F0] font-neo-display">
              Отримуйте аналітику та топові сигнали на пошту
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Підпишіться на щоденний розсилку квантового аналізу ринку та сповіщень. Без спаму.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5 shrink-0">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="trader@gmail.com"
              className="px-4 py-2.5 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#E2E8F0] focus:border-[#00F5D4] focus:outline-none w-full sm:w-64"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#00F5D4] hover:bg-[#00FF9D] text-[#050811] font-extrabold rounded-[2px] text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#00F5D4]/20 shrink-0"
            >
              ПІДПИСАТИСЯ
            </button>
          </form>
        </div>

        {newsletterStatus && (
          <div className="mt-4 p-3 bg-[#00FF9D]/15 border border-[#00FF9D]/40 text-[#00FF9D] rounded-[2px] text-xs font-bold text-center">
            {newsletterStatus}
          </div>
        )}
      </section>

      {/* TradeLocker Webhook Banner */}
      <section className="px-6 py-10 max-w-5xl mx-auto w-full">
        <div className="p-6 sm:p-8 neo-panel rounded-[3px] flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl neo-hud-bracket">
          <div className="space-y-2 max-w-xl">
            <div className="neo-hud-badge">
              <Send className="w-3.5 h-3.5 text-[#00F5D4]" /> TRADELOCKER REST API / WEBHOOK
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#E2E8F0] font-neo-display">
              1-Клік Автоматичне Виконання на TradeLocker
            </h2>
            <p className="text-[#94A3B8] text-xs leading-relaxed">
              Надсилайте ордери безпосередньо у ваш брокерський акаунт з розрахованими рівними Entry, Stop Loss та Take Profit.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="px-6 py-3 bg-[#00FF9D] hover:bg-[#00F5D4] text-[#050811] font-extrabold rounded-[2px] text-xs font-neo-mono transition-all shadow-[0_0_15px_rgba(0,255,157,0.3)] uppercase tracking-wider"
            >
              ЗАРЕЄСТРУВАТИСЯ
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-cyan-500/20 bg-[#050811] px-6 py-6 text-center text-[11px] text-[#64748B] font-neo-mono">
        <div>NEXUS QUANT NEO MIRAI TERMINAL • Powered by Next.js 16, Supabase Realtime & TradeLocker API</div>
      </footer>
    </div>
  );
}
