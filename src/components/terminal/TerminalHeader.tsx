'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Language, getTranslation } from '@/lib/i18n';
import {
  Search,
  BookOpen,
  ArrowRightLeft,
  Sparkles,
  Wallet,
  Plus,
  X,
  Hexagon,
  User,
  Newspaper,
  Radio,
  Cpu,
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
    <header className="w-full bg-[#050811] border-b border-cyan-500/20 px-3 py-2 flex items-center justify-between gap-2 font-neo-mono select-none neo-hud-bracket shrink-0">
      {/* Left Block Split in 2 Halves */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Left Half 1: Branding & Micro System Badges */}
        <div className="flex items-center gap-2.5 shrink-0 bg-[#090E1C] px-2.5 py-1 rounded-[2px] border border-cyan-500/20">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative flex items-center justify-center">
              <div className="w-7 h-7 rounded-[3px] bg-gradient-to-tr from-[#00F5D4] via-[#00FF9D] to-violet-600 p-[1px] shadow-lg shadow-[#00F5D4]/20 group-hover:shadow-[#00F5D4]/50 transition-all duration-300">
                <div className="w-full h-full bg-[#050811] rounded-[2px] flex items-center justify-center">
                  <Hexagon className="w-3.5 h-3.5 text-[#00F5D4] fill-[#00F5D4]/20 stroke-[1.75]" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-[#00FF9D] rounded-full border border-[#050811] animate-pulse" />
            </div>

            <div className="shrink-0">
              <div className="font-extrabold text-xs tracking-wider text-[#E2E8F0] flex items-center gap-1.5 font-neo-display leading-none">
                <span>NEXUS</span>
                <span className="bg-gradient-to-r from-[#00F5D4] via-[#00FF9D] to-violet-400 bg-clip-text text-transparent">
                  QUANT
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-1 border-l border-cyan-500/20 pl-2">
            <span className="neo-hud-badge text-[9px] py-0.2 px-1">
              [SYS::ONLINE]
            </span>
            <span className="neo-hud-badge text-[9px] py-0.2 px-1">
              <Radio className="w-2.5 h-2.5 text-[#00F5D4] animate-pulse" />
              REALTIME
            </span>
          </div>
        </div>

        {/* Left Half 2: Currency Pair Chips List */}
        <div className="flex items-center gap-1.5 shrink-0">
          {watchlist.map((pair) => (
            <div
              key={pair}
              onClick={() => onSymbolSelect(pair)}
              className={`group flex items-center gap-1.5 px-2 py-1 rounded-[2px] text-xs font-bold font-mono transition-all cursor-pointer border ${
                selectedSymbol === pair
                  ? 'bg-cyan-500/20 text-[#00F5D4] border-[#00F5D4] shadow-[0_0_8px_rgba(0,245,212,0.25)]'
                  : 'bg-[#090E1C] text-[#94A3B8] border-cyan-500/20 hover:text-[#E2E8F0] hover:border-cyan-500/40'
              }`}
            >
              <span>{pair}</span>
              {watchlist.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => handleRemovePair(pair, e)}
                  className="opacity-0 group-hover:opacity-100 text-[#64748B] hover:text-[#FF2A6D] transition-opacity ml-0.5"
                  title="Remove pair"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          {/* Add Pair Button */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center p-1 bg-[#090E1C] hover:bg-cyan-500/10 text-[#00F5D4] border border-cyan-500/30 rounded-[2px] transition-colors"
            title="Add Trading Pair"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Add Pair Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#050811]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090E1C] border border-[#00F5D4]/40 rounded-[3px] p-5 w-full max-w-sm space-y-4 neo-hud-bracket shadow-2xl">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <h3 className="font-extrabold text-xs text-[#E2E8F0] uppercase tracking-wider">
                + Додати Торгову Пару
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#94A3B8] hover:text-[#00F5D4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPairSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] text-[#94A3B8] block mb-1">
                  ВВЕДІТЬ ТІКЕР (НАПР. EUR/USD, ETH/USDT, AAPL):
                </label>
                <input
                  type="text"
                  required
                  value={newPairInput}
                  onChange={(e) => setNewPairInput(e.target.value)}
                  placeholder="XAU/USD"
                  className="w-full p-2 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#E2E8F0] uppercase focus:border-[#00F5D4] focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-1.5 bg-[#050811] text-[#94A3B8] hover:text-[#E2E8F0] rounded-[2px] text-xs font-bold border border-slate-800"
                >
                  СКАСУВАТИ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#00F5D4] text-[#050811] rounded-[2px] text-xs font-extrabold hover:bg-[#00FF9D] shadow"
                >
                  ДОДАТИ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal Drawer Component */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        lang={lang}
        onLanguageToggle={onLanguageToggle}
        onOpenTradeLocker={onOpenTradeLockerDemo}
      />

      {/* Fundamental News Modal Component */}
      <FundamentalNewsModal
        isOpen={showNewsModal}
        onClose={() => setShowNewsModal(false)}
        symbol={selectedSymbol}
        lang={lang}
      />

      {/* Right Block Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Шукати pair..."
            className="w-32 lg:w-40 bg-[#090E1C] border border-cyan-500/20 text-[#E2E8F0] text-xs px-2.5 py-1 pl-7 rounded-[2px] focus:outline-none focus:border-[#00F5D4] transition-colors placeholder:text-[#64748B]"
          />
          <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2 top-1.5 pointer-events-none" />
        </form>

        {/* Action Buttons */}
        <button
          onClick={() => setShowNewsModal(true)}
          className="px-2.5 py-1 bg-[#090E1C] hover:bg-[#0F172A] text-[#00F5D4] border border-cyan-500/30 rounded-[2px] text-xs font-neo-mono font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap"
          title="Новини Ринку"
        >
          <Newspaper className="w-3.5 h-3.5 text-[#00F5D4]" />
          <span className="hidden lg:inline">НОВИНИ</span>
        </button>

        <button
          onClick={onOpenOpportunities}
          className="px-2.5 py-1 bg-[#090E1C] hover:bg-[#0F172A] text-[#00F5D4] border border-[#00F5D4]/40 rounded-[2px] text-xs font-neo-mono font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
          <span className="hidden lg:inline">{t.topOpportunities}</span>
          <span className="lg:hidden">РАДАР</span>
        </button>

        <button
          onClick={onOpenJournal}
          className="px-2.5 py-1 bg-[#090E1C] hover:bg-[#0F172A] text-[#E2E8F0] border border-cyan-500/30 rounded-[2px] text-xs font-neo-mono font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#00F5D4]" />
          <span className="hidden sm:inline">{t.traderJournal}</span>
          <span className="sm:hidden">ЩОДЕННИК</span>
        </button>

        <button
          onClick={onOpenArbitrage}
          className="px-2.5 py-1 bg-[#090E1C] hover:bg-[#0F172A] text-[#FFB800] border border-[#FFB800]/30 rounded-[2px] text-xs font-neo-mono font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-[#FFB800]" />
          <span className="hidden sm:inline">{t.arbitrageScanner}</span>
          <span className="sm:hidden">АРБІТРАЖ</span>
        </button>

        <div className="h-4 w-[1px] bg-cyan-500/20 mx-0.5 hidden md:block" />

        {/* User Account Controls */}
        <div className="flex items-center gap-1.5 bg-[#090E1C] p-0.5 rounded-[2px] border border-cyan-500/20 shrink-0">
          <button
            onClick={onOpenTradeLockerDemo}
            className="flex items-center gap-1 px-2 py-1 bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 rounded-[2px] text-xs font-neo-mono font-bold transition-all shrink-0"
            title="TradeLocker Balance"
          >
            <Wallet className="w-3.5 h-3.5 text-[#00FF9D]" />
            <span className="hidden sm:inline">$50,000 DEMO</span>
          </button>

          <button
            onClick={onLanguageToggle}
            className="px-2 py-1 bg-[#0F172A] hover:bg-[#090E1C] text-[#E2E8F0] border border-cyan-500/20 rounded-[2px] text-xs font-neo-mono font-bold transition-all shrink-0"
            title="Language"
          >
            <span>{lang === 'uk' ? '🇺🇦 UA' : '🇬🇧 EN'}</span>
          </button>

          {/* Dedicated Profile Page Link */}
          <Link
            href="/profile"
            className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-[#0F172A] to-[#050811] hover:border-[#00F5D4] text-[#E2E8F0] border border-cyan-500/30 rounded-[2px] text-xs font-neo-mono transition-all group shrink-0"
            title="Сторінка Профілю"
          >
            <User className="w-3.5 h-3.5 text-[#00F5D4]" />
            <span className="hidden md:inline text-xs font-bold text-[#00F5D4]">Профіль</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
