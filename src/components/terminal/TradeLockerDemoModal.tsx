'use client';

import React, { useState, useEffect } from 'react';
import { TradeLockerAccountInfo, TradeLockerPosition } from '@/types/tradelocker';
import { INITIAL_DEMO_ACCOUNT } from '@/lib/tradelocker/demoStore';
import { Language, getTranslation } from '@/lib/i18n';
import {
  Wallet,
  X,
  Server,
  Layers,
  CheckCircle2,
  Share2,
  Lock,
  ShieldCheck,
  Zap,
  Key,
  Trash2,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

interface TradeLockerDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  positions: TradeLockerPosition[];
  onClosePosition: (id: string) => void;
  onAddPosition: (pos: TradeLockerPosition) => void;
}

const STORAGE_ACCOUNT_KEY = 'nexus_quant_tl_demo_account';

export const TradeLockerDemoModal: React.FC<TradeLockerDemoModalProps> = ({
  isOpen,
  onClose,
  lang,
  positions,
  onClosePosition,
  onAddPosition,
}) => {
  const t = getTranslation(lang);
  const [account, setAccount] = useState<TradeLockerAccountInfo>(INITIAL_DEMO_ACCOUNT);

  // Connection & Vault Form State
  const [environment, setEnvironment] = useState<'DEMO' | 'LIVE'>('DEMO');
  const [server, setServer] = useState('TradeLocker-Demo-Server-01');
  const [email, setEmail] = useState('trader@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [vaultStatus, setVaultStatus] = useState<string | null>('AES-256-GCM ENCRYPTED');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAcc = localStorage.getItem(STORAGE_ACCOUNT_KEY);
      if (savedAcc) {
        try {
          setAccount(JSON.parse(savedAcc));
        } catch {
          setAccount(INITIAL_DEMO_ACCOUNT);
        }
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/tradelocker/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ server, email, password, environment }),
      });

      const data = await res.json();

      if (data.success) {
        const updated: TradeLockerAccountInfo = {
          ...account,
          server,
          accountName: environment === 'LIVE' ? 'Real Live Account' : 'Demo Account',
          isDemo: environment === 'DEMO',
          connected: true,
        };
        setAccount(updated);
        setVaultStatus(data.vaultInfo.encryptedStatus);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_ACCOUNT_KEY, JSON.stringify(updated));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePurgeGDPRData = async () => {
    if (confirm('GDPR: Ви впевнені, що хочете видалити всі збережені зашифровані ключі TradeLocker?')) {
      await fetch('/api/tradelocker/vault', { method: 'DELETE' });
      localStorage.removeItem(STORAGE_ACCOUNT_KEY);
      setVaultStatus(null);
      alert('Всі зашифровані дані TradeLocker повністю видалено згідно GDPR.');
    }
  };

  const handleCopyDemoLink = () => {
    const link = `${window.location.origin}/pro-dashboard?demo=true&tradelocker=demo_active`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const totalUnrealizedPnl = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#090d16] border border-slate-700/80 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 bg-[#0d1424] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-100 text-sm tracking-wider flex items-center gap-2 font-mono">
                TRADELOCKER SECURE VAULT
                <span
                  className={`px-2 py-0.5 rounded text-[10px] ${
                    environment === 'LIVE'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {environment === 'LIVE' ? 'LIVE REAL TRADING' : 'DEMO SANDBOX'}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Шифрування за стандартом AES-256-GCM та повна відповідність GDPR
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyDemoLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded text-xs font-mono font-bold transition-all"
            >
              {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Посилання скопійовано!' : 'Поділитись демо-доступом'}
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demo/Live Account Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3.5 bg-[#0b101d] border-b border-slate-800 text-center font-mono-num text-xs">
          <div className="p-2.5 bg-[#111827] rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Баланс рахунку</div>
            <div className="font-extrabold text-slate-100 text-sm">${account.balance.toLocaleString('en-US')} USD</div>
          </div>

          <div className="p-2.5 bg-[#111827] rounded border border-slate-800">
            <div className="text-[10px] text-sky-400 uppercase">Equity (Засоби)</div>
            <div className="font-extrabold text-sky-300 text-sm">
              ${(account.balance + totalUnrealizedPnl).toLocaleString('en-US')}
            </div>
          </div>

          <div className="p-2.5 bg-[#111827] rounded border border-slate-800">
            <div className="text-[10px] text-emerald-400 uppercase">Плаваючий PnL</div>
            <div
              className={`font-extrabold text-sm ${
                totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {totalUnrealizedPnl >= 0 ? `+$${totalUnrealizedPnl}` : `-$${Math.abs(totalUnrealizedPnl)}`}
            </div>
          </div>

          <div className="p-2.5 bg-[#111827] rounded border border-slate-800">
            <div className="text-[10px] text-purple-400 uppercase">Режим акаунту</div>
            <div className="font-extrabold text-purple-300 text-sm">{account.isDemo ? 'DEMO' : 'REAL LIVE'}</div>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Active TradeLocker Positions Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                Відкриті позиції ({positions.length})
              </h3>
              <span className="text-[11px] text-slate-400">TradeLocker Direct API Bridge</span>
            </div>

            {positions.length === 0 ? (
              <div className="p-6 text-center text-slate-500 font-mono text-xs border border-slate-800 rounded-lg">
                Немає відкритих позицій на рахунку.
              </div>
            ) : (
              <div className="border border-slate-800 rounded-lg overflow-hidden font-mono-num text-xs bg-[#0b101d]">
                <div className="grid grid-cols-12 p-2.5 bg-[#0d1424] border-b border-slate-800 text-[10px] text-slate-400 uppercase font-mono font-bold">
                  <div className="col-span-2">СИМВОЛ</div>
                  <div className="col-span-2">ТИП / ОБСЯГ</div>
                  <div className="col-span-2">ВХІД</div>
                  <div className="col-span-2">ПОТОЧНА ЦІНА</div>
                  <div className="col-span-2 text-right">PnL ($)</div>
                  <div className="col-span-2 text-right">ДІЯ</div>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {positions.map((pos) => {
                    const isWin = pos.unrealizedPnl >= 0;
                    return (
                      <div key={pos.id} className="grid grid-cols-12 p-3 items-center hover:bg-[#11192e] transition-colors">
                        <div className="col-span-2 font-mono font-extrabold text-slate-100 text-xs">
                          {pos.symbol}
                        </div>

                        <div className="col-span-2 flex items-center gap-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              pos.type === 'BUY'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            {pos.type}
                          </span>
                          <span className="text-slate-400 font-mono">{pos.volume} lot</span>
                        </div>

                        <div className="col-span-2 text-slate-300 font-mono">{pos.openPrice}</div>
                        <div className="col-span-2 text-sky-300 font-mono font-bold">{pos.currentPrice}</div>

                        <div className="col-span-2 text-right font-extrabold text-xs font-mono">
                          <span className={isWin ? 'text-emerald-400' : 'text-rose-400'}>
                            {isWin ? `+$${pos.unrealizedPnl}` : `-$${Math.abs(pos.unrealizedPnl)}`}
                          </span>
                        </div>

                        <div className="col-span-2 text-right">
                          <button
                            onClick={() => onClosePosition(pos.id)}
                            className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded text-[10px] font-mono font-bold transition-all"
                          >
                            Закрити
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Encrypted Credentials Vault Form */}
          <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Зашифроване Сховище Ключів TradeLocker (AES-256-GCM)
              </h3>

              {/* Environment Switcher Pills */}
              <div className="flex items-center gap-1 bg-[#090d16] p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setEnvironment('DEMO')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    environment === 'DEMO'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  DEMO
                </button>
                <button
                  onClick={() => setEnvironment('LIVE')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    environment === 'LIVE'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  REAL LIVE
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400">Сервер TradeLocker</label>
                  <input
                    type="text"
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                    className="w-full p-2 bg-[#111827] border border-slate-700 rounded text-slate-200 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Email TradeLocker</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-[#111827] border border-slate-700 rounded text-slate-200 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Пароль / API Key</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 bg-[#111827] border border-slate-700 rounded text-slate-200 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#090d16] border border-slate-800 rounded flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>GDPR Compliant: Ключі зашифровані в AES-256. Адміністратори не мають доступу.</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePurgeGDPRData}
                    className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 rounded font-bold transition-all flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Видалити ключі (GDPR)
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded shadow-lg transition-all"
                  >
                    Зашифрувати та зберегти
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
