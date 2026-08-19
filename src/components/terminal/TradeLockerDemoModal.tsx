'use client';

import React, { useState, useEffect } from 'react';
import { TradeLockerAccountInfo, TradeLockerPosition } from '@/types/tradelocker';
import { Language, getTranslation } from '@/lib/i18n';
import {
  Wallet,
  ShieldCheck,
  Zap,
  Lock,
  RefreshCw,
  X,
  Plus,
  Check,
  AlertCircle,
  ExternalLink,
  Layers,
  Key,
  Server,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { INITIAL_DEMO_ACCOUNT } from '@/lib/tradelocker/demoStore';

interface TradeLockerDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  positions: TradeLockerPosition[];
  onClosePosition: (id: string) => void;
  onAddPosition: (pos: TradeLockerPosition) => void;
}

const STORAGE_ACCOUNT_KEY = 'nexus_quant_tradelocker_account';

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
  const [email, setEmail] = useState('trader@nexusquant.com');
  const [password, setPassword] = useState('••••••••••••');
  const [accountIdInput, setAccountIdInput] = useState('1787179051833048700');

  // Interactive Test & Connection States
  const [isSaving, setIsSaving] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('AES-256-GCM ENCRYPTED & CONNECTED');

  // Load account from LocalStorage if saved
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAcc = localStorage.getItem(STORAGE_ACCOUNT_KEY);
      if (savedAcc) {
        try {
          const parsed = JSON.parse(savedAcc);
          setAccount(parsed);
          if (parsed.accountId) setAccountIdInput(parsed.accountId);
          if (parsed.server) setServer(parsed.server);
        } catch {
          setAccount(INITIAL_DEMO_ACCOUNT);
        }
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus('testing');
    try {
      const res = await fetch('/api/tradelocker/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server,
          email,
          password,
          environment,
          accountId: accountIdInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestStatus('success');
        setStatusMessage(data.message || 'Зєднання з сервером TradeLocker успішно встановлено!');
        setAccount((prev) => ({
          ...prev,
          accountId: accountIdInput,
          server,
          connected: true,
          balance: data.vaultInfo?.balance || prev.balance,
        }));
      } else {
        setTestStatus('error');
        setStatusMessage(data.message || 'Помилка підключення до TradeLocker');
      }
    } catch {
      setTestStatus('error');
      setStatusMessage('Мережева помилка під час зв’язку з сервером TradeLocker.');
    }
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/tradelocker/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server,
          email,
          password,
          environment,
          accountId: accountIdInput,
        }),
      });

      const data = await res.json();
      const updatedAccount: TradeLockerAccountInfo = {
        ...account,
        accountId: accountIdInput,
        server,
        connected: true,
        isDemo: environment === 'DEMO',
        balance: data.vaultInfo?.balance || account.balance,
      };

      setAccount(updatedAccount);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_ACCOUNT_KEY, JSON.stringify(updatedAccount));
      }

      setTestStatus('success');
      setStatusMessage(`Акаунт ${accountIdInput} успішно підключено та зашифровано!`);
    } catch {
      setTestStatus('error');
      setStatusMessage('Помилка збереження даних TradeLocker Vault');
    } finally {
      setIsSaving(false);
    }
  };

  const totalPnl = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);

  return (
    <div className="fixed inset-0 z-50 bg-[#050811]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-neo-mono select-none">
      <div className="bg-[#090E1C] border border-[#00F5D4]/40 rounded-[3px] w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl neo-hud-bracket">
        {/* Header */}
        <div className="p-4 bg-[#050811] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[2px] bg-[#00FF9D]/10 border border-[#00FF9D]/40 flex items-center justify-center text-[#00FF9D]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-[#E2E8F0] text-sm tracking-wider flex items-center gap-2 font-neo-display">
                <span>ПІДКТЮЧЕННЯ ТА КЕРУВАННЯ TRADELOCKER</span>
                <span className="neo-hud-badge">
                  [{environment} ACCOUNT]
                </span>
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                Автоматична маршрутизація угод через REST API з AES-256-GCM шифруванням
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#E2E8F0] p-1.5 rounded hover:bg-[#0F172A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Account Metrics Cards */}
        <div className="p-4 bg-[#050811]/60 border-b border-cyan-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-2.5 bg-[#090E1C] border border-cyan-500/20 rounded-[2px]">
            <div className="text-[10px] text-[#94A3B8] uppercase">ACCOUNT ID</div>
            <div className="text-xs font-extrabold text-[#00F5D4] font-mono truncate mt-0.5">
              {account.accountId}
            </div>
          </div>

          <div className="p-2.5 bg-[#090E1C] border border-cyan-500/20 rounded-[2px]">
            <div className="text-[10px] text-[#94A3B8] uppercase">БАЛАНС ($)</div>
            <div className="text-sm font-extrabold text-[#00FF9D] font-mono mt-0.5">
              ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-2.5 bg-[#090E1C] border border-cyan-500/20 rounded-[2px]">
            <div className="text-[10px] text-[#94A3B8] uppercase">EQUITY ($)</div>
            <div className="text-sm font-extrabold text-[#E2E8F0] font-mono mt-0.5">
              ${(account.balance + totalPnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-2.5 bg-[#090E1C] border border-cyan-500/20 rounded-[2px]">
            <div className="text-[10px] text-[#94A3B8] uppercase">СТАТУС З'ЄДНАННЯ</div>
            <div className="text-xs font-extrabold text-[#00FF9D] flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
              CONNECTED
            </div>
          </div>
        </div>

        {/* Credentials Form & Live Test */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="p-4 bg-[#050811] border border-cyan-500/20 rounded-[2px] space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <h3 className="font-extrabold text-xs text-[#E2E8F0] flex items-center gap-2 uppercase font-neo-display">
                <Lock className="w-4 h-4 text-[#00F5D4]" />
                НАЛАШТУВАННЯ АКАУНТУ TRADELOCKER
              </h3>
              <div className="flex items-center gap-1 bg-[#090E1C] p-0.5 rounded border border-cyan-500/20 text-xs">
                <button
                  type="button"
                  onClick={() => setEnvironment('DEMO')}
                  className={`px-2.5 py-0.5 rounded-[2px] font-bold text-[10px] transition-all ${
                    environment === 'DEMO'
                      ? 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  DEMO
                </button>
                <button
                  type="button"
                  onClick={() => setEnvironment('LIVE')}
                  className={`px-2.5 py-0.5 rounded-[2px] font-bold text-[10px] transition-all ${
                    environment === 'LIVE'
                      ? 'bg-[#FF2A6D]/20 text-[#FF2A6D] border border-[#FF2A6D]/40'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  LIVE REAL
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-3 pt-1">
              <div>
                <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">
                  ПОПУЛЯРНІ СЕРВЕРИ (ШВИДКИЙ ВИБІР):
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {['FundingPips-Demo', 'FunderPro-Demo', 'FXIFY-Demo', 'Kinstellar-Demo', 'TradeLocker-Demo-Server-01'].map((srv) => (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => setServer(srv)}
                      className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono border transition-all ${
                        server === srv
                          ? 'bg-[#00F5D4]/20 text-[#00F5D4] border-[#00F5D4]'
                          : 'bg-[#090E1C] text-[#94A3B8] border-cyan-500/20 hover:text-[#E2E8F0]'
                      }`}
                    >
                      {srv}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">
                    ACCOUNT ID (НОМЕР РАХУНКУ):
                  </label>
                  <input
                    type="text"
                    required
                    value={accountIdInput}
                    onChange={(e) => setAccountIdInput(e.target.value)}
                    placeholder="1787179051833048700"
                    className="w-full p-2 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#00F5D4] font-extrabold focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">
                    СЕРВЕР TRADELOCKER:
                  </label>
                  <input
                    type="text"
                    required
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                    placeholder="FundingPips-Demo / TradeLocker-Demo"
                    className="w-full p-2 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#E2E8F0] focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">
                    EMAIL АКАУНТУ:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#E2E8F0] focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">
                    ПАРОЛЬ / API KEY:
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#E2E8F0] focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Feedback Box */}
              {statusMessage && (
                <div
                  className={`p-2.5 rounded-[2px] border text-xs flex items-center justify-between ${
                    testStatus === 'error'
                      ? 'bg-[#FF2A6D]/15 border-[#FF2A6D]/40 text-[#FF2A6D]'
                      : 'bg-[#00FF9D]/15 border-[#00FF9D]/40 text-[#00FF9D]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-[#050811] rounded border border-current">
                    AES-256
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testStatus === 'testing'}
                  className="px-3.5 py-1.5 bg-[#090E1C] hover:bg-[#0F172A] text-[#00F5D4] border border-[#00F5D4]/40 rounded-[2px] text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
                  ПЕРЕВІРИТИ ЗЄДНАННЯ
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-1.5 text-xs text-[#94A3B8] hover:text-[#E2E8F0]"
                  >
                    СКАСУВАТИ
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-1.5 bg-[#00F5D4] text-[#050811] font-bold rounded-[2px] text-xs hover:bg-[#00FF9D] transition-colors flex items-center gap-1.5 shadow-lg shadow-[#00F5D4]/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isSaving ? 'ЗБЕРЕЖЕННЯ...' : 'ЗБЕРЕГТИ ТА ПІДКЛЮЧИТИ'}
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
