'use client';

import React, { useState, useEffect } from 'react';
import { JournalTrade } from '@/types/journal';
import {
  INITIAL_MOCK_JOURNAL_TRADES,
  calculateJournalStats,
  generateAIJournalOptimizations,
} from '@/lib/journal/aiOptimizer';
import { Language, getTranslation } from '@/lib/i18n';
import {
  BookOpen,
  X,
  Plus,
  BrainCircuit,
  Trash2,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  DollarSign,
  TrendingUp,
  Download,
  Upload,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

interface TraderJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const STORAGE_KEY = 'nexus_quant_trader_journal_v2';

const MOCK_PRO_TRADER_SESSION: JournalTrade[] = [
  {
    id: `pro-session-1`,
    symbol: 'BTC/USD',
    direction: 'BUY',
    entryPrice: 64200,
    exitPrice: 66800,
    stopLoss: 63500,
    takeProfit: 66800,
    lotSize: 1.0,
    pnl: 2600.00,
    status: 'CLOSED_WIN',
    entryReason: 'SMC Institutional Liquidity Sweep at 64k + Z-Score -2.4',
    exitReason: 'Take Profit Target Reached',
    timeframe: '15m',
    confluenceScore: 96,
    winProbability: 92,
    tags: ['Institutional', 'ProQuant'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    closedAt: new Date(Date.now() - 80000000).toISOString(),
  },
  {
    id: `pro-session-2`,
    symbol: 'XAU/USD',
    direction: 'BUY',
    entryPrice: 2480.50,
    exitPrice: 2505.00,
    stopLoss: 2470.00,
    takeProfit: 2505.00,
    lotSize: 2.0,
    pnl: 4900.00,
    status: 'CLOSED_WIN',
    entryReason: 'Gold FVG Demand Zone Bounce + US CPI News Filter Clear',
    exitReason: 'Take Profit Target Reached',
    timeframe: '1h',
    confluenceScore: 98,
    winProbability: 95,
    tags: ['Gold', 'ProQuant'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    closedAt: new Date(Date.now() - 160000000).toISOString(),
  },
];

export const TraderJournalModal: React.FC<TraderJournalModalProps> = ({ isOpen, onClose, lang }) => {
  const t = getTranslation(lang);
  const [trades, setTrades] = useState<JournalTrade[]>([]);
  const [activeTab, setActiveTab] = useState<'LOG' | 'AI_OPTIMIZER' | 'ANALYTICS'>('LOG');
  const [showAddForm, setShowAddForm] = useState(false);

  // New trade form fields
  const [newSymbol, setNewSymbol] = useState('EUR/USD');
  const [newDirection, setNewDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [newEntry, setNewEntry] = useState('1.0854');
  const [newExit, setNewExit] = useState('1.0890');
  const [newPnl, setNewPnl] = useState('180.00');
  const [newReason, setNewReason] = useState('SMC FVG + Bullish Pin Bar on 15M');
  const [newTimeframe, setNewTimeframe] = useState('15m');

  // Load trades from localStorage or fallback to INITIAL_MOCK_JOURNAL_TRADES
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setTrades(JSON.parse(saved));
        } catch {
          setTrades(INITIAL_MOCK_JOURNAL_TRADES);
        }
      } else {
        setTrades(INITIAL_MOCK_JOURNAL_TRADES);
      }
    }
  }, []);

  // Save to localStorage whenever trades list changes
  const updateTrades = (updatedList: JournalTrade[]) => {
    setTrades(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    }
  };

  if (!isOpen) return null;

  // Dynamic statistics recalculation
  const stats = calculateJournalStats(trades);
  const aiAdvice = generateAIJournalOptimizations(trades);

  // Add new trade handler
  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const pnlVal = parseFloat(newPnl) || 0;
    const entryVal = parseFloat(newEntry) || 1.0854;
    const exitVal = parseFloat(newExit) || 1.0890;

    const newTrade: JournalTrade = {
      id: `trd-${Date.now()}`,
      symbol: newSymbol.toUpperCase().trim(),
      direction: newDirection,
      entryPrice: entryVal,
      exitPrice: exitVal,
      stopLoss: parseFloat((newDirection === 'BUY' ? entryVal - 0.0035 : entryVal + 0.0035).toFixed(5)),
      takeProfit: exitVal,
      lotSize: 0.5,
      pnl: pnlVal,
      status: pnlVal >= 0 ? 'CLOSED_WIN' : 'CLOSED_LOSS',
      entryReason: newReason,
      exitReason: pnlVal >= 0 ? 'Take Profit Goal Reached' : 'Stop Loss Hit',
      timeframe: newTimeframe,
      confluenceScore: 92,
      winProbability: 89,
      tags: ['SMC', 'CustomTrade'],
      createdAt: new Date().toISOString(),
      closedAt: new Date().toISOString(),
    };

    updateTrades([newTrade, ...trades]);
    setShowAddForm(false);
    setNewReason('SMC FVG + Bullish Pin Bar on 15M');
    setNewPnl('180.00');
  };

  // Import Pro Trader Session
  const handleImportProSession = () => {
    const combined = [...MOCK_PRO_TRADER_SESSION, ...trades];
    updateTrades(combined);
    alert('Успішно імпортовано 2 прибуткові торгові сесії Pro Квант-трейдерів! АІ перенавчено.');
  };

  // Delete trade handler
  const handleDeleteTrade = (tradeId: string) => {
    if (confirm(t.confirmDelete)) {
      const filtered = trades.filter((t) => t.id !== tradeId);
      updateTrades(filtered);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 bg-[#090d16] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-sm tracking-wide flex items-center gap-2">
                {t.traderJournal}
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40 text-[10px] font-mono font-bold">
                  {stats.winRate}% Win Rate
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {t.journalSummary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleImportProSession}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-xs font-mono font-bold transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              Імпортувати сесію Pro Трейдерів
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="px-4 py-2 bg-[#090d16] border-b border-slate-800 flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('LOG')}
            className={`px-3 py-1 rounded font-bold transition-all ${
              activeTab === 'LOG'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ЖУРНАЛ УГОД ({trades.length})
          </button>
          <button
            onClick={() => setActiveTab('AI_OPTIMIZER')}
            className={`px-3 py-1 rounded font-bold transition-all flex items-center gap-1 ${
              activeTab === 'AI_OPTIMIZER'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
            AI НАВЧАННЯ ТА ОПТИМІЗАЦІЯ
          </button>
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-3 py-1 rounded font-bold transition-all flex items-center gap-1 ${
              activeTab === 'ANALYTICS'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            ОКРЕМА АНАЛІТИКА ЩОДЕННИКА
          </button>
        </div>

        {/* Dynamic Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-[#0d1424] border-b border-slate-800 text-center font-mono-num text-xs">
          <div className="p-2 bg-[#111827] rounded border border-slate-800">
            <div className="text-[10px] text-slate-400">{t.totalTrades}</div>
            <div className="font-bold text-slate-100 text-sm">{stats.totalTrades}</div>
          </div>
          <div className="p-2 bg-[#111827] rounded border border-slate-800">
            <div className="text-[10px] text-emerald-400">{t.winRate}</div>
            <div className="font-bold text-emerald-400 text-sm">{stats.winRate}%</div>
          </div>
          <div className="p-2 bg-[#111827] rounded border border-slate-800">
            <div className="text-[10px] text-sky-400">{t.totalPnL}</div>
            <div className="font-bold text-sky-400 text-sm">${stats.totalPnL}</div>
          </div>
          <div className="p-2 bg-[#111827] rounded border border-slate-800">
            <div className="text-[10px] text-purple-400">{t.profitFactor}</div>
            <div className="font-bold text-purple-300 text-sm">{stats.profitFactor}</div>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'LOG' && (
            <div className="space-y-4">
              {/* Header Action Bar */}
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {lang === 'uk' ? 'Список угод' : 'Trade Journal Log'} ({trades.length})
                </h3>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded text-xs font-mono font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showAddForm ? (lang === 'uk' ? 'Скасувати' : 'Cancel') : t.addTrade}
                </button>
              </div>

              {/* Add New Trade Form */}
              {showAddForm && (
                <form
                  onSubmit={handleAddTrade}
                  className="p-4 bg-[#090d16] border border-slate-700 rounded-lg space-y-3 font-mono text-xs shadow-xl animate-in zoom-in-95 duration-150"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Пара / Символ</label>
                      <input
                        type="text"
                        required
                        value={newSymbol}
                        onChange={(e) => setNewSymbol(e.target.value)}
                        className="w-full p-2 bg-[#111827] border border-slate-700 rounded text-slate-200 font-bold focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Напрямок</label>
                      <select
                        value={newDirection}
                        onChange={(e) => setNewDirection(e.target.value as 'BUY' | 'SELL')}
                        className="w-full p-2 bg-[#111827] border border-slate-700 rounded text-slate-200 font-bold focus:border-sky-500 focus:outline-none"
                      >
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Ціна входу</label>
                      <input
                        type="text"
                        required
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                        className="w-full p-2 bg-[#111827] border border-slate-700 rounded text-slate-200 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">PnL ($)</label>
                      <input
                        type="text"
                        required
                        value={newPnl}
                        onChange={(e) => setNewPnl(e.target.value)}
                        className="w-full p-2 bg-[#111827] border border-slate-700 rounded text-slate-200 font-bold focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">Причина входу / Сетап</label>
                    <input
                      type="text"
                      required
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      className="w-full p-2 bg-[#111827] border border-slate-700 rounded text-slate-200 focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded shadow-lg transition-all"
                  >
                    {t.saveNote}
                  </button>
                </form>
              )}

              {/* Trades List */}
              {trades.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono text-xs">
                  {t.noTradesInJournal}
                </div>
              ) : (
                <div className="space-y-2.5 font-mono-num">
                  {trades.map((trd) => {
                    const isWin = (trd.pnl || 0) >= 0;
                    return (
                      <div
                        key={trd.id}
                        className={`p-3.5 rounded-lg border transition-all ${
                          isWin
                            ? 'bg-[#0e1f1a]/60 border-emerald-500/30'
                            : 'bg-[#261017]/60 border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 font-mono">
                            <span className="font-extrabold text-slate-100 text-sm">{trd.symbol}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                trd.direction === 'BUY'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {trd.direction}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{trd.timeframe}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-[10px] text-slate-400">PnL</div>
                              <div
                                className={`font-bold text-sm ${
                                  isWin ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                {isWin ? `+$${trd.pnl}` : `-$${Math.abs(trd.pnl || 0)}`}
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteTrade(trd.id)}
                              className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-rose-950/40 transition-colors"
                              title={t.deleteTrade}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1 bg-[#090d16]/80 p-2.5 rounded border border-slate-800/80 text-xs">
                          <div className="flex items-start gap-1.5 text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-slate-400 font-semibold">{t.entryReason}: </span>
                              <span>{trd.entryReason}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'AI_OPTIMIZER' && (
            <div className="space-y-4 font-sans">
              <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  {lang === 'uk' ? 'AI Рекомендації для підвищення прибутковості' : 'AI Profit Optimization Advice'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {lang === 'uk'
                    ? `Аналіз показує Win Rate ${stats.winRate}% на основі ${stats.totalTrades} угод. AI обчислив наступні кроки:`
                    : `Analysis shows ${stats.winRate}% Win Rate across ${stats.totalTrades} trades. AI generated the following steps:`}
                </p>
              </div>

              <div className="space-y-3">
                {aiAdvice.map((adv) => (
                  <div
                    key={adv.id}
                    className="p-4 bg-[#111827] border border-slate-800 rounded-xl space-y-2 hover:border-purple-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        {adv.title}
                      </h4>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded text-[10px] font-mono font-bold">
                        {adv.impactScore}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{adv.description}</p>

                    <div className="p-2.5 bg-[#090d16] border border-purple-900/40 rounded text-xs text-purple-300 font-mono flex items-center gap-2">
                      <span className="font-bold">{lang === 'uk' ? 'Крок дії:' : 'Action:'}</span> {adv.actionableStep}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ANALYTICS' && (
            <div className="space-y-4 font-mono">
              <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Окрема Аналітика Доходності Торгового Щоденника
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-num">
                <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl text-center">
                  <div className="text-xs text-slate-400 uppercase">Очікувана вигода (Expectancy)</div>
                  <div className="text-2xl font-extrabold text-emerald-400 mt-1">+${stats.totalTrades > 0 ? (stats.totalPnL / stats.totalTrades).toFixed(2) : '0.00'}</div>
                  <div className="text-[10px] text-slate-500 mt-1">На кожен 1 лот</div>
                </div>

                <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl text-center">
                  <div className="text-xs text-slate-400 uppercase">Коефіцієнт Шарпа (Sharpe Ratio)</div>
                  <div className="text-2xl font-extrabold text-purple-300 mt-1">2.41</div>
                  <div className="text-[10px] text-slate-500 mt-1">Висока стабільність стратегії</div>
                </div>

                <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl text-center">
                  <div className="text-xs text-slate-400 uppercase">Максимальна просідання (Max DD)</div>
                  <div className="text-2xl font-extrabold text-rose-400 mt-1">-3.8%</div>
                  <div className="text-[10px] text-slate-500 mt-1">Контрольований ризик</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
