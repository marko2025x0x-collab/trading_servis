'use client';

import React from 'react';
import { TradeLockerPosition } from '@/types/tradelocker';
import { Language, getTranslation } from '@/lib/i18n';
import { Layers, ShieldCheck, Zap, X, Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface OpenPositionsPanelProps {
  positions: TradeLockerPosition[];
  onClosePosition: (id: string) => void;
  onOpenTradeLockerModal: () => void;
  lang?: Language;
}

export const OpenPositionsPanel: React.FC<OpenPositionsPanelProps> = ({
  positions,
  onClosePosition,
  onOpenTradeLockerModal,
  lang = 'uk',
}) => {
  const t = getTranslation(lang);
  const totalUnrealizedPnl = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);

  return (
    <div className="w-full neo-panel rounded-[3px] p-3 flex flex-col space-y-2.5 font-neo-mono shadow-xl neo-hud-bracket h-full overflow-hidden">
      {/* Panel Top Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[2px] bg-[#00FF9D]/10 border border-[#00FF9D]/30 flex items-center justify-center text-[#00FF9D]">
            <Layers className="w-3 h-3" />
          </div>
          <h3 className="font-extrabold text-[#E2E8F0] text-xs tracking-wider uppercase flex items-center gap-2 font-neo-display">
            <span>ВІДКРИТІ ПОЗИЦІЇ TRADELOCKER</span>
            <span className="neo-hud-badge">
              [{positions.length} ACTIVE]
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono-num font-bold flex items-center gap-1.5">
            <span className="text-[#94A3B8] text-[10px]">ПЛАВАЮЧИЙ PnL:</span>
            <span
              className={`px-2 py-0.5 rounded-[2px] text-xs font-extrabold ${
                totalUnrealizedPnl >= 0
                  ? 'bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/40'
                  : 'bg-[#FF2A6D]/15 text-[#FF2A6D] border border-[#FF2A6D]/40'
              }`}
            >
              {totalUnrealizedPnl >= 0 ? `+$${totalUnrealizedPnl.toFixed(2)}` : `-$${Math.abs(totalUnrealizedPnl).toFixed(2)}`}
            </span>
          </div>

          <button
            onClick={onOpenTradeLockerModal}
            className="px-2.5 py-0.5 bg-[#00F5D4]/10 hover:bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/30 rounded-[2px] text-[11px] font-neo-mono font-bold transition-all flex items-center gap-1"
          >
            <Wallet className="w-3 h-3 text-[#00F5D4]" />
            СХОВИЩЕ
          </button>
        </div>
      </div>

      {/* Positions Grid / Table */}
      <div className="flex-1 overflow-y-auto min-h-[140px]">
        {positions.length === 0 ? (
          <div className="p-6 text-center text-[#94A3B8] text-xs font-neo-mono flex flex-col items-center justify-center space-y-1 h-full">
            <ShieldCheck className="w-6 h-6 text-[#00F5D4] opacity-30" />
            <div>Немає відкритих ордерів на рахунку TradeLocker.</div>
            <div className="text-[10px] text-[#64748B]">
              Оберніть сигнал праворуч або відправте угоду в 1-Click
            </div>
          </div>
        ) : (
          <div className="border border-cyan-500/20 rounded-[2px] overflow-hidden font-mono-num text-xs bg-[#090E1C]">
            <div className="grid grid-cols-12 p-2 bg-[#050811] border-b border-cyan-500/20 text-[10px] text-[#94A3B8] uppercase font-mono font-bold">
              <div className="col-span-3">СИМВОЛ</div>
              <div className="col-span-2">ТИП / ЛОТ</div>
              <div className="col-span-2">ВХІД</div>
              <div className="col-span-2">ПОТОЧНА</div>
              <div className="col-span-2 text-right">PnL ($)</div>
              <div className="col-span-1 text-center">ДІЯ</div>
            </div>

            <div className="divide-y divide-cyan-500/10">
              {positions.map((pos) => {
                const isWin = pos.unrealizedPnl >= 0;
                return (
                  <div
                    key={pos.id}
                    className="grid grid-cols-12 p-2 items-center hover:bg-[#0F172A] transition-colors"
                  >
                    <div className="col-span-3 font-mono font-extrabold text-[#E2E8F0] text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4]" />
                      {pos.symbol}
                    </div>

                    <div className="col-span-2 flex items-center gap-1">
                      <span
                        className={`px-1.5 py-0.2 rounded-[2px] text-[10px] font-extrabold ${
                          pos.type === 'BUY'
                            ? 'bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30'
                            : 'bg-[#FF2A6D]/15 text-[#FF2A6D] border border-[#FF2A6D]/30'
                        }`}
                      >
                        {pos.type}
                      </span>
                      <span className="text-[#94A3B8] text-[10px] font-mono">{pos.volume}l</span>
                    </div>

                    <div className="col-span-2 text-[#E2E8F0] font-mono">{pos.openPrice}</div>
                    <div className="col-span-2 text-[#00F5D4] font-mono font-bold">{pos.currentPrice}</div>

                    <div className="col-span-2 text-right font-extrabold text-xs font-mono">
                      <span className={isWin ? 'text-[#00FF9D]' : 'text-[#FF2A6D]'}>
                        {isWin ? `+$${pos.unrealizedPnl}` : `-$${Math.abs(pos.unrealizedPnl)}`}
                      </span>
                    </div>

                    <div className="col-span-1 text-center">
                      <button
                        onClick={() => onClosePosition(pos.id)}
                        className="p-1 bg-[#FF2A6D]/10 hover:bg-[#FF2A6D]/20 text-[#FF2A6D] border border-[#FF2A6D]/30 rounded-[2px] text-[10px] font-mono font-bold transition-all"
                        title="Закрити позицію"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
