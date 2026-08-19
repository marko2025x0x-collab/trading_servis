'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ShieldCheck,
  Globe,
  Key,
  CreditCard,
  LogIn,
  UserPlus,
  Sparkles,
  Sliders,
  ArrowLeft,
  Check,
  Zap,
  Hexagon,
  LogOut,
  Bell,
  Lock,
  ExternalLink,
  Shield,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const router = useRouter();

  // User Profile State
  const [userName, setUserName] = useState('Quant Trader Pro');
  const [userEmail, setUserEmail] = useState('trader@nexusquant.com');
  const [accountType, setAccountType] = useState<'DEMO' | 'REAL'>('DEMO');
  const [language, setLanguage] = useState<'uk' | 'en'>('uk');

  // Subscription State
  const [subscriptionTier, setSubscriptionTier] = useState<'FREE' | 'PRO' | 'ENTERPRISE'>('PRO');
  const [selectedBillingPlan, setSelectedBillingPlan] = useState<'PRO' | 'ENTERPRISE'>('PRO');
  const [subscriptionSuccessMessage, setSubscriptionSuccessMessage] = useState<string | null>(null);

  // Settings State
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [defaultSymbol, setDefaultSymbol] = useState('EUR/USD');

  // Feedback Banner
  const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Balances
  const demoBalance = 50000.0;
  const realBalance = 12450.8;

  useEffect(() => {
    // Read subscription cookie
    const hasProCookie =
      document.cookie.includes('user_subscription_status=pro') ||
      document.cookie.includes('user_subscription_status=enterprise');
    if (hasProCookie) {
      setSubscriptionTier('PRO');
    }
  }, []);

  const handleActivateSubscription = (plan: 'PRO' | 'ENTERPRISE') => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = `user_subscription_status=${plan.toLowerCase()}; path=/; expires=${expires.toUTCString()}`;
    setSubscriptionTier(plan);
    setSubscriptionSuccessMessage(
      `ПІДПИСКУ ${plan} QUANT TIER УСПІШНО ОФОРМЛЕНО ТА АКТИВОВАНО ДО ${expires.toLocaleDateString()}`
    );
    setTimeout(() => setSubscriptionSuccessMessage(null), 5000);
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    document.cookie = 'user_subscription_status=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#050811] text-[#E2E8F0] flex flex-col font-neo-mono selection:bg-[#00F5D4] selection:text-[#050811]">
      {/* Navigation Header */}
      <nav className="w-full border-b border-cyan-500/20 bg-[#090E1C]/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 neo-hud-bracket">
        <div className="flex items-center gap-3">
          <Link href="/pro-dashboard?demo=true" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-[3px] bg-gradient-to-tr from-[#00F5D4] via-[#00FF9D] to-violet-600 p-[1px] shadow-lg shadow-[#00F5D4]/20 group-hover:shadow-[#00F5D4]/50 transition-all">
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
              <span className="neo-hud-badge">[PROFILE::PAGE]</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pro-dashboard?demo=true"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#090E1C] hover:bg-[#0F172A] text-[#00F5D4] border border-cyan-500/30 rounded-[2px] text-xs font-neo-mono transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            ПОВЕРНУТИСЯ В ТЕРМІНАЛ
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF2A6D]/10 hover:bg-[#FF2A6D]/20 text-[#FF2A6D] border border-[#FF2A6D]/30 rounded-[2px] text-xs font-neo-mono transition-all font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            ВИХІД
          </button>
        </div>
      </nav>

      {/* Main Profile Container */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full space-y-6">
        
        {/* Profile Identity Header Banner */}
        <div className="p-6 bg-[#090E1C] border border-cyan-500/30 rounded-[3px] neo-hud-bracket flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[3px] bg-gradient-to-tr from-[#00F5D4] via-[#00FF9D] to-violet-600 p-[2px] shadow-lg shadow-[#00F5D4]/20 shrink-0">
              <div className="w-full h-full bg-[#050811] rounded-[2px] flex items-center justify-center font-extrabold text-[#00F5D4] text-xl font-neo-display">
                QT
              </div>
            </div>

            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-xl font-extrabold text-[#E2E8F0] tracking-wide font-neo-display">
                  {userName}
                </h1>
                <span className="neo-hud-badge bg-[#00FF9D]/20 text-[#00FF9D] border-[#00FF9D]/40 font-bold text-[10px]">
                  [{subscriptionTier} QUANT TIER]
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono">{userEmail}</p>
              <div className="text-[10px] text-[#64748B] flex items-center gap-2 justify-center md:justify-start">
                <span>ID: USR-892401-NX</span>
                <span>•</span>
                <span>З нами з 2026</span>
              </div>
            </div>
          </div>

          {/* Quick Balance Switcher */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => setAccountType('DEMO')}
              className={`p-3 rounded-[3px] border text-left transition-all ${
                accountType === 'DEMO'
                  ? 'bg-cyan-500/15 border-[#00F5D4] text-[#E2E8F0] shadow-[0_0_12px_rgba(0,245,212,0.15)]'
                  : 'bg-[#050811] border-slate-800 text-[#94A3B8] hover:border-slate-700'
              }`}
            >
              <div className="text-[9px] uppercase font-bold text-[#94A3B8]">DEMO БАЛАНС</div>
              <div className="text-base font-extrabold font-mono-num text-[#00F5D4]">
                ${demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </button>

            <button
              onClick={() => setAccountType('REAL')}
              className={`p-3 rounded-[3px] border text-left transition-all ${
                accountType === 'REAL'
                  ? 'bg-emerald-500/15 border-[#00FF9D] text-[#E2E8F0] shadow-[0_0_12px_rgba(0,255,157,0.15)]'
                  : 'bg-[#050811] border-slate-800 text-[#94A3B8] hover:border-slate-700'
              }`}
            >
              <div className="text-[9px] uppercase font-bold text-[#94A3B8]">REAL БАЛАНС</div>
              <div className="text-base font-extrabold font-mono-num text-[#00FF9D]">
                ${realBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </button>
          </div>
        </div>

        {/* Status Feedback Banner */}
        {subscriptionSuccessMessage && (
          <div className="p-4 bg-[#00FF9D]/15 border border-[#00FF9D]/40 text-[#00FF9D] rounded-[3px] text-xs font-bold flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00FF9D]" />
            <span>{subscriptionSuccessMessage}</span>
          </div>
        )}

        {/* 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Personal Info & Platform Settings */}
          <div className="space-y-6">
            
            {/* Personal Details */}
            <div className="p-5 bg-[#090E1C] border border-cyan-500/20 rounded-[3px] neo-hud-bracket space-y-4">
              <h2 className="font-bold text-[#E2E8F0] text-xs uppercase tracking-wider flex items-center gap-2 border-b border-cyan-500/15 pb-2">
                <Sliders className="w-4 h-4 text-[#00F5D4]" /> Особисті Дані
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[#94A3B8] text-[10px] block mb-1 font-bold">ІМ'Я ТРЕЙДЕРА</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2.5 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-bold focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#94A3B8] text-[10px] block mb-1 font-bold">EMAIL АКАУНТУ</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full p-2.5 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-bold focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Platform Preferences */}
            <div className="p-5 bg-[#090E1C] border border-cyan-500/20 rounded-[3px] neo-hud-bracket space-y-4">
              <h2 className="font-bold text-[#E2E8F0] text-xs uppercase tracking-wider flex items-center gap-2 border-b border-cyan-500/15 pb-2">
                <Globe className="w-4 h-4 text-[#00F5D4]" /> Налаштування Платформи
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Мова Інтерфейсу:</span>
                  <button
                    onClick={() => setLanguage(language === 'uk' ? 'en' : 'uk')}
                    className="px-3 py-1 bg-[#050811] text-[#00F5D4] border border-cyan-500/30 rounded-[2px] font-bold"
                  >
                    {language === 'uk' ? '🇺🇦 UA' : '🇬🇧 EN'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Звукові Сповіщення:</span>
                  <button
                    onClick={() => setSoundAlerts(!soundAlerts)}
                    className={`px-3 py-1 rounded-[2px] font-bold border ${
                      soundAlerts ? 'bg-[#00FF9D]/20 text-[#00FF9D] border-[#00FF9D]/40' : 'bg-[#050811] text-[#64748B] border-slate-800'
                    }`}
                  >
                    {soundAlerts ? 'УВІМКНЕНО' : 'ВИМКНЕНО'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Валютна Пара за Замовчуванням:</span>
                  <select
                    value={defaultSymbol}
                    onChange={(e) => setDefaultSymbol(e.target.value)}
                    className="p-1 bg-[#050811] text-[#E2E8F0] border border-cyan-500/30 rounded-[2px] font-bold text-xs"
                  >
                    <option value="EUR/USD">EUR/USD</option>
                    <option value="GBP/USD">GBP/USD</option>
                    <option value="BTC/USD">BTC/USD</option>
                    <option value="XAU/USD">XAU/USD (Gold)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Quick Links */}
            <div className="p-5 bg-[#090E1C] border border-cyan-500/20 rounded-[3px] neo-hud-bracket space-y-3">
              <h2 className="font-bold text-[#E2E8F0] text-xs uppercase tracking-wider flex items-center gap-2 border-b border-cyan-500/15 pb-2">
                <Lock className="w-4 h-4 text-[#00F5D4]" /> Безпека та Акаунт
              </h2>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="p-2.5 bg-[#050811] hover:bg-cyan-500/10 text-[#00F5D4] border border-cyan-500/30 rounded-[2px] text-center font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Сторінка Входу
                </Link>

                <Link
                  href="/register"
                  className="p-2.5 bg-[#050811] hover:bg-emerald-500/10 text-[#00FF9D] border border-emerald-500/30 rounded-[2px] text-center font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Сторінка Реєстрації
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Subscription Manager & TradeLocker Vault */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Interactive Subscription Manager */}
            <div className="p-6 bg-gradient-to-br from-[#090E1C] via-[#0B1226] to-[#090E1C] border border-[#00F5D4]/40 rounded-[3px] neo-hud-bracket space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
                <div>
                  <div className="neo-hud-badge mb-1">
                    <CreditCard className="w-3.5 h-3.5 text-[#00F5D4]" /> ТАРИФНИЙ ПЛАН ТА КЕРУВАННЯ ПІДПИСКОЮ
                  </div>
                  <h2 className="text-xl font-extrabold text-[#E2E8F0] font-neo-display">
                    Ваш поточний рівень доступу: <span className="text-[#00F5D4]">{subscriptionTier} QUANT</span>
                  </h2>
                </div>

                <Link
                  href="/paywall"
                  className="px-3.5 py-1.5 bg-[#050811] hover:bg-cyan-500/10 text-[#00F5D4] border border-cyan-500/30 rounded-[2px] text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>ПОРІВНЯТИ ТАРИФИ</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Plans Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PRO QUANT PLAN */}
                <div
                  onClick={() => setSelectedBillingPlan('PRO')}
                  className={`p-5 rounded-[3px] border cursor-pointer transition-all space-y-3 ${
                    selectedBillingPlan === 'PRO'
                      ? 'bg-cyan-500/10 border-[#00F5D4] text-[#E2E8F0] shadow-[0_0_15px_rgba(0,245,212,0.15)]'
                      : 'bg-[#050811] border-slate-800 text-[#94A3B8] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#00F5D4] uppercase flex items-center gap-1.5">
                      <Zap className="w-4 h-4 fill-current" /> PRO QUANT TIER
                    </span>
                    <span className="font-extrabold text-lg font-mono-num text-[#E2E8F0]">
                      $49 <span className="text-xs text-[#94A3B8] font-normal">/міс</span>
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-[#CBD5E1] pt-1">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00F5D4]" /> Confluence Score &gt;80%</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00F5D4]" /> TradeLocker AES-256 Execution</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00F5D4]" /> Сканер Арбітражу реального часу</li>
                  </ul>
                </div>

                {/* ENTERPRISE VIP PLAN */}
                <div
                  onClick={() => setSelectedBillingPlan('ENTERPRISE')}
                  className={`p-5 rounded-[3px] border cursor-pointer transition-all space-y-3 ${
                    selectedBillingPlan === 'ENTERPRISE'
                      ? 'bg-violet-500/10 border-violet-500 text-[#E2E8F0] shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                      : 'bg-[#050811] border-slate-800 text-[#94A3B8] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-violet-400 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> ENTERPRISE VIP TIER
                    </span>
                    <span className="font-extrabold text-lg font-mono-num text-[#E2E8F0]">
                      $149 <span className="text-xs text-[#94A3B8] font-normal">/міс</span>
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-[#CBD5E1] pt-1">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Безлімітні акаунти TradeLocker</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Webhook Bridge API</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Пріоритетний сервер (&lt;10ms)</li>
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleActivateSubscription(selectedBillingPlan)}
                className="w-full py-3.5 bg-[#00F5D4] hover:bg-[#00FF9D] text-[#050811] font-extrabold rounded-[2px] text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00F5D4]/20 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                ОФОРМИТИ ПІДПИСКУ {selectedBillingPlan} QUANT (${selectedBillingPlan === 'PRO' ? '49' : '149'} / МІСЯЦЬ)
              </button>
            </div>

            {/* TradeLocker Vault Section */}
            <div className="p-6 bg-[#090E1C] border border-cyan-500/20 rounded-[3px] neo-hud-bracket space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#00FF9D]" />
                  <h2 className="font-extrabold text-[#E2E8F0] text-xs uppercase tracking-wider">
                    TradeLocker Encrypted Vault
                  </h2>
                </div>
                <span className="neo-hud-badge bg-emerald-500/20 text-[#00FF9D] border-[#00FF9D]/40 font-bold text-[9px]">
                  [AES-256-GCM ENCRYPTED]
                </span>
              </div>

              <div className="p-4 bg-[#050811] border border-cyan-500/20 rounded-[3px] flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-extrabold text-xs text-[#E2E8F0] flex items-center gap-2">
                    <span>TradeLocker Demo Server (AccID: 1787179051833048700)</span>
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">
                    Зашифровано в ліцензійному сховищі • Статус: Підключено
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-emerald-500/20 text-[#00FF9D] text-[10px] font-bold rounded-[2px]">
                    ONLINE
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-cyan-500/20 bg-[#050811] px-6 py-6 text-center text-[11px] text-[#64748B] font-neo-mono">
        <div>NEXUS QUANT NEO MIRAI TERMINAL • Dedicated User Profile & Account Management</div>
      </footer>
    </div>
  );
}
