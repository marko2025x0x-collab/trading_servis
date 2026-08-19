'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Language, getTranslation } from '@/lib/i18n';
import {
  Search,
  BookOpen,
  ArrowRightLeft,
  Sparkles,
  Globe,
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
    <header className="w-full bg-[#050811] border-b border-cyan-500/20 px-4 py-2 flex flex-wrap items-center justify-between gap-3 font-neo-mono select-none neo-hud-bracket">
      {/* Left: Professional Institutional Logo, Status Indicators & Watchlist */}
      <div className="flex items-center gap-4">
        {/* High-Tech Institutional Logo with Neo-Mirai Aesthetic */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center">
            <div className="w-9 h-9 rounded-[3px] bg-gradient-to-tr from-[#00F5D4] via-[#00FF9D] to-violet-600 p-[1px] shadow-lg shadow-[#00F5D4]/20 group-hover:shadow-[#00F5D4]/50 transition-all duration-300">
              <div className="w-full h-full bg-[#050811] rounded-[2px] flex items-center justify-center">
                <Hexagon className="w-5 h-5 text-[#00F5D4] fill-[#00F5D4]/20 stroke-[1.75]" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00FF9D] rounded-full border-2 border-[#050811] animate-pulse shadow-[0_0_8px_#00FF9D]" />
          </div>

          <div>
            <div className="font-extrabold text-sm tracking-wider text-[#E2E8F0] flex items-center gap-1.5 font-neo-display">
              <span>NEXUS</span>
              <span className="bg-gradient-to-r from-[#00F5D4] via-[#00FF9D] to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,245,212,0.6)]">
                QUANT
              </span>
              <span className="neo-hud-badge">
                [SYS::ONLINE]
              </span>
            </div>
            <div className="text-[9px] text-[#64748B] font-neo-mono tracking-wider flex items-center gap-1">
              <span>未来を描き、共に創る</span>
              <span className="text-[#00F5D4]">•</span>
              <span>TOKYO 2042 HUD</span>
            </div>
          </div>
        </Link>

        {/* System & Market Status Badges */}
        <div className="hidden lg:flex items-center gap-2 border-l border-cyan-500/20 pl-3">
          <span className="neo-hud-badge flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#00FF9D]" />
            MATRIX::ACTIVE
          </span>
          <span className="neo-hud-badge flex items-center gap-1">
            <Radio className="w-3 h-3 text-[#00F5D4] animate-pulse" />
            [FEED::REALTIME]
          </span>
        </div>

        {/* Custom Symbol Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder={t.searchSymbol}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-32 sm:w-44 pl-7 pr-2.5 py-1 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] text-xs font-neo-mono text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-all"
          />
          <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2 top-2" />
        </form>

        {/* Dynamic Watchlist / Favorite Pairs Pills with Sharp Corners */}
        <div className="hidden xl:flex items-center gap-1 bg-[#090E1C] p-1 rounded-[2px] border border-cyan-500/20">
          {watchlist.map((sym) => {
            const isSelected = selectedSymbol === sym;
            return (
              <div
                key={sym}
                onClick={() => onSymbolSelect(sym)}
                className={`group relative flex items-center gap-1 px-2.5 py-0.5 rounded-[2px] text-xs font-neo-mono font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40 shadow-[0_0_8px_rgba(0,245,212,0.2)] font-bold'
                    : 'text-[#64748B] hover:text-[#E2E8F0] hover:bg-[#0F172A]'
                }`}
              >
                <span>{sym}</span>

                {/* Remove Pair 'x' Button */}
                <button
                  onClick={(e) => handleRemovePair(sym, e)}
                  className="opacity-0 group-hover:opacity-100 text-[#64748B] hover:text-[#FF2A6D] p-0.5 rounded hover:bg-[#FF2A6D]/20 transition-all ml-0.5"
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
            className="p-1 text-[#64748B] hover:text-[#00F5D4] hover:bg-[#00F5D4]/10 rounded transition-all ml-0.5"
            title="Додати валютну пару до списку"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Add Pair Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#050811]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090E1C] border border-[#00F5D4]/40 p-5 rounded-[3px] max-w-sm w-full font-neo-mono shadow-2xl neo-hud-bracket">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#E2E8F0] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#00F5D4]" />
                ДОДАТИ ВАЛЮТНУ ПАРУ
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#64748B] hover:text-[#E2E8F0] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPairSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-[#64748B] block mb-1">СИМВОЛ (НАПР. USD/CAD, DOT/USDT):</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="EUR/USD"
                  value={newPairInput}
                  onChange={(e) => setNewPairInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-xs font-neo-mono text-[#E2E8F0] focus:outline-none focus:border-[#00F5D4]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#E2E8F0]"
                >
                  СКАСУВАТИ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00F5D4] text-[#050811] font-bold rounded-[2px] text-xs hover:bg-[#00FF9D] transition-colors"
                >
                  ДОДАТИ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fundamental News Modal */}
      <FundamentalNewsModal
        isOpen={showNewsModal}
        onClose={() => setShowNewsModal(false)}
        symbol={selectedSymbol}
        lang={lang}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        lang={lang}
        onLanguageToggle={onLanguageToggle}
        onOpenTradeLocker={onOpenTradeLockerDemo}
      />

      {/* Right: Feature Buttons & Right-aligned User Profile Station */}
      <div className="flex items-center gap-2">
        {/* Terminal Tool Buttons styled with Neo-Mirai Cyber HUD Pills */}
        <button
          onClick={() => setShowNewsModal(true)}
          className="px-3 py-1 bg-[#090E1C] hover:bg-[#0F172A] text-[#FFB800] border border-[#FFB800]/40 rounded-[2px] text-xs font-neo-mono font-bold transition-all flex items-center gap-1.5"
        >
          <Newspaper className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>НОВИНИ ({selectedSymbol})</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-ping" />
        </button>

        <button
          onClick={onOpenOpportunities}
          className="px-3 py-1 bg-[#090E1C] hover:bg-[#0F172A] text-[#00F5D4] border border-[#00F5D4]/40 rounded-[2px] text-xs font-neo-mono font-bold transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
          <span>{t.topOpportunities}</span>
        </button>

        <button
          onClick={onOpenJournal}
          className="px-3 py-1 bg-[#090E1C] hover:bg-[#0F172A] text-[#E2E8F0] border border-[#00F5D4]/30 rounded-[2px] text-xs font-neo-mono font-bold transition-all flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#00F5D4]" />
          <span>{t.traderJournal}</span>
        </button>

        <button
          onClick={onOpenArbitrage}
          className="px-3 py-1 bg-[#090E1C] hover:bg-[#0F172A] text-[#FFB800] border border-[#FFB800]/30 rounded-[2px] text-xs font-neo-mono font-bold transition-all flex items-center gap-1.5"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>{t.arbitrageScanner}</span>
        </button>

        {/* Vertical Divider */}
        <div className="h-5 w-[1px] bg-cyan-500/20 mx-1 hidden sm:block" />

        {/* FAR RIGHT: Complete User Profile & Account Control Station */}
        <div className="flex items-center gap-2 bg-[#090E1C] p-1 rounded-[2px] border border-cyan-500/20">
          {/* TradeLocker Wallet / Balance Badge */}
          <button
            onClick={onOpenTradeLockerDemo}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 rounded-[2px] text-xs font-neo-mono font-bold transition-all"
            title="Керувати балансом TradeLocker"
          >
            <Wallet className="w-3.5 h-3.5 text-[#00FF9D]" />
            <span>$50,000 DEMO</span>
          </button>

          {/* Language Selector */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#0F172A] hover:bg-[#090E1C] text-[#E2E8F0] border border-cyan-500/20 rounded-[2px] text-xs font-neo-mono font-bold transition-all"
            title="Змінити мову"
          >
            <Globe className="w-3.5 h-3.5 text-[#00F5D4]" />
            <span>{lang === 'uk' ? '🇺🇦 UA' : '🇬🇧 EN'}</span>
          </button>

          {/* User Profile / Auth / Settings Trigger Button */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-[#0F172A] to-[#050811] hover:border-[#00F5D4]/50 text-[#E2E8F0] border border-cyan-500/20 rounded-[2px] text-xs font-neo-mono transition-all group"
            title="Вхід, Реєстрація та Налаштування Профілю"
          >
            <div className="w-5 h-5 rounded-[2px] bg-gradient-to-tr from-[#00F5D4] to-violet-600 flex items-center justify-center text-[#050811] font-bold text-[9px] shadow-sm">
              QP
            </div>
            <div className="hidden md:block text-left">
              <div className="text-[11px] font-bold leading-tight group-hover:text-[#00F5D4] transition-colors">
                Акаунт
              </div>
            </div>
            <User className="w-3.5 h-3.5 text-[#00F5D4]" />
          </button>
        </div>
      </div>
    </header>
  );
};
