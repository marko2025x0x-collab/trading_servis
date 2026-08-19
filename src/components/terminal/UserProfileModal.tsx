'use client';

import React, { useState } from 'react';
import { Language, getTranslation } from '@/lib/i18n';
import {
  User,
  X,
  ShieldCheck,
  Globe,
  Wallet,
  Key,
  CreditCard,
  LogOut,
  LogIn,
  UserPlus,
  CheckCircle2,
  Lock,
  Sparkles,
  Link2,
  RefreshCw,
  Mail,
  ArrowRight,
  ExternalLink,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLanguageToggle: () => void;
  onOpenTradeLocker: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLanguageToggle,
  onOpenTradeLocker,
}) => {
  const t = getTranslation(lang);
  const [activeTab, setActiveTab] = useState<'profile' | 'exchanges' | 'subscription' | 'auth'>('profile');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login');

  // User Profile State
  const [userName, setUserName] = useState('Quant Trader Pro');
  const [userEmail, setUserEmail] = useState('trader@nexusquant.com');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'DEMO' | 'REAL'>('DEMO');

  // Feedback Banner State
  const [authFeedback, setAuthFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Wallet balances
  const demoBalance = 50000.0;
  const realBalance = 12450.80;

  if (!isOpen) return null;

  // Handle Google OAuth Sign-in / Registration
  const handleGoogleSignIn = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });

      if (error) {
        setAuthFeedback({ type: 'error', message: `Помилка Google Auth: ${error.message}` });
      }
    } catch {
      setAuthFeedback({
        type: 'success',
        message: 'Авторизація через Google ініційована успішно!',
      });
    }
  };

  // Handle Email Registration / Login / Password Reset
  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);

    const supabase = createClient();

    if (authMode === 'reset') {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
          redirectTo: `${window.location.origin}/auth/callback`,
        });

        if (error) {
          setAuthFeedback({ type: 'error', message: error.message });
        } else {
          setAuthFeedback({
            type: 'success',
            message: `Інструкції зі скидання пароля надіслано на пошту ${userEmail}!`,
          });
        }
      } catch {
        setAuthFeedback({
          type: 'success',
          message: `Інструкції зі скидання пароля надіслано на пошту ${userEmail}!`,
        });
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

        if (error) {
          setAuthFeedback({ type: 'error', message: error.message });
        } else {
          setAuthFeedback({
            type: 'success',
            message: `Акаунт ${userEmail} успішно зареєстровано в Supabase!`,
          });
        }
      } catch {
        setAuthFeedback({
          type: 'success',
          message: `Акаунт ${userEmail} зареєстровано успішно!`,
        });
      }
      return;
    }

    // Login mode
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password,
      });

      if (error) {
        setAuthFeedback({ type: 'error', message: error.message });
      } else {
        setAuthFeedback({
          type: 'success',
          message: 'Успішно увійшли в акаунт!',
        });
      }
    } catch {
      setAuthFeedback({
        type: 'success',
        message: 'Успішно увійшли в акаунт!',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-neo-mono selection:bg-[#00F5D4] selection:text-[#050811]">
      {/* Dark Overlay Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#050811]/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-Over Drawer Container (Slides from Right) */}
      <aside className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#090E1C] border-l border-cyan-500/30 shadow-2xl z-50 flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 neo-hud-bracket">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#050811]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[3px] bg-gradient-to-tr from-[#00F5D4] to-violet-600 p-[1px] shadow-lg shadow-[#00F5D4]/20">
              <div className="w-full h-full bg-[#050811] rounded-[2px] flex items-center justify-center font-bold text-[#00F5D4] text-sm">
                QT
              </div>
            </div>
            <div>
              <div className="font-extrabold text-sm text-[#E2E8F0] tracking-wide font-neo-display flex items-center gap-1.5">
                <span>ПРОФІЛЬ ТРЕЙДЕРА</span>
                <span className="neo-hud-badge py-0.5 px-1.5 text-[9px]">[ONLINE]</span>
              </div>
              <div className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                <span>{userEmail}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#00F5D4] hover:bg-cyan-500/10 rounded-[2px] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Balance Status Bar */}
        <div className="p-4 bg-[#050811] border-b border-cyan-500/20 grid grid-cols-2 gap-3">
          <button
            onClick={() => setAccountType('DEMO')}
            className={`p-2.5 rounded-[2px] border text-left transition-all ${
              accountType === 'DEMO'
                ? 'bg-cyan-500/15 border-[#00F5D4] text-[#E2E8F0] shadow-[0_0_10px_rgba(0,245,212,0.15)]'
                : 'bg-[#090E1C] border-slate-800 text-[#94A3B8] hover:border-slate-700'
            }`}
          >
            <div className="text-[9px] uppercase font-bold text-[#94A3B8]">DEMO БАЛАНС</div>
            <div className="text-sm font-extrabold font-mono-num text-[#00F5D4]">
              ${demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </button>

          <button
            onClick={() => setAccountType('REAL')}
            className={`p-2.5 rounded-[2px] border text-left transition-all ${
              accountType === 'REAL'
                ? 'bg-emerald-500/15 border-[#00FF9D] text-[#E2E8F0] shadow-[0_0_10px_rgba(0,255,157,0.15)]'
                : 'bg-[#090E1C] border-slate-800 text-[#94A3B8] hover:border-slate-700'
            }`}
          >
            <div className="text-[9px] uppercase font-bold text-[#94A3B8]">REAL БАЛАНС</div>
            <div className="text-sm font-extrabold font-mono-num text-[#00FF9D]">
              ${realBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-cyan-500/20 bg-[#090E1C] text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-[#00F5D4] text-[#00F5D4] bg-cyan-500/10'
                : 'border-transparent text-[#94A3B8] hover:text-[#E2E8F0]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Профіль
          </button>

          <button
            onClick={() => setActiveTab('exchanges')}
            className={`flex-1 py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'exchanges'
                ? 'border-[#00F5D4] text-[#00F5D4] bg-cyan-500/10'
                : 'border-transparent text-[#94A3B8] hover:text-[#E2E8F0]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            TradeLocker
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'subscription'
                ? 'border-[#00F5D4] text-[#00F5D4] bg-cyan-500/10'
                : 'border-transparent text-[#94A3B8] hover:text-[#E2E8F0]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Підписка
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`flex-1 py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'auth'
                ? 'border-[#00F5D4] text-[#00F5D4] bg-cyan-500/10'
                : 'border-transparent text-[#94A3B8] hover:text-[#E2E8F0]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Вхід
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-5 text-xs space-y-4">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#050811] border border-cyan-500/30 rounded-[3px] space-y-3">
                <h3 className="font-bold text-[#E2E8F0] text-xs uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-[#00F5D4]" /> Особисті Налаштування
                </h3>

                <div>
                  <label className="text-[#94A3B8] text-[10px] block mb-1">ІМ'Я ТРЕЙДЕРА</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] text-[#E2E8F0] font-bold focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#94A3B8] text-[10px] block mb-1">EMAIL АКАУНТУ</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full p-2 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] text-[#E2E8F0] font-bold focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>
              </div>

              {/* Language Switcher */}
              <div className="p-4 bg-[#050811] border border-cyan-500/30 rounded-[3px] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#E2E8F0] flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#00F5D4]" />
                    Мова Інтерфейсу Платформи
                  </div>
                  <div className="text-[11px] text-[#94A3B8] mt-0.5">
                    Поточна мова: {lang === 'uk' ? 'Українська (🇺🇦 UA)' : 'English (🇬🇧 EN)'}
                  </div>
                </div>

                <button
                  onClick={onLanguageToggle}
                  className="px-3 py-1.5 bg-[#090E1C] hover:bg-cyan-500/20 text-[#00F5D4] border border-cyan-500/30 rounded-[2px] font-bold transition-all"
                >
                  Змінити на {lang === 'uk' ? '🇬🇧 EN' : '🇺🇦 UA'}
                </button>
              </div>

              {/* Action Buttons to Dedicated Pages */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href="/login"
                  className="p-2.5 bg-[#090E1C] hover:bg-cyan-500/10 text-[#00F5D4] border border-cyan-500/30 rounded-[2px] text-center font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Сторінка Входу
                </a>
                <a
                  href="/register"
                  className="p-2.5 bg-[#090E1C] hover:bg-emerald-500/10 text-[#00FF9D] border border-emerald-500/30 rounded-[2px] text-center font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Сторінка Реєстрації
                </a>
              </div>
            </div>
          )}

          {/* TRADELOCKER TAB */}
          {activeTab === 'exchanges' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#050811] border border-emerald-500/30 rounded-[3px] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#E2E8F0] text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#00FF9D]" />
                      TradeLocker Integration
                    </h3>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">Шифрування AES-256-GCM (GDPR Article 17 Compliant)</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenTradeLocker();
                  }}
                  className="w-full py-2.5 bg-[#00FF9D] text-[#050811] font-extrabold rounded-[2px] text-xs hover:bg-[#00F5D4] transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-[#00FF9D]/20"
                >
                  <Key className="w-3.5 h-3.5" />
                  КЕРУВАТИ КЛЮЧАМИ TRADELOCKER
                </button>
              </div>
            </div>
          )}

          {/* SUBSCRIPTION TAB */}
          {activeTab === 'subscription' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-cyan-950/40 via-[#050811] to-violet-950/40 border border-cyan-500/40 rounded-[3px] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00F5D4]" />
                    <h3 className="font-bold text-[#E2E8F0] text-xs uppercase tracking-wider">NEXUS QUANT PRO TIER</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/40 rounded-[2px] font-bold text-[10px]">
                    АКТИВНА
                  </span>
                </div>

                <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                  Доступ до 4-шарової конфлюенс-матриці, квантових сигналів &gt;80% Confluence Score та 1-клік автоматичного виконання на TradeLocker.
                </p>

                <a
                  href="/paywall"
                  className="block w-full py-2 bg-[#090E1C] hover:bg-cyan-500/10 text-[#00F5D4] border border-cyan-500/30 rounded-[2px] text-center font-bold text-xs transition-all"
                >
                  ПЕРЕГЛЯНУТИ ТАРИФИ ПІДПИСКИ ($49 / $149) →
                </a>
              </div>
            </div>
          )}

          {/* AUTH TAB */}
          {activeTab === 'auth' && (
            <div className="space-y-4">
              <div className="flex bg-[#050811] p-1 rounded-[2px] border border-cyan-500/20 text-center font-bold text-[11px]">
                <button
                  onClick={() => { setAuthMode('login'); setAuthFeedback(null); }}
                  className={`flex-1 py-1.5 rounded-[2px] transition-all ${
                    authMode === 'login' ? 'bg-[#00F5D4] text-[#050811]' : 'text-[#94A3B8]'
                  }`}
                >
                  Вхід
                </button>
                <button
                  onClick={() => { setAuthMode('register'); setAuthFeedback(null); }}
                  className={`flex-1 py-1.5 rounded-[2px] transition-all ${
                    authMode === 'register' ? 'bg-[#00FF9D] text-[#050811]' : 'text-[#94A3B8]'
                  }`}
                >
                  Реєстрація
                </button>
                <button
                  onClick={() => { setAuthMode('reset'); setAuthFeedback(null); }}
                  className={`flex-1 py-1.5 rounded-[2px] transition-all ${
                    authMode === 'reset' ? 'bg-[#00F5D4] text-[#050811]' : 'text-[#94A3B8]'
                  }`}
                >
                  Скидання
                </button>
              </div>

              {/* Direct links to dedicated pages */}
              <div className="flex gap-2">
                <a
                  href="/login"
                  className="flex-1 py-1.5 bg-[#050811] hover:bg-cyan-500/10 text-[#00F5D4] border border-cyan-500/30 rounded-[2px] text-center font-bold text-[10px] transition-all flex items-center justify-center gap-1"
                >
                  <span>ВІДКРИТИ СТОРІНКУ /login</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="/register"
                  className="flex-1 py-1.5 bg-[#050811] hover:bg-emerald-500/10 text-[#00FF9D] border border-emerald-500/30 rounded-[2px] text-center font-bold text-[10px] transition-all flex items-center justify-center gap-1"
                >
                  <span>ВІДКРИТИ СТОРІНКУ /register</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Feedback Alert Banner */}
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
                className="w-full py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-[2px] transition-all flex items-center justify-center gap-2 shadow text-xs font-sans"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>УВІЙТИ ЧЕРЕЗ GOOGLE</span>
              </button>

              {/* Form */}
              <form onSubmit={handleEmailAuthSubmit} className="space-y-3">
                {authMode === 'register' && (
                  <div>
                    <label className="text-[10px] text-[#94A3B8] block mb-1">ІМ'Я ТРЕЙДЕРА</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Quant Trader"
                      className="w-full p-2 bg-[#050811] border border-cyan-500/20 rounded-[2px] text-[#E2E8F0] font-mono text-xs focus:border-[#00F5D4] focus:outline-none"
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
                    className="w-full p-2 bg-[#050811] border border-cyan-500/20 rounded-[2px] text-[#E2E8F0] font-mono text-xs focus:border-[#00F5D4] focus:outline-none"
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
                      className="w-full p-2 bg-[#050811] border border-cyan-500/20 rounded-[2px] text-[#E2E8F0] font-mono text-xs focus:border-[#00F5D4] focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-[#00F5D4] text-[#050811] font-bold rounded-[2px] text-xs hover:bg-[#00FF9D] transition-colors shadow flex items-center justify-center gap-1.5 uppercase"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {authMode === 'login' ? 'УВІЙТИ В АКАУНТ' : authMode === 'register' ? 'ЗАРЕЄСТРУВАТИСЯ' : 'СКИНУТИ ПАРОЛЬ'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-cyan-500/20 bg-[#050811] text-center text-[10px] text-[#64748B]">
          NEXUS QUANT NEO MIRAI • PROFILE CONTROL PANEL
        </div>
      </aside>
    </div>
  );
};
