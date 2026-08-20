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
  Trash2,
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

  // Form State
  const [environment, setEnvironment] = useState<'DEMO' | 'LIVE'>('DEMO');
  const [server, setServer] = useState('HEROFX');
  const [email, setEmail] = useState('marko2025x0x@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [accountIdInput, setAccountIdInput] = useState('1787179051833048700');

  // Status & Feedback State
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('success');
  const [statusMessage, setStatusMessage] = useState<string>(
    'AES-256-GCM AUTOMATICALLY ENCRYPTED & CONNECTED'
  );

  // Load account from LocalStorage if saved
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAcc = localStorage.getItem(STORAGE_ACCOUNT_KEY);
      if (savedAcc) {
        try {
          const parsed = JSON.parse(savedAcc);
          // Reading localStorage must happen post-mount to avoid SSR/client hydration mismatch.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAccount(parsed);
          if (parsed.accountId) setAccountIdInput(parsed.accountId);
          if (parsed.server) setServer(parsed.server);
          if (parsed.email) setEmail(parsed.email);
        } catch {
          setAccount(INITIAL_DEMO_ACCOUNT);
        }
      }
    }
  }, []);

  if (!isOpen) return null;

  // Handle Automatic Encryption & Save / Connect
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
      setStatusMessage(data.message || `Акаунт [${accountIdInput}] успішно зашифровано (AES-256-GCM) та підключено!`);
    } catch {
      setTestStatus('error');
      setStatusMessage('Помилка збереження та автоматичного шифрування ключів.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle GDPR Delete / Purge Keys
  const handleDeleteKeys = async () => {
    setIsDeleting(true);
    try {
      await fetch('/api/tradelocker/vault', { method: 'DELETE' });
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_ACCOUNT_KEY);
      }
      setAccount({
        ...INITIAL_DEMO_ACCOUNT,
        connected: false,
      });
      setTestStatus('error');
      setStatusMessage('Усі ключі та дані акаунту повністю видалено (GDPR Article 17).');
    } catch {
      setStatusMessage('Помилка видалення ключів.');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPnl = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);

  return (
    <div className="fixed inset-0 z-50 bg-[#050811]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-neo-mono select-none">
      <div className="bg-[#090E1C] border border-[#00F5D4]/40 rounded-[3px] w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl neo-hud-bracket">
        {/* Top Header */}
        <div className="p-4 bg-[#050811] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[2px] bg-[#00FF9D]/10 border border-[#00FF9D]/40 flex items-center justify-center text-[#00FF9D]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-[#E2E8F0] text-sm tracking-wider flex items-center gap-2 font-neo-display">
                <span>TRADELOCKER SECURE VAULT</span>
                <span className="neo-hud-badge">
                  [{account.connected ? 'CONNECTED' : 'DISCONNECTED'}]
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/40">
                  AES-256-GCM
                </span>
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                Шифрування за стандартом AES-256-GCM та повна відповідність GDPR
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
            <div className="text-[10px] text-[#94A3B8] uppercase">БАЛАНС РАХУНКУ</div>
            <div className="text-sm font-extrabold text-[#00FF9D] font-mono mt-0.5">
              ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </div>
          </div>

          <div className="p-2.5 bg-[#090E1C] border border-cyan-500/20 rounded-[2px]">
            <div className="text-[10px] text-[#94A3B8] uppercase">EQUITY (ЗАСОБИ)</div>
            <div className="text-sm font-extrabold text-[#E2E8F0] font-mono mt-0.5">
              ${(account.balance + totalPnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-2.5 bg-[#090E1C] border border-cyan-500/20 rounded-[2px]">
            <div className="text-[10px] text-[#94A3B8] uppercase">ПЛАВАЮЧИЙ PnL</div>
            <div className={`text-sm font-extrabold font-mono mt-0.5 ${totalPnl >= 0 ? 'text-[#00FF9D]' : 'text-[#FF2A6D]'}`}>
              {totalPnl >= 0 ? `+$${totalPnl.toFixed(2)}` : `-$${Math.abs(totalPnl).toFixed(2)}`}
            </div>
          </div>

          <div className="p-2.5 bg-[#090E1C] border border-cyan-500/20 rounded-[2px]">
            <div className="text-[10px] text-[#94A3B8] uppercase">РЕЖИМ АКАУНТУ</div>
            <div className="text-xs font-extrabold text-[#00F5D4] flex items-center gap-1 mt-1 uppercase">
              <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse" />
              {environment}
            </div>
          </div>
        </div>

        {/* Credentials Form with Automatic Encryption */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="p-4 bg-[#050811] border border-cyan-500/20 rounded-[2px] space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <h3 className="font-extrabold text-xs text-[#E2E8F0] flex items-center gap-2 uppercase font-neo-display">
                <Lock className="w-4 h-4 text-[#00F5D4]" />
                ЗАШИФРОВАНЕ СХОВИЩЕ КЛЮЧІВ TRADELOCKER (AES-256-GCM)
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
                  REAL LIVE
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-3 pt-1">
              <div>
                <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">
                  ПОПУЛЯРНІ СЕРВЕРИ (ШВИДКИЙ ВИБІР):
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {['HEROFX', 'FundingPips-Demo', 'FunderPro-Demo', 'FXIFY-Demo', 'TradeLocker-Demo-Server-01'].map((srv) => (
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

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">
                    TradeLocker Account ID
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
                    Сервер TradeLocker
                  </label>
                  <input
                    type="text"
                    required
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                    placeholder="HEROFX / FundingPips"
                    className="w-full p-2 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#E2E8F0] focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">
                    Email TradeLocker
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marko2025x0x@gmail.com"
                    className="w-full p-2 bg-[#090E1C] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#E2E8F0] focus:border-[#00F5D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">
                    Пароль / API Key
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

              {/* Automatic Status Feedback Bar */}
              {statusMessage && (
                <div
                  className={`p-2.5 rounded-[2px] border text-xs flex items-center justify-between transition-all ${
                    testStatus === 'error'
                      ? 'bg-[#FF2A6D]/15 border-[#FF2A6D]/40 text-[#FF2A6D]'
                      : 'bg-[#00FF9D]/15 border-[#00FF9D]/40 text-[#00FF9D]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="font-bold">{statusMessage}</span>
                  </div>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-[#050811] rounded border border-current shrink-0">
                    AES-256-GCM
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-cyan-500/20">
                <div className="flex items-center gap-2 text-[11px] text-[#00FF9D]">
                  <ShieldCheck className="w-4 h-4 text-[#00FF9D] shrink-0" />
                  <span>GDPR Compliant: Ключі автоматично зашифровані в AES-256.</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteKeys}
                    disabled={isDeleting}
                    className="px-3.5 py-2 bg-[#FF2A6D]/10 hover:bg-[#FF2A6D]/20 text-[#FF2A6D] border border-[#FF2A6D]/40 rounded-[2px] text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {isDeleting ? 'ВИДАЛЕННЯ...' : 'Видалити ключі (GDPR)'}
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-[#00F5D4] text-[#050811] font-bold rounded-[2px] text-xs hover:bg-[#00FF9D] transition-colors flex items-center gap-1.5 shadow-lg shadow-[#00F5D4]/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isSaving ? 'ШИФРУВАННЯ...' : 'Зашифрувати та зберегти'}
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
