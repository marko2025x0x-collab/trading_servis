import { TradeLockerExecutionRequest, TradeLockerExecutionResponse } from '@/types';

/**
 * TradeLocker API Client wrapper
 * Interface for authenticating and dispatching order executions to TradeLocker REST API
 */
export class TradeLockerClient {
  private baseUrl: string;
  private apiKey: string;
  private accId: string;

  constructor() {
    this.baseUrl = process.env.TRADELOCKER_API_URL || 'https://demo-api.tradelocker.com/v2';
    this.apiKey = process.env.TRADELOCKER_API_KEY || 'tl_live_demo_key_99381';
    this.accId = process.env.TRADELOCKER_ACCOUNT_ID || 'ACC-883921';
  }

  async executeTrade(request: TradeLockerExecutionRequest): Promise<TradeLockerExecutionResponse> {
    const payload = {
      accountId: request.accountId || this.accId,
      instrument: request.symbol,
      side: request.direction.toLowerCase(), // 'buy' or 'sell'
      type: 'limit',
      price: request.entry,
      stopLoss: request.stopLoss,
      takeProfit: request.takeProfit,
      quantity: request.volume,
      validity: 'GTC',
      comment: 'Antigravity Trading Analytics Signal',
    };

    // If TRADELOCKER_API_KEY is configured in env, attempt real fetch, otherwise return structured success result
    if (process.env.TRADELOCKER_API_KEY) {
      try {
        const response = await fetch(`${this.baseUrl}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          return {
            success: false,
            message: errData.message || `TradeLocker API error status: ${response.status}`,
            timestamp: new Date().toISOString(),
          };
        }

        const data = await response.json();
        return {
          success: true,
          orderId: data.id || `tl-ord-${Date.now()}`,
          executedPrice: data.price || request.entry,
          message: `Order successfully routed to TradeLocker execution bridge.`,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Network error communicating with TradeLocker',
          timestamp: new Date().toISOString(),
        };
      }
    }

    // Demo / Sandbox response mode
    return {
      success: true,
      orderId: `TL-ORDER-${Math.floor(Math.random() * 899999 + 100000)}`,
      executedPrice: request.entry,
      message: `[SANDBOX BRIDGE] ${request.direction} ${request.volume} lot(s) of ${request.symbol} placed at ${request.entry} (SL: ${request.stopLoss}, TP: ${request.takeProfit})`,
      timestamp: new Date().toISOString(),
    };
  }
}
