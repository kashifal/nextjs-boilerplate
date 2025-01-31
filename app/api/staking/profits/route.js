import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staking from '@/models/staking';

export async function POST(request) {
  try {
    await connectDB();
    const { stakingId, dailyProfit, day } = await request.json();

    const staking = await Staking.findById(stakingId);
    if (!staking) {
      return NextResponse.json({ error: 'Staking not found' }, { status: 404 });
    }

    // Add new daily profit
    staking.dailyProfits.push({
      day,
      profit: dailyProfit,
    });

    // Update total profit
    staking.totalProfit = staking.dailyProfits.reduce((sum, daily) => sum + daily.profit, 0);

    await staking.save();

    return NextResponse.json({
      message: 'Daily profit updated successfully',
      staking
    });

  } catch (error) {
    console.error('Error updating daily profit:', error);
    return NextResponse.json(
      { error: 'Failed to update daily profit' },
      { status: 500 }
    );
  }
}

// Get profits for a specific staking
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const stakingId = searchParams.get('stakingId');

    const staking = await Staking.findById(stakingId);
    if (!staking) {
      return NextResponse.json({ error: 'Staking not found' }, { status: 404 });
    }

    return NextResponse.json({
      dailyProfits: staking.dailyProfits,
      totalProfit: staking.totalProfit
    });

  } catch (error) {
    console.error('Error fetching profits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profits' },
      { status: 500 }
    );
  }
} 