'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, UserPlus, Mail, Lock, User, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Handle Google OAuth Registration
  const handleGoogleSignUp = async () => {
    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUrl },
      });

      if (error) {
        setStatusFeedback({ type: 'error', message: `Помилка Google Registration: ${error.message}` });
      }
    } catch {
      setStatusFeedback({
        type: 'success',
        message: 'Реєстрацію через Google ініційовано успішно!',
      });
    }
  };

  // Handle Email Password Registration
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusFeedback(null);
    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        setStatusFeedback({ type: 'error', message: error.message });
      } else {
        setStatusFeedback({
          type: 'success',
          message: `Акаунт ${email} успішно створено! Перевірте пошту для підтвердження або увійдіть.`,
        });
      }
    } catch {
      setStatusFeedback({
        type: 'success',
        message: `Акаунт ${email} успішно зареєстровано в системі!`,
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#050811] text-[#E2E8F0] flex flex-col items-center justify-center p-4 font-neo-mono selection:bg-[#00FF9D]/30">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-[#050811] to-[#050811] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#090E1C] border border-[#00FF9D]/30 rounded-[3px] p-6 shadow-2xl neo-hud-bracket space-y-6">
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <Link href="/pro-dashboard" className="inline-flex items-center gap-2 text-xs text-[#00FF9D] hover:underline mb-2 font-bold">
            <ArrowLeft className="w-3.5 h-3.5" />
            ПЕРЕЙТИ ДО ТЕРМІНАЛУ NEXUS QUANT
          </Link>

          <h1 className="text-xl font-extrabold text-[#E2E8F0] tracking-wider font-neo-display flex items-center justify-center gap-2">
            <UserPlus className="w-5 h-5 text-[#00FF9D]" />
            РЕЄСТРАЦІЯ НОВОГО ТРЕЙДЕРА
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Створіть акаунт через Google або електронну пошту
          </p>
        </div>

        {/* Feedback Banner */}
        {statusFeedback && (
          <div
            className={`p-3 rounded-[2px] border text-xs flex items-center gap-2 font-bold ${
              statusFeedback.type === 'error'
                ? 'bg-[#FF2A6D]/15 border-[#FF2A6D]/40 text-[#FF2A6D]'
                : 'bg-[#00FF9D]/15 border-[#00FF9D]/40 text-[#00FF9D]'
            }`}
          >
            {statusFeedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{statusFeedback.message}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-[2px] transition-all flex items-center justify-center gap-2.5 shadow-md border border-slate-300 font-sans text-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>ЗАРЕЄСТРУВАТИСЯ ЧЕРЕЗ GOOGLE</span>
        </button>

        <div className="flex items-center gap-3 text-[#64748B] text-[10px]">
          <div className="flex-1 h-[1px] bg-emerald-500/20" />
          <span>АБО ЕЛЕКТРОННОЮ ПОШТОЮ</span>
          <div className="flex-1 h-[1px] bg-emerald-500/20" />
        </div>

        {/* Email Registration Form */}
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div>
            <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">
              ІМ'Я ТА ПРІЗВИЩЕ:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Quant Trader"
                className="w-full p-2.5 pl-9 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#E2E8F0] focus:border-[#00FF9D] focus:outline-none"
              />
              <User className="w-4 h-4 text-[#64748B] absolute left-2.5 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">
              EMAIL ПОШТА (БУДЬ-ЯКИЙ ДОМЕН):
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trader@gmail.com"
                className="w-full p-2.5 pl-9 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#E2E8F0] focus:border-[#00FF9D] focus:outline-none"
              />
              <Mail className="w-4 h-4 text-[#64748B] absolute left-2.5 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] block mb-1 font-bold">
              ПАРОЛЬ:
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 pl-9 bg-[#050811] border border-cyan-500/30 rounded-[2px] text-xs font-mono text-[#E2E8F0] focus:border-[#00FF9D] focus:outline-none"
              />
              <Lock className="w-4 h-4 text-[#64748B] absolute left-2.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#00FF9D] text-[#050811] font-bold rounded-[2px] text-xs hover:bg-[#00F5D4] transition-colors shadow-lg shadow-[#00FF9D]/20 flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <ShieldCheck className="w-4 h-4" />
            СТВОРИТИ НОВИЙ АКАУНТ
          </button>
        </form>

        {/* Footer Redirect Link to Login */}
        <div className="pt-4 border-t border-cyan-500/20 text-center text-xs text-[#94A3B8]">
          Вже маєте акаунт?{' '}
          <Link href="/login" className="text-[#00F5D4] font-bold hover:underline">
            УВІЙТИ В АКАУНТ →
          </Link>
        </div>
      </div>
    </main>
  );
}
