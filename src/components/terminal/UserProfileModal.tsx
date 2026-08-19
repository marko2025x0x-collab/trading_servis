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
} from 'lucide-react';

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
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // User Profile Form State
  const [userName, setUserName] = useState('Quant Trader Pro');
  const [userEmail, setUserEmail] = useState('trader@nexusquant.com');
  const [accountType, setAccountType] = useState<'DEMO' | 'REAL'>('DEMO');

  // Wallet balances
  const demoBalance = 50000.0;
  const realBalance = 12450.80;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#090d16] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in duration-200 font-sans">
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
                Налаштування підключень до бірж, підписки, мови та грошового балансу
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

              <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl space-y-3">
                <h3 className="font-bold text-slate-200 text-sm">Інші Торгові Біржі та Термінали</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#111827] border border-slate-800 rounded flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200">Binance CEX API</div>
                      <div className="text-[10px] text-emerald-400">Підключено</div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="p-3 bg-[#111827] border border-slate-800 rounded flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200">MetaTrader 5 (MT5)</div>
                      <div className="text-[10px] text-slate-400">Готово до підключення</div>
                    </div>
                    <button className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px]">
                      Connect
                    </button>
                  </div>
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

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Наступне списання: 20 Вересня 2026</span>
                  <span className="text-emerald-400 font-bold">$29.99 / місяць</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex bg-[#111827] p-1 rounded-lg border border-slate-800 text-center font-bold">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-1.5 rounded transition-all ${
                    authMode === 'login' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400'
                  }`}
                >
                  Вхід в Акаунт
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-1.5 rounded transition-all ${
                    authMode === 'register' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400'
                  }`}
                >
                  Реєстрація
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert('Авторизовано успішно!'); }} className="space-y-3 bg-[#0d1424] p-4 border border-slate-800 rounded-xl">
                <div>
                  <label className="text-slate-400 text-[11px]">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="trader@nexusquant.com"
                    className="w-full mt-1 p-2 bg-[#111827] border border-slate-700 rounded text-slate-100 font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[11px]">Пароль</label>
                  <input
                    type="password"
                    required
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
