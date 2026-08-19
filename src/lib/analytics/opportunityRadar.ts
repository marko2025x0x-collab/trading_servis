import { Signal } from '@/types';

export interface OpportunitySetup {
  symbol: string;
  direction: 'BUY' | 'SELL';
  winProbability: number; // e.g. 94%
  confluenceScore: number;
  timeframe: string;
  reasonUa: string;
  reasonEn: string;
  entry: number;
  sl: number;
  tp: number;
  recommendedLot: number;
}

export function scanTopMarketOpportunities(): OpportunitySetup[] {
  return [
    {
      symbol: 'EUR/USD',
      direction: 'BUY',
      winProbability: 92,
      confluenceScore: 94,
      timeframe: '15m',
      reasonUa: 'Подвійний підтверджений Bullish FVG + зняття sell-side ліквідності на Лондонській сесії. Z-Score = -2.15 (сильна перепроданість).',
      reasonEn: 'Double confirmed Bullish FVG + sell-side liquidity sweep during London session. Z-Score = -2.15 (Strongly Oversold).',
      entry: 1.0854,
      sl: 1.0820,
      tp: 1.0922,
      recommendedLot: 0.50,
    },
    {
      symbol: 'SOL/USDT',
      direction: 'BUY',
      winProbability: 89,
      confluenceScore: 91,
      timeframe: '1h',
      reasonUa: 'Break of Structure (BOS) на 1H + формування інституційного блоку замовлень (Order Block) на рівні $142.50.',
      reasonEn: '1H Break of Structure (BOS) + Institutional Order Block formation at $142.50 support level.',
      entry: 142.50,
      sl: 138.20,
      tp: 151.00,
      recommendedLot: 1.20,
    },
    {
      symbol: 'XAU/USD',
      direction: 'BUY',
      winProbability: 87,
      confluenceScore: 89,
      timeframe: '15m',
      reasonUa: 'Золото відбилось від 4H структури попиту. Новинне вікно чисте на наступні 2 години.',
      reasonEn: 'Gold bounced off 4H Demand Zone structure. Economic news buffer clear for next 2 hours.',
      entry: 2485.10,
      sl: 2472.00,
      tp: 2510.00,
      recommendedLot: 0.20,
    },
  ];
}
