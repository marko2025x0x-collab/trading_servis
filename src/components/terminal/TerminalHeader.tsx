'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Language, getTranslation } from '@/lib/i18n';
import {
  ShieldCheck,
  Search,
  BookOpen,
  ArrowRightLeft,
  Sparkles,
  Globe,
  Lock,
  Wallet,
  Plus,
  X,
  Hexagon,
  User,
  Newspaper,
} from 'lucide-react';
import { UserProfileModal } from './UserProfileModal';
import { FundamentalNewsModal } from './FundamentalNewsModal';

interface TerminalHeaderProps {
  selectedSymbol: string;
  onSymbolSelect: (symbol: string) => void;
  lang: Language;
  onLanguageToggle: () => void;
  onOpenJournal: () => void;
  onOpenArbitrage: () => void;
  onOpenOpportunities: () => void;
  onOpenTradeLockerDemo: () => void;
  isProUser?: boolean;
}

const DEFAULT_WATCHLIST = ['EUR/USD', 'BTC/USD', 'SOL/USDT', 'XAU/USD', 'GBP/USD', 'NVDA'];
const STORAGE_WATCHLIST_KEY = 'nexus_quant_watchlist';

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  selectedSymbol,
  onSymbolSelect,
  lang,
  onLanguageToggle,
  onOpenJournal,
  onOpenArbitrage,
  onOpenOpportunities,
  onOpenTradeLockerDemo,
  isProUser = true,
}) => {
  const t = getTranslation(lang);
  const [searchInput, setSearchInput] = useState('');
  const [watchlist, setWatchlist] = useState<string[]>(DEFAULT_WATCHLIST);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPairInput, setNewPairInput] = useState('');

  // Profile & News Modals state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);

  // Load user watchlist from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_WATCHLIST_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setWatchlist(parsed);
          }
        } catch {
          setWatchlist(DEFAULT_WATCHLIST);
        }
      }
    }
  }, []);

  const saveWatchlist = (newList: string[]) => {
    setWatchlist(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_WATCHLIST_KEY, JSON.stringify(newList));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = searchInput.trim().toUpperCase();
    if (formatted) {
      onSymbolSelect(formatted);
      if (!watchlist.includes(formatted)) {
        saveWatchlist([...watchlist, formatted]);
      }
      setSearchInput('');
    }
  };

  const handleAddPairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = newPairInput.trim().toUpperCase();
    if (formatted && !watchlist.includes(formatted)) {
      const updated = [...watchlist, formatted];
      saveWatchlist(updated);
      onSymbolSelect(formatted);
    }
    setNewPairInput('');
    setShowAddModal(false);
  };

  const handleRemovePair = (pairToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = watchlist.filter((p) => p !== pairToRemove);
    saveWatchlist(filtered);
    if (selectedSymbol === pairToRemove && filtered.length > 0) {
      onSymbolSelect(filtered[0]);
    }
  };

  return (
    <header className="w-full bg-[#090d16] border-b border-slate-800/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 font-sans">
      {/* Left: Professional Institutional Logo & Search & Watchlist */}
      <div className="flex items-center gap-4">
        {/* High-Tech Institutional Logo with Neo-Mirai Aesthetic */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-violet-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/50 transition-all duration-300">
              <div className="w-full h-full bg-[#050811] rounded-[11px] flex items-center justify-center">
                <Hexagon className="w-5 h-5 text-cyan-400 fill-cyan-500/20 stroke-[1.75]" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#050811] animate-pulse shadow-[0_0_8px_#00f0ff]" />
          </div>

          <div>
            <div className="font-extrabold text-sm tracking-wider text-slate-100 flex items-center gap-1.5 font-mono">
              <span>NEXUS</span>
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]">
                QUANT
              </span>
              <span className="text-[9px] px-1.5 py-0.2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded font-bold">
                NEO MIRAI
              </span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono tracking-wider flex items-center gap-1">
              <span>未来を描き、共に創る</span>
              <span className="text-cyan-400">•</span>
              <span>v2.5 PRO</span>
            </div>
          </div>
        </Link>

        {/* Custom Symbol Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder={t.searchSymbol}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-36 sm:w-48 pl-8 pr-3 py-1 bg-[#0f172a] border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </form>

        {/* Dynamic Watchlist / Favorite Pairs Pills with Delete Option */}
        <div className="hidden xl:flex items-center gap-1 bg-[#0f172a] p-1 rounded-lg border border-slate-800">
          {watchlist.map((sym) => {
            const isSelected = selectedSymbol === sym;
            return (
              <div
                key={sym}
                onClick={() => onSymbolSelect(sym)}
                className={`group relative flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{sym}</span>

                {/* Remove Pair 'x' Button */}
                <button
                  onClick={(e) => handleRemovePair(sym, e)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 p-0.5 rounded hover:bg-rose-950/50 transition-all ml-0.5"
                  title={`Видалити ${sym} з обраного`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          {/* Add Pair Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-all ml-0.5"
            title="Додати валютну пару до списку"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Add Pair Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl p-4 w-full max-w-sm font-mono text-xs space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-cyan-400" />
                Додати пару до Обраного
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPairSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400">Символ або пара (напр. ETH/USD, AAPL, AUD/USD)</label>
                <input
                  type="text"
                  required
                  placeholder="ETH/USD"
                  value={newPairInput}
                  onChange={(e) => setNewPairInput(e.target.value)}
                  className="w-full mt-1 p-2 bg-[#111827] border border-slate-700 rounded text-slate-100 font-bold focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded shadow-lg transition-all"
              >
                Додати до списку
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Fundamental News & User Profile Modals */}
      <FundamentalNewsModal
        isOpen={showNewsModal}
        onClose={() => setShowNewsModal(false)}
        symbol={selectedSymbol}
        lang={lang}
      />

      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        lang={lang}
        onLanguageToggle={onLanguageToggle}
        onOpenTradeLocker={onOpenTradeLockerDemo}
      />

      {/* Right: Feature Buttons & Right-aligned User Profile Station */}
      <div className="flex items-center gap-2">
        {/* Terminal Tool Buttons styled with Neo-Mirai Brutalist Pills */}
        <button
          onClick={() => setShowNewsModal(true)}
          className="ticket-pill border border-[#e09f3e]/50 cursor-pointer"
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>НОВИНИ ({selectedSymbol})</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </button>

        <button
          onClick={onOpenOpportunities}
          className="px-3 py-1 bg-[#0d1322] hover:bg-[#131b2e] text-[#f4a261] border border-[#e09f3e]/40 rounded-full text-xs font-neo-mono font-bold transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#e09f3e]" />
          <span>{t.topOpportunities}</span>
        </button>

        <button
          onClick={onOpenJournal}
          className="px-3 py-1 bg-[#0d1322] hover:bg-[#131b2e] text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-neo-mono font-bold transition-all flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.traderJournal}</span>
        </button>

        <button
          onClick={onOpenArbitrage}
          className="px-3 py-1 bg-[#0d1322] hover:bg-[#131b2e] text-amber-300 border border-amber-500/30 rounded-full text-xs font-neo-mono font-bold transition-all flex items-center gap-1.5"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.arbitrageScanner}</span>
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-[1px] bg-[#e09f3e]/30 mx-1 hidden sm:block" />

        {/* FAR RIGHT: Complete User Profile & Account Control Station */}
        <div className="flex items-center gap-2 bg-[#0d1322]/90 p-1 rounded-full border border-[#e09f3e]/30">
          {/* TradeLocker Wallet / Balance Badge */}
          <button
            onClick={onOpenTradeLockerDemo}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-neo-mono font-bold transition-all"
            title="Керувати балансом TradeLocker"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>$50,000 DEMO</span>
          </button>

          {/* Language Selector */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-full text-xs font-neo-mono font-bold transition-all"
            title="Змінити мову"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'uk' ? '🇺🇦 UA' : '🇬🇧 EN'}</span>
          </button>

          {/* User Profile / Auth / Settings Trigger Button */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#131b2e] to-[#080b13] hover:border-cyan-500/50 text-slate-200 border border-slate-700 rounded-full text-xs font-neo-mono transition-all group"
            title="Вхід, Реєстрація та Налаштування Профілю"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#e09f3e] to-violet-600 flex items-center justify-center text-slate-900 font-bold text-[9px] shadow-sm">
              QP
            </div>
            <div className="hidden md:block text-left">
              <div className="text-[11px] font-bold leading-tight group-hover:text-cyan-400 transition-colors">
                Акаунт
              </div>
            </div>
            <User className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
