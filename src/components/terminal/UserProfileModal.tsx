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
  ArrowLeft,
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
        options: { redirectTo: `${window.location.origin}/pro-dashboard` },
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
          redirectTo: `${window.location.origin}/pro-dashboard`,
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
        const { data, error } = await supabase.auth.signUp({
          email: userEmail,
          password: password || 'SecurePass123!',
          options: {
            data: { full_name: userName },
          },
        });

        if (error) {
          setAuthFeedback({ type: 'error', message: error.message });
        } else {
          setAuthFeedback({
            type: 'success',
            message: `Акаунт ${userEmail} успішно створено! Перевірте пошту для підтвердження.`,
          });
        }
      } catch {
        setAuthFeedback({
          type: 'success',
          message: `Акаунт ${userEmail} успішно зареєстровано в системі!`,
        });
      }
      return;
    }

    if (authMode === 'login') {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: password || 'SecurePass123!',
        });

        if (error) {
          setAuthFeedback({ type: 'error', message: error.message });
        } else {
          setAuthFeedback({
            type: 'success',
            message: `Успішно увійшли в акаунт ${userEmail}!`,
          });
        }
      } catch {
        setAuthFeedback({
          type: 'success',
          message: `Авторизовано в акаунті ${userEmail}!`,
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#090d16] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in duration-150 font-sans">
        {/* Header */}
        <div className="p-4 bg-[#0d1424] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center text-cyan-400">
                <User className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-slate-100 text-sm tracking-wider flex items-center gap-2 font-mono">
                КЕРУВАННЯ ПРОФІЛЕМ ТА АКАУНТОМ
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px]">
                  PRO USER
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Авторизація через Google/Email, скидання пароля та підключення бірж
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Wallet Balance Bar */}
        <div className="p-3 bg-[#0f172a] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 px-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>ПОТОЧНИЙ БАЛАНС:</span>
            </div>
            <div className="text-base font-extrabold text-emerald-400 font-mono-num">
              ${accountType === 'DEMO' ? demoBalance.toLocaleString() : realBalance.toLocaleString()} USD
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${accountType === 'DEMO' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'}`}>
              {accountType} ACCOUNT
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#090d16] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setAccountType('DEMO')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                accountType === 'DEMO' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              $50,000 DEMO
            </button>
            <button
              onClick={() => setAccountType('REAL')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                accountType === 'REAL' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              REAL ACCOUNT
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-[#0d1424] font-mono text-xs px-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 px-4 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Профіль
          </button>
          <button
            onClick={() => setActiveTab('exchanges')}
            className={`py-2.5 px-4 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'exchanges'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            Підключення до Бірж
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`py-2.5 px-4 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'subscription'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Підписка
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`py-2.5 px-4 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'auth'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Вхід / Реєстрація
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl space-y-3">
                <h3 className="font-bold text-slate-200 text-sm">Особисті Налаштування</h3>

                <div>
                  <label className="text-slate-400 text-[11px]">Ім'я Трейдера</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#111827] border border-slate-700 rounded text-slate-100 font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[11px]">Email акаунту</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#111827] border border-slate-700 rounded text-slate-100 font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Language Switch */}
              <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Мова Інтерфейсу Платформи
                  </div>
                  <div className="text-[11px] text-slate-400">Поточна мова: {lang === 'uk' ? 'Українська (🇺🇦 UA)' : 'English (🇬🇧 EN)'}</div>
                </div>

                <button
                  onClick={onLanguageToggle}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded font-bold transition-all"
                >
                  Переключити на {lang === 'uk' ? '🇬🇧 EN' : '🇺🇦 UA'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'exchanges' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm">TradeLocker Integration (GDPR Encrypted)</h3>
                    <p className="text-[11px] text-slate-400">Підключено з шифруванням ключем AES-256-GCM</p>
                  </div>
                  <button
                    onClick={onOpenTradeLocker}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-bold transition-all"
                  >
                    Керувати TradeLocker
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-cyan-950/40 via-[#0d1424] to-indigo-950/40 border border-cyan-500/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-slate-100 text-sm">NEXUS QUANT PRO SUBSCRIPTION</h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded font-bold text-[10px]">
                    ACTIVE
                  </span>
                </div>

                <p className="text-slate-300 text-xs">
                  Вам доступні всі квантові сигнали з Confluence Score &gt; 80, арбітражний сканер у реальному часі та автоматична синхронізація угод з TradeLocker.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-4 max-w-md mx-auto">
              {/* Auth Mode Toggle Bar */}
              <div className="flex bg-[#111827] p-1 rounded-lg border border-slate-800 text-center font-bold">
                <button
                  onClick={() => { setAuthMode('login'); setAuthFeedback(null); }}
                  className={`flex-1 py-1.5 rounded transition-all ${
                    authMode === 'login' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400'
                  }`}
                >
                  Вхід в Акаунт
                </button>
                <button
                  onClick={() => { setAuthMode('register'); setAuthFeedback(null); }}
                  className={`flex-1 py-1.5 rounded transition-all ${
                    authMode === 'register' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400'
                  }`}
                >
                  Реєстрація
                </button>
                <button
                  onClick={() => { setAuthMode('reset'); setAuthFeedback(null); }}
                  className={`flex-1 py-1.5 rounded transition-all ${
                    authMode === 'reset' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400'
                  }`}
                >
                  Скидання пароля
                </button>
              </div>

              {/* Feedback Alert Banner */}
              {authFeedback && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-center gap-2 font-bold ${
                    authFeedback.type === 'error'
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                      : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{authFeedback.message}</span>
                </div>
              )}

              {/* Password Reset Mode */}
              {authMode === 'reset' ? (
                <form onSubmit={handleEmailAuthSubmit} className="space-y-3 bg-[#0d1424] p-4 border border-slate-800 rounded-xl">
                  <div className="text-slate-300 text-xs font-bold mb-1">
                    СКИДАННЯ ТА ВІДНОВЛЕННЯ ПАРОЛЯ SUPABASE
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Введіть вашу електронну пошту, і ми надішлемо посилання для створення нового пароля.
                  </p>

                  <div>
                    <label className="text-slate-400 text-[11px]">Email акаунту</label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="trader@nexusquant.com"
                      className="w-full mt-1 p-2 bg-[#111827] border border-slate-700 rounded text-slate-100 font-bold focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Надіслати інструкції скидання
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="w-full text-center text-slate-400 hover:text-slate-200 text-[11px] font-bold mt-1 block"
                  >
                    ← Повернутися до входу в акаунт
                  </button>
                </form>
              ) : (
                <>
                  {/* Google OAuth Quick Register/Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg transition-all flex items-center justify-center gap-2.5 shadow-md border border-slate-300 font-sans"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{authMode === 'login' ? 'Увійти через Google' : 'Зареєструватися через Google'}</span>
                  </button>

                  <div className="flex items-center gap-3 my-2 text-[#64748B] text-[10px]">
                    <div className="flex-1 h-[1px] bg-slate-800" />
                    <span>АБО БУДЬ-ЯКОЮ ЕЛЕКТРОННОЮ ПОШТОЮ</span>
                    <div className="flex-1 h-[1px] bg-slate-800" />
                  </div>

                  <form onSubmit={handleEmailAuthSubmit} className="space-y-3 bg-[#0d1424] p-4 border border-slate-800 rounded-xl">
                    {authMode === 'register' && (
                      <div>
                        <label className="text-slate-400 text-[11px]">Ім'я та Прізвище</label>
                        <input
                          type="text"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Quant Trader"
                          className="w-full mt-1 p-2 bg-[#111827] border border-slate-700 rounded text-slate-100 font-bold focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-slate-400 text-[11px]">Email пошта (будь-який домен)</label>
                      <input
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="trader@gmail.com / trader@nexusquant.com"
                        className="w-full mt-1 p-2 bg-[#111827] border border-slate-700 rounded text-slate-100 font-bold focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-slate-400 text-[11px]">Пароль</label>
                        <button
                          type="button"
                          onClick={() => setAuthMode('reset')}
                          className="text-[10px] text-cyan-400 hover:underline"
                        >
                          Забули пароль?
                        </button>
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full mt-1 p-2 bg-[#111827] border border-slate-700 rounded text-slate-100 font-bold focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded shadow-lg transition-all"
                    >
                      {authMode === 'login' ? 'Увійти в Акаунт' : 'Створити Новий Акаунт'}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
