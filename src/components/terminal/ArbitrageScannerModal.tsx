'use client';

import React, { useState, useEffect } from 'react';
import { ArbitrageOpportunity } from '@/types/arbitrage';
import { getLiveArbitrageScanner } from '@/lib/arbitrage/scanner';
import { Language, getTranslation } from '@/lib/i18n';
import { ArrowRightLeft, X, RefreshCw, Zap, Calculator, BarChart3, TrendingUp, ShieldCheck, DollarSign } from 'lucide-react';

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
    setTimeout(() => {
      setOpportunities(getLiveArbitrageScanner());
      setIsRefreshing(false);
    }, 250);
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#090d16] border border-slate-700/80 rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 bg-[#0d1424] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-100 text-sm tracking-wider flex items-center gap-2 font-mono">
                CEX / DEX REAL-TIME ARBITRAGE TERMINAL
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE REALTIME FEED (3s)
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Сканер спредів, арбітражний калькулятор прибутку та аналітика доходності
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOpportunities}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono font-bold transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              ОНОВИТИ
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-2 bg-[#090d16] border-b border-slate-800 flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('SCANNER')}
            className={`px-3.5 py-1.5 rounded font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'SCANNER'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            СКАНЕР СПРЕДІВ ({opportunities.length})
          </button>

          <button
            onClick={() => setActiveTab('CALCULATOR')}
            className={`px-3.5 py-1.5 rounded font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'CALCULATOR'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            КАЛЬКУЛЯТОР ПРИБУТКУ ТА КОМІСІЙ
          </button>

          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-3.5 py-1.5 rounded font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ANALYTICS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            ОКРЕМА АНАЛІТИКА АРБІТРАЖУ
          </button>
        </div>

        {/* Tab 1: Scanner Grid */}
        {activeTab === 'SCANNER' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded transition-all font-bold ${
                  filterType === 'ALL'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ВСІ СПРЕДИ
              </button>
              <button
                onClick={() => setFilterType('CEX_DEX')}
                className={`px-3 py-1 rounded transition-all font-bold ${
                  filterType === 'CEX_DEX'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                CRYPTO CEX ↔ DEX
              </button>
              <button
                onClick={() => setFilterType('FIAT_TRIANGULAR')}
                className={`px-3 py-1 rounded transition-all font-bold ${
                  filterType === 'FIAT_TRIANGULAR'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FIAT TRIANGULAR FX
              </button>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden font-mono-num text-xs bg-[#0b101d]">
              <div className="grid grid-cols-12 p-3 bg-[#0d1424] border-b border-slate-800 text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">
                <div className="col-span-2">АКТИВ / ПАРА</div>
                <div className="col-span-3">КУПІВЛЯ (LOW)</div>
                <div className="col-span-3">ПРОДАЖ (HIGH)</div>
                <div className="col-span-2 text-right">СПРЕД (%)</div>
                <div className="col-span-2 text-right">ПРИБУТОК / $1K</div>
              </div>

              <div className="divide-y divide-slate-800/60">
                {filtered.map((opp) => (
                  <div
                    key={opp.id}
                    className="grid grid-cols-12 p-3 items-center hover:bg-[#11192e] transition-colors"
                  >
                    <div className="col-span-2 font-mono font-extrabold text-slate-100 text-xs">
                      {opp.asset}
                    </div>

                    <div className="col-span-3">
                      <div className="text-slate-200 font-semibold">{opp.buyExchange}</div>
                      <div className="text-[11px] text-sky-400 font-mono">${opp.buyPrice}</div>
                    </div>

                    <div className="col-span-3">
                      <div className="text-slate-200 font-semibold">{opp.sellExchange}</div>
                      <div className="text-[11px] text-emerald-400 font-mono">${opp.sellPrice}</div>
                    </div>

                    <div className="col-span-2 text-right">
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded font-mono font-bold text-xs">
                        +{opp.spreadPercent}%
                      </span>
                    </div>

                    <div className="col-span-2 text-right flex items-center justify-end gap-2">
                      <div>
                        <div className="font-bold text-emerald-400 text-sm font-mono">+${opp.netProfitUsd}</div>
                        <div className="text-[9px] text-slate-500 font-mono">GAS: ~${opp.estGasAndFees}</div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedArbSymbol(opp.asset);
                          setSelectedSpreadPercent(opp.spreadPercent);
                          setActiveTab('CALCULATOR');
                        }}
                        className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded transition-all"
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
          <div className="flex-1 overflow-y-auto p-5 space-y-5 font-mono">
            <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl space-y-4">
              <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-400" />
                Калькулятор Чистого Арбітражного Прибутку та Комісій
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 text-[11px]">Сума капіталу ($)</label>
                  <input
                    type="number"
                    value={tradeCapital}
                    onChange={(e) => setTradeCapital(parseFloat(e.target.value) || 1000)}
                    className="w-full mt-1 p-2 bg-[#111827] border border-slate-700 rounded text-slate-100 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[11px]">Арбітражний Спред (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedSpreadPercent}
                    onChange={(e) => setSelectedSpreadPercent(parseFloat(e.target.value) || 1.0)}
                    className="w-full mt-1 p-2 bg-[#111827] border border-slate-700 rounded text-slate-100 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[11px]">Комісія біржі Taker/Maker (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={exchangeFeePercent}
                    onChange={(e) => setExchangeFeePercent(parseFloat(e.target.value) || 0.1)}
                    className="w-full mt-1 p-2 bg-[#111827] border border-slate-700 rounded text-slate-100 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[11px]">Комісія мережі Gas / Withdrawal ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={withdrawalFeeUsd}
                    onChange={(e) => setWithdrawalFeeUsd(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 bg-[#111827] border border-slate-700 rounded text-slate-100 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Calculation Output Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-num">
              <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl text-center">
                <div className="text-xs text-slate-400 uppercase">Валовий прибуток</div>
                <div className="text-lg font-bold text-sky-400 mt-1">+${grossProfitUsd.toFixed(2)}</div>
              </div>

              <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl text-center">
                <div className="text-xs text-slate-400 uppercase">Сумарні комісії (Биржа + Газ)</div>
                <div className="text-lg font-bold text-rose-400 mt-1">-${(tradingFeesUsd + withdrawalFeeUsd).toFixed(2)}</div>
              </div>

              <div className="p-4 bg-[#0d1424] border border-amber-500/40 rounded-xl text-center bg-amber-500/5">
                <div className="text-xs text-amber-400 uppercase font-bold">Чистий ROI % та Прибуток ($)</div>
                <div className="text-xl font-extrabold text-emerald-400 mt-1">
                  +${netProfitUsd.toFixed(2)} ({netRoiPercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Dedicated Arbitrage Analytics */}
        {activeTab === 'ANALYTICS' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5 font-mono">
            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Окрема Аналітика Доходності Арбітражних Сесій
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-num">
              <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl text-center">
                <div className="text-xs text-slate-400 uppercase">Знайдено арбітражних вікон</div>
                <div className="text-2xl font-extrabold text-slate-100 mt-1">142</div>
                <div className="text-[10px] text-slate-500 mt-1">За останні 24 години</div>
              </div>

              <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl text-center">
                <div className="text-xs text-slate-400 uppercase">Середній спред на ринку</div>
                <div className="text-2xl font-extrabold text-amber-400 mt-1">+1.74%</div>
                <div className="text-[10px] text-slate-500 mt-1">CEX / DEX Liquidity Pools</div>
              </div>

              <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl text-center">
                <div className="text-xs text-slate-400 uppercase">Накопичений потенційний прибуток</div>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">+$4,820.50</div>
                <div className="text-[10px] text-slate-500 mt-1">З урахуванням усіх комісій</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
