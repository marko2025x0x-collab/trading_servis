import { NextRequest, NextResponse } from 'next/server';
import { TradeLockerClient } from '@/lib/tradelocker/client';
import { TradeLockerExecutionRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TradeLockerExecutionRequest;

    if (!body.symbol || !body.direction || !body.entry || !body.stopLoss || !body.takeProfit) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters (symbol, direction, entry, stopLoss, takeProfit).' },
        { status: 400 }
      );
    }

    const volume = body.volume || 0.10; // Default 0.10 lots

    const client = new TradeLockerClient();
    const result = await client.executeTrade({
      ...body,
      volume,
    });

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal Server Error during TradeLocker execution',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
