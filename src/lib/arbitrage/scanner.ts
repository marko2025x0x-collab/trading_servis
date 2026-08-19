import { ArbitrageOpportunity } from '@/types/arbitrage';

export const MOCK_ARBITRAGE_OPPORTUNITIES: ArbitrageOpportunity[] = [
  {
    id: 'arb-01',
    type: 'CEX_DEX',
    asset: 'SOL/USDT',
    buyExchange: 'Uniswap V3 (Arbitrum DEX)',
    sellExchange: 'Binance (CEX)',
    buyPrice: 142.50,
    sellPrice: 145.20,
    spreadPercent: 1.90,
    estGasAndFees: 3.40,
    netProfitUsd: 15.60, // per $1000
    complexity: 'LOW',
    status: 'ACTIVE',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'arb-02',
    type: 'CEX_DEX',
    asset: 'ETH/USDT',
    buyExchange: 'Raydium (Solana DEX)',
    sellExchange: 'Bybit (CEX)',
    buyPrice: 3410.00,
    sellPrice: 3465.00,
    spreadPercent: 1.61,
    estGasAndFees: 4.80,
    netProfitUsd: 11.30,
    complexity: 'LOW',
    status: 'ACTIVE',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'arb-03',
    type: 'CROSS_CEX',
    asset: 'BTC/USDT',
    buyExchange: 'Kraken (CEX)',
    sellExchange: 'MEXC (CEX)',
    buyPrice: 64500.00,
    sellPrice: 65280.00,
    spreadPercent: 1.21,
    estGasAndFees: 2.10,
    netProfitUsd: 10.00,
    complexity: 'LOW',
    status: 'ACTIVE',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'arb-04',
    type: 'FIAT_TRIANGULAR',
    asset: 'EUR ➔ GBP ➔ USD ➔ EUR',
    buyExchange: 'Interactive Brokers (Spot Forex)',
    sellExchange: 'Revolut FX Engine',
    buyPrice: 1.0854,
    sellPrice: 1.0940,
    spreadPercent: 0.79,
    estGasAndFees: 1.50,
    netProfitUsd: 6.40,
    complexity: 'MEDIUM',
    status: 'ACTIVE',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'arb-05',
    type: 'CEX_DEX',
    asset: 'PEPE/USDT',
    buyExchange: 'PancakeSwap V3 (BSC)',
    sellExchange: 'Gate.io (CEX)',
    buyPrice: 0.00000810,
    sellPrice: 0.00000845,
    spreadPercent: 4.32,
    estGasAndFees: 0.60,
    netProfitUsd: 37.20,
    complexity: 'MEDIUM',
    status: 'ACTIVE',
    timestamp: new Date().toISOString(),
  },
];

export function getLiveArbitrageScanner(): ArbitrageOpportunity[] {
  // Simulate small real-time spread fluctuation for live feeling
  return MOCK_ARBITRAGE_OPPORTUNITIES.map((opp) => {
    const jitter = (Math.random() - 0.5) * 0.2;
    const spreadPercent = parseFloat((opp.spreadPercent + jitter).toFixed(2));
    const netProfitUsd = parseFloat((opp.netProfitUsd * (spreadPercent / opp.spreadPercent)).toFixed(2));

    return {
      ...opp,
      spreadPercent,
      netProfitUsd,
      timestamp: new Date().toISOString(),
    };
  });
}
