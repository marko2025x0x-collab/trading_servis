'use client';

import React, { useState } from 'react';
import { Signal, TradeLockerExecutionResponse } from '@/types';
import { TradeLockerPosition } from '@/types/tradelocker';
import { JournalTrade } from '@/types/journal';
import { appendJournalTrade } from '@/lib/journal/storage';
import { Language, getTranslation } from '@/lib/i18n';
import { ShieldCheck, CheckCircle2, AlertTriangle, Send, X, Cpu, Activity, Newspaper } from 'lucide-react';

interface SignalDetailModalProps {
  signal: Signal | null;
  onClose: () => void;
  onAddPosition?: (pos: TradeLockerPosition) => void;
  lang?: Language;
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({
  signal,
  onClose,
  onAddPosition,
  lang = 'uk',
}) => {
  const t = getTranslation(lang);
  const [lotSize, setLotSize] = useState<number>(0.10);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<TradeLockerExecutionResponse | null>(null);

  if (!signal) return null;

  const handleExecuteTradeLocker = async () => {
    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const res = await fetch('/api/tradelocker/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: signal.symbol,
          direction: signal.direction,
          entry: signal.entry,
          stopLoss: signal.sl,
          takeProfit: signal.tp,
          volume: lotSize,
        }),
      });

      const data: TradeLockerExecutionResponse = await res.json();
      setExecutionResult(data);

      if (data.success) {
        const newPos: TradeLockerPosition = {
          id: data.orderId || `TL-POS-${Date.now()}`,
          symbol: signal.symbol,
          type: signal.direction.toUpperCase() as 'BUY' | 'SELL',
          volume: lotSize,
          openPrice: signal.entry,
          currentPrice: signal.entry,
          unrealizedPnl: 0.00,
          stopLoss: signal.sl,
          takeProfit: signal.tp,
          openedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          openTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
        if (onAddPosition) {
          onAddPosition(newPos);
        }

        // Auto-log every real execution to the trader journal so the AI optimizer
        // can learn from actual outcomes instead of manually-entered guesses.
        const tags: string[] = [];
        if (signal.pattern_detected !== 'NONE') tags.push(signal.pattern_detected);
        if (signal.smc_confluence.fvg_detected) tags.push('FVG');
        if (signal.smc_confluence.bos_detected) tags.push('BOS');
        if (signal.smc_confluence.liquidity_sweep) tags.push('LiquiditySweep');
        if (signal.smc_confluence.choch_detected) tags.push('CHoCH');
        if (Math.abs(signal.quant_confluence.z_score) > 1.8) tags.push('Z-Score');
        if (tags.length === 0) tags.push('UNTAGGED');

        const journalEntry: JournalTrade = {
          id: newPos.id,
          symbol: signal.symbol,
          direction: signal.direction,
          entryPrice: signal.entry,
          stopLoss: signal.sl,
          takeProfit: signal.tp,
          lotSize,
          status: 'OPEN',
          entryReason: `Confluence ${signal.confluence_score}% — ${signal.pattern_detected} | Z-Score ${signal.quant_confluence.z_score} | ${signal.news_filter_passed ? 'news clear' : 'news risk'}`,
          timeframe: signal.timeframe,
          confluenceScore: signal.confluence_score,
          winProbability: signal.confluence_score,
          tags,
          createdAt: new Date().toISOString(),
        };
        appendJournalTrade(journalEntry);
      }
    } catch (err) {
      setExecutionResult({
        success: false,
        message: err instanceof Error ? err.message : 'Execution request failed',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const isBuy = signal.direction === 'BUY';

  return (
    <div className="fixed inset-0 z-50 bg-[#050811]/90 backdrop-blur-md flex items-center justify-center p-4 font-neo-mono">
      <div className="bg-[#090E1C] border border-[#00F5D4]/40 rounded-[3px] w-full max-w-2xl overflow-hidden shadow-2xl neo-hud-bracket">
        {/* Header */}
        <div className="p-4 bg-[#050811] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-[2px] text-xs font-bold font-mono ${
                isBuy
                  ? 'bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/40'
                  : 'bg-[#FF2A6D]/15 text-[#FF2A6D] border border-[#FF2A6D]/40'
              }`}
            >
              {signal.direction} {signal.symbol}
            </div>
            <span className="text-[#94A3B8] text-xs font-mono">{signal.timeframe} Timeframe</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#00F5D4]/10 border border-[#00F5D4]/30 px-2.5 py-1 rounded-[2px] text-xs">
              <ShieldCheck className="w-4 h-4 text-[#00F5D4]" />
              <span className="font-mono-num font-bold text-[#00F5D4]">
                {signal.confluence_score}% {t.confluenceScore}
              </span>
            </div>

            <button
              onClick={onClose}
              className="text-[#94A3B8] hover:text-[#E2E8F0] transition-colors p-1 rounded hover:bg-[#0F172A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Signal Entry SL TP Banner */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#050811] border border-cyan-500/20 rounded-[2px] text-center font-mono-num">
            <div>
              <div className="text-xs text-[#94A3B8] mb-1">{t.entry}</div>
              <div className="text-lg font-extrabold text-[#00F5D4]">{signal.entry}</div>
            </div>
            <div>
              <div className="text-xs text-[#FF2A6D] mb-1">{t.stopLoss}</div>
              <div className="text-lg font-extrabold text-[#FF2A6D]">{signal.sl}</div>
            </div>
            <div>
              <div className="text-xs text-[#00FF9D] mb-1">{t.takeProfit}</div>
              <div className="text-lg font-extrabold text-[#00FF9D]">{signal.tp}</div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] font-mono">
              {lang === 'uk' ? 'Фактори конфлюенції' : 'Confluence Factors Breakdown'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#050811] border border-cyan-500/20 rounded-[2px] flex items-start gap-3">
                <Cpu className="w-4 h-4 text-[#00F5D4] mt-0.5" />
                <div>
                  <div className="font-semibold text-[#E2E8F0]">{lang === 'uk' ? 'Свічковий паттерн' : 'Candlestick Pattern'}</div>
                  <div className="text-[#94A3B8] mt-0.5">
                    Pattern: <span className="text-[#00F5D4] font-mono">{signal.pattern_detected}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#050811] border border-cyan-500/20 rounded-[2px] flex items-start gap-3">
                <Activity className="w-4 h-4 text-violet-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#E2E8F0]">Smart Money Concepts</div>
                  <div className="flex gap-2 mt-1">
                    {signal.smc_confluence.fvg_detected && (
                      <span className="neo-hud-badge">
                        FVG
                      </span>
                    )}
                    {signal.smc_confluence.bos_detected && (
                      <span className="neo-hud-badge">
                        BOS
                      </span>
                    )}
                    {signal.smc_confluence.liquidity_sweep && (
                      <span className="neo-hud-badge bg-emerald-500/20 text-[#00FF9D] border-[#00FF9D]/40">
                        Sweep
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#050811] border border-cyan-500/20 rounded-[2px] flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#00FF9D] mt-0.5" />
                <div>
                  <div className="font-semibold text-[#E2E8F0]">{lang === 'uk' ? 'Квант метрики' : 'Quant Metrics'}</div>
                  <div className="text-[#94A3B8] font-mono mt-0.5">
                    Z-Score: {signal.quant_confluence.z_score} | ATR: {signal.quant_confluence.atr}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#050811] border border-cyan-500/20 rounded-[2px] flex items-start gap-3">
                <Newspaper className="w-4 h-4 text-amber-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#E2E8F0]">{t.fundamentalRadar}</div>
                  <div
                    className={`mt-0.5 font-medium flex items-center gap-1 ${
                      signal.news_filter_passed ? 'text-[#00FF9D]' : 'text-[#FF2A6D]'
                    }`}
                  >
                    {signal.news_filter_passed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'uk' ? 'Новинний буфер чистий' : 'News buffer clear'}
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" /> {lang === 'uk' ? 'Ризик новин поруч' : 'News risk nearby'}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TradeLocker Execution Box */}
          <div className="p-4 bg-[#050811] border border-cyan-500/30 rounded-[3px] space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold text-[#E2E8F0] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
                TradeLocker REST API Execution Bridge
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-[#94A3B8] font-bold">{t.lotSize}:</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="10.0"
                  value={lotSize}
                  onChange={(e) => setLotSize(parseFloat(e.target.value) || 0.1)}
                  className="w-20 px-2 py-1 bg-[#090E1C] border border-cyan-500/40 rounded-[2px] text-xs font-mono text-center text-[#00F5D4] font-extrabold focus:outline-none focus:border-[#00F5D4]"
                />
              </div>
            </div>

            <button
              onClick={handleExecuteTradeLocker}
              disabled={isExecuting}
              className={`w-full py-3 rounded-[2px] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg uppercase tracking-wider ${
                isBuy
                  ? 'bg-[#00FF9D] hover:bg-[#00F5D4] text-[#050811] shadow-[#00FF9D]/20'
                  : 'bg-[#FF2A6D] hover:bg-rose-500 text-white shadow-[#FF2A6D]/20'
              } disabled:opacity-50`}
            >
              <Send className="w-4 h-4" />
              {isExecuting
                ? t.routingOrder
                : `[⚡ 1-CLICK TRADELOCKER EXECUTE] (${lotSize} LOTS)`}
            </button>

            {executionResult && (
              <div
                className={`p-3 rounded-[2px] text-xs border ${
                  executionResult.success
                    ? 'bg-[#00FF9D]/15 border-[#00FF9D]/40 text-[#00FF9D]'
                    : 'bg-[#FF2A6D]/15 border-[#FF2A6D]/40 text-[#FF2A6D]'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {executionResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {executionResult.message}
                </div>
                {executionResult.orderId && (
                  <div className="mt-1 font-mono text-[11px] text-[#94A3B8]">
                    TradeLocker Order ID: {executionResult.orderId}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
