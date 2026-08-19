'use client';

import React, { useState, useEffect } from 'react';
import { ArbitrageOpportunity } from '@/types/arbitrage';
import { getLiveArbitrageScanner } from '@/lib/arbitrage/scanner';
import { Language, getTranslation } from '@/lib/i18n';
import { ArrowRightLeft, X, RefreshCw, Calculator, BarChart3 } from 'lucide-react';

interface ArbitrageScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ArbitrageScannerModal: React.FC<ArbitrageScannerModalProps> = ({ isOpen, onClose, lang }) => {
  const t = getTranslation(lang);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [activeTab, setActiveTab] = useState<'SCANNER' | 'CALCULATOR' | 'ANALYTICS'>('SCANNER');
  const [filterType, setFilterType] = useState<'ALL' | 'CEX_DEX' | 'FIAT_TRIANGULAR'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Arbitrage Calculator Input States
  const [tradeCapital, setTradeCapital] = useState<number>(5000);
  const [exchangeFeePercent, setExchangeFeePercent] = useState<number>(0.10); // 0.10% fee
  const [withdrawalFeeUsd, setWithdrawalFeeUsd] = useState<number>(2.50); // $2.50 gas/withdrawal
  const [selectedArbSymbol, setSelectedArbSymbol] = useState<string>('SOL/USDT');
  const [selectedSpreadPercent, setSelectedSpreadPercent] = useState<number>(1.85);

