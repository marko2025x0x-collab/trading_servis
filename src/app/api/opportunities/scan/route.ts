import { NextResponse } from 'next/server';
import { scanTopMarketOpportunities } from '@/lib/analytics/opportunityRadar';

export async function GET() {
  try {
    const setups = await scanTopMarketOpportunities();
    return NextResponse.json({ setups });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to scan opportunities', setups: [] },
      { status: 500 }
    );
  }
}
