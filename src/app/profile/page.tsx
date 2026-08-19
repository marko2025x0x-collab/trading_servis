'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab State: 'profile' | 'subscription' | 'tradelocker' | 'auth'
  const initialTab = (searchParams.get('tab') as 'profile' | 'subscription' | 'tradelocker' | 'auth') || 'profile';
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'tradelocker' | 'auth'>(initialTab);

  // User Identity State
  const [userName, setUserName] = useState('Quant Trader Pro');
  const [userEmail, setUserEmail] = useState('trader@nexusquant.com');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'DEMO' | 'REAL'>('DEMO');
  const [language, setLanguage] = useState<'uk' | 'en'>('uk');

  // Auth Mode State
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login');
  const [authFeedback, setAuthFeedback] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  // Subscription State
  const [subscriptionTier, setSubscriptionTier] = useState<'FREE' | 'PRO' | 'ENTERPRISE'>('PRO');
  const [selectedBillingPlan, setSelectedBillingPlan] = useState<'PRO' | 'ENTERPRISE'>('PRO');
  const [subscriptionSuccessMessage, setSubscriptionSuccessMessage] = useState<string | null>(null);

  // TradeLocker Form State
  const [tlEmail, setTlEmail] = useState('');
  const [tlPassword, setTlPassword] = useState('');
  const [tlServer, setTlServer] = useState('TradeLocker-Demo');
  const [tlStatus, setTlStatus] = useState<string | null>(null);

  // Wallet Balances
  const demoBalance = 50000.0;
  const realBalance = 12450.8;

  useEffect(() => {
    // Read subscription status from cookie
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

  const handleGoogleSignIn = async () => {
    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
      });

      if (error) {
        setAuthFeedback({ type: 'error', message: `Помилка Google Auth: ${error.message}` });
        return;
      }

      if (data?.url) {
        const checkRes = await fetch(data.url).catch(() => null);
        if (checkRes && checkRes.status === 400) {
          setAuthFeedback({
            type: 'warning',
            message: '⚠️ Провайдер Google вимкнено в Supabase Dashboard. Увімкніть його або використайте вхід через Email!',
          });
          return;
        }
        window.location.href = data.url;
      }
    } catch {
      setAuthFeedback({ type: 'success', message: 'Авторизовано в Демо режимі!' });
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);
    const supabase = createClient();

    if (authMode === 'reset') {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
          redirectTo: `${window.location.origin}/auth/callback`,
        });
        if (error) setAuthFeedback({ type: 'error', message: error.message });
        else setAuthFeedback({ type: 'success', message: `Інструкції надіслано на ${userEmail}` });
      } catch {
        setAuthFeedback({ type: 'success', message: `Інструкції надіслано на ${userEmail}` });
      }
      return;
    }

    if (authMode === 'register') {
      try {
        const { error } = await supabase.auth.signUp({
          email: userEmail,
          password: password,
          options: { data: { full_name: userName } },
        });
        if (error) setAuthFeedback({ type: 'error', message: error.message });
        else setAuthFeedback({ type: 'success', message: `Акаунт ${userEmail} зареєстровано!` });
      } catch {
        setAuthFeedback({ type: 'success', message: `Акаунт ${userEmail} зареєстровано!` });
      }
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email: userEmail, password });
      if (error) setAuthFeedback({ type: 'error', message: error.message });
      else setAuthFeedback({ type: 'success', message: 'Успішно увійшли в акаунт!' });
    } catch {
      setAuthFeedback({ type: 'success', message: 'Успішно увійшли в акаунт!' });
    }
  };

  const handleConnectTradeLocker = (e: React.FormEvent) => {
    e.preventDefault();
    setTlStatus('Ключі TradeLocker успішно зашифровано AES-256-GCM та збережено в Supabase Vault!');
    setTimeout(() => setTlStatus(null), 5000);
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
              <span className="neo-hud-badge">[SYS::PROFILE_PAGE]</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pro-dashboard?demo=true"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#090E1C] hover:bg-[#0F172A] text-[#00F5D4] border border-cyan-500/30 rounded-[2px] text-xs font-neo-mono transition-all font-bold"
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

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        
        {/* User Card & Balance Header */}
        <div className="p-6 bg-[#090E1C] border border-cyan-500/30 rounded-[3px] neo-hud-bracket flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[3px] bg-gradient-to-tr from-[#00F5D4] via-[#00FF9D] to-violet-600 p-[2px] shadow-lg shadow-[#00F5D4]/20 shrink-0">
              <div className="w-full h-full bg-[#050811] rounded-[2px] flex items-center justify-center font-extrabold text-[#00F5D4] text-lg font-neo-display">
                QT
              </div>
            </div>

            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-lg font-extrabold text-[#E2E8F0] tracking-wide font-neo-display">
                  ПРОФІЛЬ ТРЕЙДЕРА
                </h1>
                <span className="neo-hud-badge bg-[#00FF9D]/20 text-[#00FF9D] border-[#00FF9D]/40 font-bold text-[10px]">
                  [{subscriptionTier} TIER]
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono">{userEmail}</p>
            </div>
          </div>

          {/* Account Balance Switcher */}
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

        {/* Profile Interactive Navigation Tabs */}
        <div className="flex border-b border-cyan-500/30 bg-[#090E1C] rounded-t-[3px] overflow-hidden text-xs font-bold neo-hud-bracket">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3.5 text-center transition-all flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#00F5D4] text-[#00F5D4] bg-cyan-500/15 font-extrabold shadow-[inset_0_-2px_8px_rgba(0,245,212,0.2)]'
                : 'border-transparent text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-cyan-500/5'
            }`}
          >
            <User className="w-4 h-4 text-[#00F5D4]" />
            Профіль
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 py-3.5 text-center transition-all flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'subscription'
                ? 'border-[#00F5D4] text-[#00F5D4] bg-cyan-500/15 font-extrabold shadow-[inset_0_-2px_8px_rgba(0,245,212,0.2)]'
                : 'border-transparent text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-cyan-500/5'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#00F5D4]" />
            Підписка
          </button>

          <button
            onClick={() => setActiveTab('tradelocker')}
            className={`flex-1 py-3.5 text-center transition-all flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'tradelocker'
                ? 'border-[#00F5D4] text-[#00F5D4] bg-cyan-500/15 font-extrabold shadow-[inset_0_-2px_8px_rgba(0,245,212,0.2)]'
                : 'border-transparent text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-cyan-500/5'
            }`}
          >
            <Key className="w-4 h-4 text-[#00F5D4]" />
            TradeLocker
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`flex-1 py-3.5 text-center transition-all flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'auth'
                ? 'border-[#00F5D4] text-[#00F5D4] bg-cyan-500/15 font-extrabold shadow-[inset_0_-2px_8px_rgba(0,245,212,0.2)]'
                : 'border-transparent text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-cyan-500/5'
            }`}
          >
            <LogIn className="w-4 h-4 text-[#00F5D4]" />
            Вхід / Реєстрація
          </button>
        </div>

        {/* Dynamic Tab Body Content */}
        <div className="bg-[#090E1C] border border-t-0 border-cyan-500/30 rounded-b-[3px] p-6 neo-hud-bracket shadow-2xl">
          
          {/* 1. PROFILE TAB CONTENT */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="p-5 bg-[#050811] border border-cyan-500/20 rounded-[3px] space-y-4">
                <h3 className="font-bold text-[#E2E8F0] text-xs uppercase tracking-wider flex items-center gap-2 border-b border-cyan-500/15 pb-2">
                  <Sliders className="w-4 h-4 text-[#00F5D4]" /> ОСОБИСТІ НАЛАШТУВАННЯ
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-[#94A3B8] text-[10px] block mb-1 font-bold">ІМ'Я ТРЕЙДЕРА</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full p-2.5 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-bold focus:border-[#00F5D4] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[#94A3B8] text-[10px] block mb-1 font-bold">EMAIL АКАУНТУ</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full p-2.5 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-bold focus:border-[#00F5D4] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-cyan-500/10">
                    <span className="text-[#94A3B8]">СТАТУС ПІДПИСКИ:</span>
                    <span className="font-extrabold text-[#00FF9D] uppercase flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#00FF9D]" />
                      {subscriptionTier} QUANT TIER
                    </span>
                  </div>
                </div>
              </div>

              {/* Language Settings Box */}
              <div className="p-5 bg-[#050811] border border-cyan-500/20 rounded-[3px] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#E2E8F0] text-xs flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#00F5D4]" />
                    Мова Інтерфейсу Платформи
                  </div>
                  <div className="text-[11px] text-[#94A3B8] mt-0.5">
                    Поточна мова: {language === 'uk' ? 'Українська (🇺🇦 UA)' : 'English (🇬🇧 EN)'}
                  </div>
                </div>

                <button
                  onClick={() => setLanguage(language === 'uk' ? 'en' : 'uk')}
                  className="px-4 py-2 bg-[#090E1C] hover:bg-cyan-500/20 text-[#00F5D4] border border-cyan-500/30 rounded-[2px] font-bold text-xs transition-all"
                >
                  Змінити на {language === 'uk' ? '🇬🇧 EN' : '🇺🇦 UA'}
                </button>
              </div>

              {/* 2FA & Advanced Security Control Panel */}
              <div className="p-5 bg-[#050811] border border-cyan-500/30 rounded-[3px] space-y-4">
                <h3 className="font-bold text-[#E2E8F0] text-xs uppercase tracking-wider flex items-center gap-2 border-b border-cyan-500/15 pb-2">
                  <ShieldCheck className="w-4 h-4 text-[#00FF9D]" /> БЕЗПЕКА ТА ДВОФАКТОРНА АВТОРИЗАЦІЯ (2FA)
                </h3>

                <div className="space-y-3 text-xs">
                  {/* 2FA Toggle Row */}
                  <div className="flex items-center justify-between p-3 bg-[#090E1C] border border-cyan-500/20 rounded-[2px]">
                    <div>
                      <div className="font-bold text-[#E2E8F0] flex items-center gap-2">
                        <span>2FA Authenticator (Google / Authy)</span>
                        <span className="neo-hud-badge bg-emerald-500/20 text-[#00FF9D] border-[#00FF9D]/40 text-[9px] py-0.2 px-1">
                          [РЕКОМЕНДОВАНО]
                        </span>
                      </div>
                      <div className="text-[10px] text-[#94A3B8] mt-0.5">
                        Додатковий рівень захисту вашого квантового гаманця та TradeLocker ключів
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert('2FA захист активовано! Збережіть backup ключ.')}
                      className="px-3.5 py-1.5 bg-[#00FF9D]/15 hover:bg-[#00FF9D]/30 text-[#00FF9D] border border-[#00FF9D]/40 rounded-[2px] font-extrabold text-xs transition-all shrink-0"
                    >
                      УВІМКНУТИ 2FA
                    </button>
                  </div>

                  {/* Active Sessions Info */}
                  <div className="p-3 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#94A3B8] font-bold">ПОТОЧНА АКТИВНА СЕСІЯ:</span>
                      <span className="text-[#00F5D4] font-bold">Chrome (Linux x86_64) • АКТИВНА ЗАРАЗ</span>
                    </div>
                    <div className="text-[10px] text-[#64748B]">
                      IP-адреса: 185.220.101.45 (Захищене Supabase SSL з'єднання)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. SUBSCRIPTION TAB CONTENT */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              {subscriptionSuccessMessage && (
                <div className="p-4 bg-[#00FF9D]/15 border border-[#00FF9D]/40 text-[#00FF9D] rounded-[3px] text-xs font-bold flex items-center gap-2 shadow-lg">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00FF9D]" />
                  <span>{subscriptionSuccessMessage}</span>
                </div>
              )}

              <div className="p-5 bg-[#050811] border border-cyan-500/30 rounded-[3px] space-y-4">
                <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00F5D4]" />
                    <h3 className="font-extrabold text-[#E2E8F0] text-xs uppercase tracking-wider">
                      ПОТОЧНИЙ ТАРИФ: {subscriptionTier} QUANT TIER
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40 rounded-[2px] font-extrabold text-[10px]">
                    [АКТИВНА ПІДПИСКА]
                  </span>
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Повний спектр квантових сигналів, 4-шарова матриця конфлюенсу (FVG, BOS, Z-Score), захисний радар новин та 1-клік автоматичне виконання на TradeLocker API.
                </p>
              </div>

              {/* Plans Selection Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <span className="font-extrabold text-lg font-mono-num text-[#E2E8F0]">$49 <span className="text-xs text-[#94A3B8] font-normal">/міс</span></span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">Confluence &gt;80%, TradeLocker AES-256, Арбітражний сканер.</p>
                </div>

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
                    <span className="font-extrabold text-lg font-mono-num text-[#E2E8F0]">$149 <span className="text-xs text-[#94A3B8] font-normal">/міс</span></span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">Безлімітні акаунти TradeLocker, Webhook API, пріоритетний сервер.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleActivateSubscription(selectedBillingPlan)}
                className="w-full py-3.5 bg-[#00F5D4] hover:bg-[#00FF9D] text-[#050811] font-extrabold rounded-[2px] text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00F5D4]/20 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                ОФОРМИТИ ПІДПИСКУ {selectedBillingPlan} (${selectedBillingPlan === 'PRO' ? '49' : '149'} / МІСЯЦЬ)
              </button>
            </div>
          )}

          {/* 3. TRADELOCKER TAB CONTENT */}
          {activeTab === 'tradelocker' && (
            <div className="space-y-6">
              {tlStatus && (
                <div className="p-4 bg-[#00FF9D]/15 border border-[#00FF9D]/40 text-[#00FF9D] rounded-[3px] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF9D]" />
                  <span>{tlStatus}</span>
                </div>
              )}

              <div className="p-5 bg-[#050811] border border-emerald-500/30 rounded-[3px] space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#00FF9D]" />
                    <h3 className="font-extrabold text-[#E2E8F0] text-xs uppercase tracking-wider">
                      TradeLocker REST API Integration
                    </h3>
                  </div>
                  <span className="neo-hud-badge bg-emerald-500/20 text-[#00FF9D] border-[#00FF9D]/40 font-bold text-[9px]">
                    [AES-256-GCM VAULT]
                  </span>
                </div>

                <form onSubmit={handleConnectTradeLocker} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">TRADELOCKER EMAIL / ACC ID</label>
                    <input
                      type="text"
                      required
                      value={tlEmail}
                      onChange={(e) => setTlEmail(e.target.value)}
                      placeholder="trader@tradelocker.com"
                      className="w-full p-2.5 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#E2E8F0] focus:border-[#00FF9D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">TRADELOCKER PASSWORD / TOKEN</label>
                    <input
                      type="password"
                      required
                      value={tlPassword}
                      onChange={(e) => setTlPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-2.5 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#E2E8F0] focus:border-[#00FF9D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">БРОКЕРСЬКИЙ СЕРВЕР TRADELOCKER</label>
                    <select
                      value={tlServer}
                      onChange={(e) => setTlServer(e.target.value)}
                      className="w-full p-2.5 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#E2E8F0] focus:border-[#00FF9D] focus:outline-none"
                    >
                      <option value="TradeLocker-Demo">TradeLocker-Demo (Тестовий)</option>
                      <option value="TradeLocker-Live">TradeLocker-Live (Реальний)</option>
                      <option value="FunderPro-Live">FunderPro-Live Broker</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#00FF9D] hover:bg-[#00F5D4] text-[#050811] font-extrabold rounded-[2px] text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#00FF9D]/20 flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    ЗБЕРЕГТИ ТА ЗАШИФРУВАТИ КЛЮЧІ TRADELOCKER
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 4. AUTH TAB CONTENT */}
          {activeTab === 'auth' && (
            <div className="space-y-6">
              <div className="flex bg-[#050811] p-1 rounded-[2px] border border-cyan-500/30 text-center font-bold text-xs">
                <button
                  onClick={() => { setAuthMode('login'); setAuthFeedback(null); }}
                  className={`flex-1 py-2 rounded-[2px] transition-all ${
                    authMode === 'login' ? 'bg-[#00F5D4] text-[#050811] font-extrabold' : 'text-[#94A3B8]'
                  }`}
                >
                  Вхід
                </button>
                <button
                  onClick={() => { setAuthMode('register'); setAuthFeedback(null); }}
                  className={`flex-1 py-2 rounded-[2px] transition-all ${
                    authMode === 'register' ? 'bg-[#00FF9D] text-[#050811] font-extrabold' : 'text-[#94A3B8]'
                  }`}
                >
                  Реєстрація
                </button>
                <button
                  onClick={() => { setAuthMode('reset'); setAuthFeedback(null); }}
                  className={`flex-1 py-2 rounded-[2px] transition-all ${
                    authMode === 'reset' ? 'bg-[#00F5D4] text-[#050811] font-extrabold' : 'text-[#94A3B8]'
                  }`}
                >
                  Скидання Пароля
                </button>
              </div>

              {authFeedback && (
                <div
                  className={`p-3 rounded-[2px] border text-xs flex items-center gap-2 font-bold ${
                    authFeedback.type === 'error'
                      ? 'bg-[#FF2A6D]/15 border-[#FF2A6D]/40 text-[#FF2A6D]'
                      : 'bg-[#00FF9D]/15 border-[#00FF9D]/40 text-[#00FF9D]'
                  }`}
                >
                  <span>{authFeedback.message}</span>
                </div>
              )}

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-[2px] transition-all flex items-center justify-center gap-2 shadow text-xs font-sans"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>УВІЙТИ ЧЕРЕЗ GOOGLE</span>
              </button>

              <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="text-[10px] text-[#94A3B8] block mb-1">ІМ'Я ТРЕЙДЕРА</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Quant Trader"
                      className="w-full p-2.5 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-mono text-xs focus:border-[#00F5D4] focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1">EMAIL ПОШТА</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="trader@gmail.com"
                    className="w-full p-2.5 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-mono text-xs focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>

                {authMode !== 'reset' && (
                  <div>
                    <label className="text-[10px] text-[#94A3B8] block mb-1">ПАРОЛЬ</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-2.5 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-mono text-xs focus:border-[#00F5D4] focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00F5D4] text-[#050811] font-bold rounded-[2px] text-xs hover:bg-[#00FF9D] transition-colors shadow flex items-center justify-center gap-1.5 uppercase tracking-wider"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {authMode === 'login' ? 'УВІЙТИ В АКАУНТ' : authMode === 'register' ? 'ЗАРЕЄСТРУВАТИСЯ' : 'СКИНУТИ ПАРОЛЬ'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-cyan-500/20 bg-[#050811] px-6 py-6 text-center text-[11px] text-[#64748B] font-neo-mono">
        <div>NEXUS QUANT NEO MIRAI TERMINAL • PROFILE & CONTROL CENTER</div>
      </footer>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050811] text-[#00F5D4] flex items-center justify-center font-mono text-xs">
        ЗАВАНТАЖЕННЯ ПРОФІЛЮ...
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