  const fetchOpportunities = () => {
    setIsRefreshing(true);
    setOpportunities(getLiveArbitrageScanner());
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchOpportunities();
      // Auto refresh spreads every 3 seconds for live real-time feel
      const interval = setInterval(fetchOpportunities, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = filterType === 'ALL'
    ? opportunities
    : opportunities.filter((o) => o.type === filterType);

  // Calculator Math Calculations
  const grossProfitUsd = (tradeCapital * (selectedSpreadPercent / 100));
  const tradingFeesUsd = (tradeCapital * (exchangeFeePercent / 100) * 2); // buy & sell fee
  const netProfitUsd = Math.max(0, grossProfitUsd - tradingFeesUsd - withdrawalFeeUsd);
  const netRoiPercent = (netProfitUsd / tradeCapital) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#050811]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-neo-mono select-none">
      <div className="neo-panel rounded-[3px] w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl neo-hud-bracket animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-3.5 bg-[#090E1C] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[2px] bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800]">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-[#E2E8F0] text-xs tracking-wider flex items-center gap-2 font-neo-display">
                CEX / DEX REAL-TIME ARBITRAGE TERMINAL
                <span className="neo-hud-badge">
                  [SYS::ARBITRAGE]
                </span>
              </h2>
              <p className="text-[10px] text-[#64748B] font-neo-mono">
                // REAL-TIME SPREAD RADAR & NET PROFIT CALCULATOR
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOpportunities}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#0F172A] hover:bg-[#090E1C] text-[#E2E8F0] border border-cyan-500/20 rounded-[2px] text-xs font-neo-mono font-bold transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              ОНОВИТИ
            </button>

            <button
              onClick={onClose}
              className="text-[#64748B] hover:text-[#E2E8F0] p-1.5 rounded-[2px] hover:bg-[#0F172A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-2 bg-[#050811] border-b border-cyan-500/20 flex items-center gap-2 text-xs font-neo-mono">
          <button
            onClick={() => setActiveTab('SCANNER')}
            className={`px-3.5 py-1 rounded-[2px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'SCANNER'
                ? 'bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/40 shadow-sm'
                : 'text-[#64748B] hover:text-[#E2E8F0]'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            СКАНЕР СПРЕДІВ ({opportunities.length})
          </button>

          <button
            onClick={() => setActiveTab('CALCULATOR')}
            className={`px-3.5 py-1 rounded-[2px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'CALCULATOR'
                ? 'bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/40 shadow-sm'
                : 'text-[#64748B] hover:text-[#E2E8F0]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            КАЛЬКУЛЯТОР ПРИБУТКУ
          </button>

          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-3.5 py-1 rounded-[2px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ANALYTICS'
                ? 'bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/40 shadow-sm'
                : 'text-[#64748B] hover:text-[#E2E8F0]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            ОКРЕМА АНАЛІТИКА
          </button>
        </div>

        {/* Tab 1: Scanner Grid */}
        {activeTab === 'SCANNER' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-neo-mono">
            <div className="flex items-center gap-2 text-xs font-neo-mono">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-[2px] transition-all font-bold ${
                  filterType === 'ALL'
                    ? 'bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40'
                    : 'text-[#64748B] hover:text-[#E2E8F0]'
                }`}
              >
                ВСІ СПРЕДИ
              </button>
              <button
                onClick={() => setFilterType('CEX_DEX')}
                className={`px-3 py-1 rounded-[2px] transition-all font-bold ${
                  filterType === 'CEX_DEX'
                    ? 'bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40'
                    : 'text-[#64748B] hover:text-[#E2E8F0]'
                }`}
              >
                CRYPTO CEX ↔ DEX
              </button>
              <button
                onClick={() => setFilterType('FIAT_TRIANGULAR')}
                className={`px-3 py-1 rounded-[2px] transition-all font-bold ${
                  filterType === 'FIAT_TRIANGULAR'
                    ? 'bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/40'
                    : 'text-[#64748B] hover:text-[#E2E8F0]'
                }`}
              >
                FIAT TRIANGULAR FX
              </button>
            </div>

            <div className="border border-cyan-500/20 rounded-[2px] overflow-hidden font-mono-num text-xs bg-[#050811]">
              <div className="grid grid-cols-12 p-2.5 bg-[#090E1C] border-b border-cyan-500/20 text-[10px] text-[#64748B] uppercase font-mono font-bold tracking-wider">
                <div className="col-span-2">АКТИВ / ПАРА</div>
                <div className="col-span-3">КУПІВЛЯ (LOW)</div>
                <div className="col-span-3">ПРОДАЖ (HIGH)</div>
                <div className="col-span-2 text-right">СПРЕД (%)</div>
                <div className="col-span-2 text-right">ПРИБУТОК / $1K</div>
              </div>

              <div className="divide-y divide-cyan-500/10">
                {filtered.map((opp) => (
                  <div
                    key={opp.id}
                    className="grid grid-cols-12 p-3 items-center hover:bg-[#0F172A] transition-colors font-mono-num"
                  >
                    <div className="col-span-2 font-bold text-[#E2E8F0] text-xs">
                      {opp.asset}
                    </div>

                    <div className="col-span-3">
                      <div className="text-[#E2E8F0] font-semibold">{opp.buyExchange}</div>
                      <div className="text-[11px] text-[#00F5D4] font-mono">${opp.buyPrice}</div>
                    </div>

                    <div className="col-span-3">
                      <div className="text-[#E2E8F0] font-semibold">{opp.sellExchange}</div>
                      <div className="text-[11px] text-[#00FF9D] font-mono">${opp.sellPrice}</div>
                    </div>

                    <div className="col-span-2 text-right">
                      <span className="px-2 py-0.5 bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/40 rounded-[2px] font-mono font-bold text-xs">
                        +{opp.spreadPercent}%
                      </span>
                    </div>

                    <div className="col-span-2 text-right flex items-center justify-end gap-2">
                      <div>
                        <div className="font-extrabold text-[#00FF9D] text-sm font-mono">+${opp.netProfitUsd}</div>
                        <div className="text-[9px] text-[#64748B] font-mono">GAS: ~${opp.estGasAndFees}</div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedArbSymbol(opp.asset);
                          setSelectedSpreadPercent(opp.spreadPercent);
                          setActiveTab('CALCULATOR');
                        }}
                        className="p-1.5 bg-[#FFB800]/20 hover:bg-[#FFB800]/30 text-[#FFB800] border border-[#FFB800]/40 rounded-[2px] transition-all"
                        title="Порахувати у калькуляторі"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Arbitrage Calculator */}
        {activeTab === 'CALCULATOR' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 font-neo-mono">
            <div className="p-4 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] space-y-4">
              <h3 className="font-bold text-[#E2E8F0] text-xs uppercase tracking-wider flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#FFB800]" />
                Калькулятор Чистого Арбітражного Прибутку та Комісій
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono-num">
                <div>
                  <label className="text-[#64748B] text-[11px]">Сума капіталу ($)</label>
                  <input
                    type="number"
                    value={tradeCapital}
                    onChange={(e) => setTradeCapital(parseFloat(e.target.value) || 1000)}
                    className="w-full mt-1 p-2 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-bold focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#64748B] text-[11px]">Арбітражний Спред (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedSpreadPercent}
                    onChange={(e) => setSelectedSpreadPercent(parseFloat(e.target.value) || 1.0)}
                    className="w-full mt-1 p-2 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-bold focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#64748B] text-[11px]">Комісія біржі Taker/Maker (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={exchangeFeePercent}
                    onChange={(e) => setExchangeFeePercent(parseFloat(e.target.value) || 0.1)}
                    className="w-full mt-1 p-2 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-bold focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#64748B] text-[11px]">Комісія мережі Gas / Withdrawal ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={withdrawalFeeUsd}
                    onChange={(e) => setWithdrawalFeeUsd(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-[#E2E8F0] font-bold focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Calculation Output Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-num">
              <div className="p-4 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] text-center">
                <div className="text-xs text-[#64748B] uppercase">Валовий прибуток</div>
                <div className="text-lg font-bold text-[#00F5D4] mt-1">+${grossProfitUsd.toFixed(2)}</div>
              </div>

              <div className="p-4 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] text-center">
                <div className="text-xs text-[#64748B] uppercase">Сумарні комісії (Биржа + Газ)</div>
                <div className="text-lg font-bold text-[#FF2A6D] mt-1">-${(tradingFeesUsd + withdrawalFeeUsd).toFixed(2)}</div>
              </div>

              <div className="p-4 bg-[#090E1C] border border-[#FFB800]/40 rounded-[2px] text-center bg-[#FFB800]/5">
                <div className="text-xs text-[#FFB800] uppercase font-bold">Чистий ROI % та Прибуток ($)</div>
                <div className="text-xl font-extrabold text-[#00FF9D] mt-1">
                  +${netProfitUsd.toFixed(2)} ({netRoiPercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Dedicated Arbitrage Analytics */}
        {activeTab === 'ANALYTICS' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 font-neo-mono">
            <h3 className="font-bold text-[#E2E8F0] text-xs uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#00FF9D]" />
              Окрема Аналітика Доходності Арбітражних Сесій
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-num">
              <div className="p-4 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] text-center">
                <div className="text-xs text-[#64748B] uppercase">Знайдено арбітражних вікон</div>
                <div className="text-2xl font-extrabold text-[#E2E8F0] mt-1">142</div>
                <div className="text-[10px] text-[#64748B] mt-1">За останні 24 години</div>
              </div>

              <div className="p-4 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] text-center">
                <div className="text-xs text-[#64748B] uppercase">Середній спред на ринку</div>
                <div className="text-2xl font-extrabold text-[#FFB800] mt-1">+1.74%</div>
                <div className="text-[10px] text-[#64748B] mt-1">CEX / DEX Liquidity Pools</div>
              </div>

              <div className="p-4 bg-[#090E1C] border border-cyan-500/20 rounded-[2px] text-center">
                <div className="text-xs text-[#64748B] uppercase">Накопичений потенційний прибуток</div>
                <div className="text-2xl font-extrabold text-[#00FF9D] mt-1">+$4,820.50</div>
                <div className="text-[10px] text-[#64748B] mt-1">З урахуванням усіх комісій</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
