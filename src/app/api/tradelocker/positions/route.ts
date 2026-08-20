import { NextRequest, NextResponse } from 'next/server';
import { TradeLockerClient } from '@/lib/tradelocker/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId') || undefined;

    const client = new TradeLockerClient();
    const positions = await client.getPositions(accountId);

    const totalFloatingPnl = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);

    return NextResponse.json({
      success: true,
      positions,
      totalFloatingPnl,
      activeCount: positions.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Error fetching TradeLocker positions',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const positionId = searchParams.get('id');

    if (!positionId) {
      return NextResponse.json({ success: false, message: 'Missing positionId' }, { status: 400 });
    }

    const client = new TradeLockerClient();
    const result = await client.closePosition(positionId);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Error closing TradeLocker position',
      },
      { status: 500 }
    );
  }
}
