'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { JournalTrade } from '@/types/journal';
import { loadJournalTrades, saveJournalTrades } from '@/lib/journal/storage';
import {
  calculateJournalStats,
  generateAIJournalOptimizations,
  calculateSharpeRatio,
  calculateMaxDrawdown,
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
  BarChart3,
  Loader2,
} from 'lucide-react';

interface TraderJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const TraderJournalModal: React.FC<TraderJournalModalProps> = ({ isOpen, onClose, lang }) => {
  const t = getTranslation(lang);
  const [trades, setTrades] = useState<JournalTrade[]>([]);
  const [activeTab, setActiveTab] = useState<'LOG' | 'AI_OPTIMIZER' | 'ANALYTICS'>('LOG');
  const [showAddForm, setShowAddForm] = useState(false);
  const [closingId, setClosingId] = useState<string | null>(null);

  // New (manually self-reported) trade form fields
  const [newSymbol, setNewSymbol] = useState('EUR/USD');
  const [newDirection, setNewDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [newEntry, setNewEntry] = useState('');
  const [newExit, setNewExit] = useState('');
  const [newPnl, setNewPnl] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('15m');

  const updateTrades = (updatedList: JournalTrade[]) => {
    setTrades(updatedList);
    saveJournalTrades(updatedList);
  };

  // Re-sync from storage every time the modal opens, so trades auto-logged
  // elsewhere (e.g. a signal execution) while the journal was closed show up.
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTrades(loadJournalTrades());
    }
  }, [isOpen]);

  // Manually log a real trade the user took (e.g. off-platform) — self-reported, not algorithmic.
  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const pnlVal = parseFloat(newPnl) || 0;
    const entryVal = parseFloat(newEntry);
    const exitVal = parseFloat(newExit);
    if (isNaN(entryVal) || isNaN(exitVal)) return;

    const newTrade: JournalTrade = {
      id: `trd-manual-${Date.now()}`,
      symbol: newSymbol.toUpperCase().trim(),
      direction: newDirection,
      entryPrice: entryVal,
      exitPrice: exitVal,
      stopLoss: parseFloat((newDirection === 'BUY' ? entryVal - Math.abs(entryVal - exitVal) : entryVal + Math.abs(entryVal - exitVal)).toFixed(5)),
      takeProfit: exitVal,
      lotSize: 0.5,
      pnl: pnlVal,
      status: pnlVal >= 0 ? 'CLOSED_WIN' : 'CLOSED_LOSS',
      entryReason: newReason || (lang === 'uk' ? 'Вручну додана угода (поза терміналом)' : 'Manually logged trade (off-platform)'),
      exitReason: pnlVal >= 0 ? (lang === 'uk' ? 'Прибуток' : 'Take profit') : (lang === 'uk' ? 'Збиток' : 'Stop loss'),
      timeframe: newTimeframe,
      confluenceScore: 0,
      winProbability: 0,
      tags: ['MANUAL'],
      createdAt: new Date().toISOString(),
      closedAt: new Date().toISOString(),
    };

    updateTrades([newTrade, ...trades]);
    setShowAddForm(false);
    setNewReason('');
    setNewPnl('');
    setNewEntry('');
    setNewExit('');
  };

  // Close an OPEN (auto-logged) trade using a real live quote instead of a manually-typed PnL.
  const handleCloseTrade = useCallback(
    async (trade: JournalTrade) => {
      setClosingId(trade.id);
      try {
        const res = await fetch(`/api/market-data/quote?symbol=${encodeURIComponent(trade.symbol)}`);
        const data = await res.json();
        const exitPrice: number = data.price ?? trade.entryPrice;

        const diff = trade.direction === 'BUY' ? exitPrice - trade.entryPrice : trade.entryPrice - exitPrice;
        const isForexPair = !/BTC|ETH|SOL|XAU|NVDA/.test(trade.symbol);
        const multiplier = isForexPair ? 100000 : 1;
        const pnl = parseFloat((diff * multiplier * trade.lotSize).toFixed(2));

        const updated = trades.map((tr) =>
          tr.id === trade.id
            ? {
                ...tr,
                exitPrice,
                pnl,
                status: (pnl >= 0 ? 'CLOSED_WIN' : 'CLOSED_LOSS') as JournalTrade['status'],
                exitReason: pnl >= 0 ? (lang === 'uk' ? 'Закрито вручну з прибутком' : 'Manually closed in profit') : (lang === 'uk' ? 'Закрито вручну зі збитком' : 'Manually closed at a loss'),
                closedAt: new Date().toISOString(),
              }
            : tr
        );
        updateTrades(updated);
      } catch {
        // If the live quote fails, leave the trade OPEN rather than fabricating an outcome.
      } finally {
        setClosingId(null);
      }
    },
    [trades, lang]
  );

  // Delete trade handler
  const handleDeleteTrade = (tradeId: string) => {
    if (confirm(t.confirmDelete)) {
      const filtered = trades.filter((tr) => tr.id !== tradeId);
      updateTrades(filtered);
    }
  };

  if (!isOpen) return null;

  // Dynamic statistics recalculation
  const stats = calculateJournalStats(trades);
  const aiAdvice = generateAIJournalOptimizations(trades);
  const sharpe = calculateSharpeRatio(trades);
  const maxDrawdown = calculateMaxDrawdown(trades);

  return (
    <div className="fixed inset-0 z-50 bg-[#050811]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-neo-mono select-none">
      <div className="neo-panel rounded-[3px] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl neo-hud-bracket animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-3.5 bg-[#090E1C] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[2px] bg-[#00F5D4]/10 border border-[#00F5D4]/30 flex items-center justify-center text-[#00F5D4]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-[#E2E8F0] text-xs tracking-wider flex items-center gap-2 font-neo-display">
                {t.traderJournal}
                <span className="neo-hud-badge">
                  [SYS::JOURNAL] {stats.winRate}% WR
                </span>
              </h2>
              <p className="text-[10px] text-[#64748B] font-neo-mono">
                {'// QUANTITATIVE TRADE DIARY & AI PATTERN OPTIMIZER'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#E2E8F0] p-1.5 rounded-[2px] hover:bg-[#0F172A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="px-4 py-2 bg-[#050811] border-b border-cyan-500/20 flex items-center gap-2 text-xs font-neo-mono">
          <button
            onClick={() => setActiveTab('LOG')}
            className={`px-3.5 py-1 rounded-[2px] font-bold transition-all ${
              activeTab === 'LOG'
                ? 'bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40'
                : 'text-[#64748B] hover:text-[#E2E8F0]'
            }`}
          >
            ЖУРНАЛ УГОД ({trades.length})
          </button>
          <button
            onClick={() => setActiveTab('AI_OPTIMIZER')}
            className={`px-3.5 py-1 rounded-[2px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'AI_OPTIMIZER'
                ? 'bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40'
                : 'text-[#64748B] hover:text-[#E2E8F0]'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-[#00F5D4]" />
            AI НАВЧАННЯ ТА ОПТИМІЗАЦІЯ
          </button>
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-3.5 py-1 rounded-[2px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ANALYTICS'
                ? 'bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40'
                : 'text-[#64748B] hover:text-[#E2E8F0]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#00FF9D]" />
            ОКРЕМА АНАЛІТИКА
          </button>
        </div>

        {/* Dynamic Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-[#090E1C] border-b border-cyan-500/20 text-center font-mono-num text-xs">
          <div className="p-2 bg-[#050811] rounded-[2px] border border-cyan-500/20">
            <div className="text-[10px] text-[#64748B]">{t.totalTrades}</div>
            <div className="font-extrabold text-[#E2E8F0] text-sm">{stats.totalTrades}</div>
          </div>
          <div className="p-2 bg-[#050811] rounded-[2px] border border-cyan-500/20">
            <div className="text-[10px] text-[#00FF9D]">{t.winRate}</div>
            <div className="font-extrabold text-[#00FF9D] text-sm">{stats.winRate}%</div>
          </div>
          <div className="p-2 bg-[#050811] rounded-[2px] border border-cyan-500/20">
            <div className="text-[10px] text-[#00F5D4]">{t.totalPnL}</div>
            <div className="font-extrabold text-[#00F5D4] text-sm">${stats.totalPnL}</div>
          </div>
          <div className="p-2 bg-[#050811] rounded-[2px] border border-cyan-500/20">
            <div className="text-[10px] text-[#FFB800]">{t.profitFactor}</div>
            <div className="font-extrabold text-[#FFB800] text-sm">{stats.profitFactor}</div>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'LOG' && (
            <div className="space-y-4 font-neo-mono">
              {/* Header Action Bar */}
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">
                  {lang === 'uk' ? 'Список угод' : 'Trade Journal Log'} ({trades.length})
                </h3>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#00F5D4]/10 hover:bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/30 rounded-[2px] text-xs font-neo-mono font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showAddForm ? (lang === 'uk' ? 'Скасувати' : 'Cancel') : t.addTrade}
                </button>
              </div>

              {/* Add New (self-reported) Trade Form */}
              {showAddForm && (
                <form
                  onSubmit={handleAddTrade}
                  className="p-4 bg-[#050811] border border-cyan-500/30 rounded-[2px] space-y-3 font-neo-mono text-xs shadow-xl animate-in zoom-in-95 duration-150 neo-hud-bracket"
                >
                  <p className="text-[10px] text-[#64748B]">
                    {lang === 'uk'
                      ? 'Для угод, виконаних через термінал, запис у щоденник створюється автоматично. Ця форма — для угод, взятих поза платформою.'
                      : 'Trades executed through the terminal are logged automatically. This form is for trades taken off-platform.'}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono-num">
                    <div>
                      <label className="text-[10px] text-[#64748B]">Пара / Символ</label>
                      <input
                        type="text"
                        required
                        value={newSymbol}
                        onChange={(e) => setNewSymbol(e.target.value)}
                        className="w-full p-2 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-bold focus:border-[#00F5D4] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#64748B]">Напрямок</label>
                      <select
                        value={newDirection}
                        onChange={(e) => setNewDirection(e.target.value as 'BUY' | 'SELL')}
                        className="w-full p-2 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-bold focus:border-[#00F5D4] focus:outline-none"
                      >
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-[#64748B]">Ціна входу</label>
                      <input
                        type="text"
                        required
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                        className="w-full p-2 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] focus:border-[#00F5D4] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#64748B]">Ціна виходу</label>
                      <input
                        type="text"
                        required
                        value={newExit}
                        onChange={(e) => setNewExit(e.target.value)}
                        className="w-full p-2 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] focus:border-[#00F5D4] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[#64748B]">PnL ($)</label>
                      <input
                        type="text"
                        required
                        value={newPnl}
                        onChange={(e) => setNewPnl(e.target.value)}
                        className="w-full p-2 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-bold focus:border-[#00F5D4] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#64748B]">Таймфрейм</label>
                      <input
                        type="text"
                        value={newTimeframe}
                        onChange={(e) => setNewTimeframe(e.target.value)}
                        className="w-full p-2 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] focus:border-[#00F5D4] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#64748B]">Причина входу / Сетап</label>
                    <input
                      type="text"
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      className="w-full p-2 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] focus:border-[#00F5D4] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#00F5D4] text-[#050811] font-bold rounded-[2px] shadow-lg hover:bg-[#00FF9D] transition-colors text-xs"
                  >
                    {t.saveNote}
                  </button>
                </form>
              )}

              {/* Trades List */}
              {trades.length === 0 ? (
                <div className="p-8 text-center text-[#64748B] font-neo-mono text-xs">
                  {t.noTradesInJournal}
                </div>
              ) : (
                <div className="space-y-2.5 font-mono-num">
                  {trades.map((trd) => {
                    const isOpen = trd.status === 'OPEN';
                    const isWin = !isOpen && (trd.pnl || 0) >= 0;
                    return (
                      <div
                        key={trd.id}
                        className={`p-3.5 rounded-[2px] border transition-all ${
                          isOpen
                            ? 'bg-[#00F5D4]/5 border-[#00F5D4]/30'
                            : isWin
                            ? 'bg-[#00FF9D]/5 border-[#00FF9D]/30'
                            : 'bg-[#FF2A6D]/5 border-[#FF2A6D]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 font-mono">
                            <span className="font-extrabold text-[#E2E8F0] text-sm">{trd.symbol}</span>
                            <span
                              className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold ${
                                trd.direction === 'BUY'
                                  ? 'bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30'
                                  : 'bg-[#FF2A6D]/15 text-[#FF2A6D] border border-[#FF2A6D]/30'
                              }`}
                            >
                              {trd.direction}
                            </span>
                            <span className="text-[10px] text-[#64748B] font-mono">{trd.timeframe}</span>
                            {isOpen && (
                              <span className="px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/30">
                                OPEN
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            {!isOpen && (
                              <div className="text-right">
                                <div className="text-[10px] text-[#64748B]">PnL</div>
                                <div className={`font-bold text-sm ${isWin ? 'text-[#00FF9D]' : 'text-[#FF2A6D]'}`}>
                                  {isWin ? `+$${trd.pnl}` : `-$${Math.abs(trd.pnl || 0)}`}
                                </div>
                              </div>
                            )}

                            {isOpen && (
                              <button
                                onClick={() => handleCloseTrade(trd)}
                                disabled={closingId === trd.id}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-[2px] bg-[#00F5D4]/10 hover:bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/30 transition-all disabled:opacity-50 flex items-center gap-1"
                              >
                                {closingId === trd.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                {lang === 'uk' ? 'Закрити за ринком' : 'Close at market'}
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteTrade(trd.id)}
                              className="text-[#64748B] hover:text-[#FF2A6D] p-1.5 rounded hover:bg-[#FF2A6D]/20 transition-colors"
                              title={t.deleteTrade}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1 bg-[#050811] p-2.5 rounded-[2px] border border-cyan-500/15 text-xs">
                          <div className="flex items-start gap-1.5 text-[#E2E8F0]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00F5D4] shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[#64748B] font-semibold">{t.entryReason}: </span>
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
            <div className="space-y-4 font-neo-mono">
              <div className="p-4 bg-[#00F5D4]/10 border border-[#00F5D4]/30 rounded-[2px] space-y-2">
                <div className="flex items-center gap-2 text-[#00F5D4] font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-[#00F5D4]" />
                  {lang === 'uk' ? 'AI Рекомендації для підвищення прибутковості' : 'AI Profit Optimization Advice'}
                </div>
                <p className="text-xs text-[#E2E8F0] leading-relaxed font-mono">
                  {lang === 'uk'
                    ? `Аналіз показує Win Rate ${stats.winRate}% на основі ${stats.totalTrades} угод. AI обчислив наступні кроки:`
                    : `Analysis shows ${stats.winRate}% Win Rate across ${stats.totalTrades} trades. AI generated the following steps:`}
                </p>
                <p className="text-[10px] text-[#64748B] font-mono">
                  {lang === 'uk'
                    ? 'Ваги Confluence Matrix автоматично коригуються на основі цієї статистики (потрібно ≥8 закритих угод).'
                    : 'Confluence Matrix weights auto-adjust based on this statistics (requires ≥8 closed trades).'}
                </p>
              </div>

              <div className="space-y-3">
                {aiAdvice.map((adv) => (
                  <div
                    key={adv.id}
                    className="p-4 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] space-y-2 hover:border-[#00F5D4]/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#E2E8F0] text-sm flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-[#FFB800]" />
                        {adv.title}
                      </h4>
                      <span className="neo-hud-badge">
                        {adv.impactScore}
                      </span>
                    </div>

                    <p className="text-xs text-[#E2E8F0] leading-relaxed">{adv.description}</p>

                    <div className="p-2.5 bg-[#050811] border border-cyan-500/20 rounded text-xs text-[#00F5D4] font-mono flex items-center gap-2">
                      <span className="font-bold">{lang === 'uk' ? 'Крок дії:' : 'Action:'}</span> {adv.actionableStep}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ANALYTICS' && (
            <div className="space-y-4 font-neo-mono">
              <h3 className="font-bold text-[#E2E8F0] text-xs uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#00FF9D]" />
                Окрема Аналітика Доходності Торгового Щоденника
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-num">
                <div className="p-4 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] text-center">
                  <div className="text-xs text-[#64748B] uppercase">Очікувана вигода (Expectancy)</div>
                  <div className="text-2xl font-extrabold text-[#00FF9D] mt-1">
                    {stats.totalTrades > 0 ? `${stats.totalPnL >= 0 ? '+' : ''}$${(stats.totalPnL / stats.totalTrades).toFixed(2)}` : '—'}
                  </div>
                  <div className="text-[10px] text-[#64748B] mt-1">На угоду</div>
                </div>

                <div className="p-4 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] text-center">
                  <div className="text-xs text-[#64748B] uppercase">Sharpe-подібний коефіцієнт</div>
                  <div className="text-2xl font-extrabold text-[#00F5D4] mt-1">{sharpe !== null ? sharpe : '—'}</div>
                  <div className="text-[10px] text-[#64748B] mt-1">
                    {sharpe === null ? 'Потрібно ≥3 закритих угод' : 'mean(PnL) / stddev(PnL)'}
                  </div>
                </div>

                <div className="p-4 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] text-center">
                  <div className="text-xs text-[#64748B] uppercase">Максимальна просідання (Max DD)</div>
                  <div className="text-2xl font-extrabold text-[#FF2A6D] mt-1">
                    {maxDrawdown !== null ? `-${maxDrawdown}%` : '—'}
                  </div>
                  <div className="text-[10px] text-[#64748B] mt-1">Від пікового еквіті</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
