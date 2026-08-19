'use client';

import React, { useState } from 'react';
import { Signal, TradeLockerExecutionResponse } from '@/types';
import { Language, getTranslation } from '@/lib/i18n';
import { ShieldCheck, CheckCircle2, AlertTriangle, Send, X, Cpu, Activity, Newspaper } from 'lucide-react';

interface SignalDetailModalProps {
  signal: Signal | null;
  onClose: () => void;
  lang?: Language;
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({ signal, onClose, lang = 'uk' }) => {
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700/80 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#090d16] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded text-xs font-bold font-mono ${
                isBuy
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {signal.direction} {signal.symbol}
            </div>
            <span className="text-slate-400 text-xs font-mono">{signal.timeframe} Timeframe</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded text-xs">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span className="font-mono-num font-bold text-sky-300">
                {signal.confluence_score}% {t.confluenceScore}
              </span>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Signal Entry SL TP Banner */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#090d16] border border-slate-800 rounded-lg text-center font-mono-num">
            <div>
              <div className="text-xs text-slate-400 mb-1">{t.entry}</div>
              <div className="text-lg font-bold text-slate-100">{signal.entry}</div>
            </div>
            <div>
              <div className="text-xs text-rose-400 mb-1">{t.stopLoss}</div>
              <div className="text-lg font-bold text-rose-400">{signal.sl}</div>
            </div>
            <div>
              <div className="text-xs text-emerald-400 mb-1">{t.takeProfit}</div>
              <div className="text-lg font-bold text-emerald-400">{signal.tp}</div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              {lang === 'uk' ? 'Фактори конфлюенції' : 'Confluence Factors Breakdown'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#111827] border border-slate-800 rounded-lg flex items-start gap-3">
                <Cpu className="w-4 h-4 text-sky-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">{lang === 'uk' ? 'Свічковий паттерн' : 'Candlestick Pattern'}</div>
                  <div className="text-slate-400 mt-0.5">
                    Pattern: <span className="text-sky-300 font-mono">{signal.pattern_detected}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#111827] border border-slate-800 rounded-lg flex items-start gap-3">
                <Activity className="w-4 h-4 text-purple-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">Smart Money Concepts</div>
                  <div className="flex gap-2 mt-1">
                    {signal.smc_confluence.fvg_detected && (
                      <span className="bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-1.5 py-0.5 rounded text-[10px]">
                        FVG
                      </span>
                    )}
                    {signal.smc_confluence.bos_detected && (
                      <span className="bg-purple-950 text-purple-300 border border-purple-800/40 px-1.5 py-0.5 rounded text-[10px]">
                        BOS
                      </span>
                    )}
                    {signal.smc_confluence.liquidity_sweep && (
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-1.5 py-0.5 rounded text-[10px]">
                        Sweep
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#111827] border border-slate-800 rounded-lg flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">{lang === 'uk' ? 'Квант метрики' : 'Quant Metrics'}</div>
                  <div className="text-slate-400 font-mono mt-0.5">
                    Z-Score: {signal.quant_confluence.z_score} | ATR: {signal.quant_confluence.atr}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#111827] border border-slate-800 rounded-lg flex items-start gap-3">
                <Newspaper className="w-4 h-4 text-amber-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">{t.fundamentalRadar}</div>
                  <div className="text-emerald-400 mt-0.5 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {lang === 'uk' ? 'Новинний буфер чистий' : 'News buffer clear'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TradeLocker Execution Box */}
          <div className="p-4 bg-[#090d16] border border-slate-800 rounded-lg space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                TradeLocker Execution Bridge
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">{t.lotSize}:</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="10.0"
                  value={lotSize}
                  onChange={(e) => setLotSize(parseFloat(e.target.value) || 0.1)}
                  className="w-20 px-2 py-1 bg-[#111827] border border-slate-700 rounded text-xs font-mono text-center text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <button
              onClick={handleExecuteTradeLocker}
              disabled={isExecuting}
              className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                isBuy
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
              } disabled:opacity-50`}
            >
              <Send className="w-4 h-4" />
              {isExecuting
                ? t.routingOrder
                : `${t.executeTrade} (${lotSize} LOTS)`}
            </button>

            {executionResult && (
              <div
                className={`p-3 rounded text-xs border ${
                  executionResult.success
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5">
                  {executionResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {executionResult.message}
                </div>
                {executionResult.orderId && (
                  <div className="mt-1 font-mono text-[11px] text-slate-400">
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
