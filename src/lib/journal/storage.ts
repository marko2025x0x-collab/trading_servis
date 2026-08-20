'use client';

import { JournalTrade } from '@/types/journal';

const STORAGE_KEY = 'nexus_quant_trader_journal_v2';

export function loadJournalTrades(): JournalTrade[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as JournalTrade[]) : [];
  } catch {
    return [];
  }
}

export function saveJournalTrades(trades: JournalTrade[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

/** Appends a trade (e.g. auto-logged from a real signal execution) and persists it. */
export function appendJournalTrade(trade: JournalTrade): JournalTrade[] {
  const current = loadJournalTrades();
  const updated = [trade, ...current];
  saveJournalTrades(updated);
  return updated;
}
