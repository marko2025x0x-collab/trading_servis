export type ArbitrageType = 'CEX_DEX' | 'CROSS_CEX' | 'FIAT_TRIANGULAR';

export interface ArbitrageOpportunity {
  id: string;
  type: ArbitrageType;
  asset: string; // e.g. SOL/USDT, BTC/USDT, EUR/USD
  buyExchange: string; // e.g. "Uniswap V3 (DEX)", "Binance (CEX)", "Kraken"
  sellExchange: string; // e.g. "Bybit (CEX)", "Raydium (DEX)"
  buyPrice: number;
  sellPrice: number;
  spreadPercent: number;
  estGasAndFees: number; // in USD
  netProfitUsd: number; // per $1,000 capital
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'EXPIRED';
  timestamp: string;
}
