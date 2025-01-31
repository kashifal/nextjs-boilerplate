import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staking from '@/models/staking';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get all stakings for the user with populated coin data
    const stakings = await Staking.find({ 
      user: userId,
      status: 'ACTIVE' 
    }).populate('coin');

    // Group stakings by coin with null checks
    const stakingSummary = stakings.reduce((acc, stake) => {
      if (stake.coin && stake.coin.name) {
        const coinName = stake.coin.name;
        if (!acc[coinName]) {
          acc[coinName] = {
            coin_name: coinName,
            total_staked: 0,
            total_profit: 0,
            count: 0
          };
        }
        acc[coinName].total_staked += parseFloat(stake.amount) || 0;
        acc[coinName].total_profit += parseFloat(stake.totalProfit) || 0;
        acc[coinName].count += 1;
      }
      return acc;
    }, {});

    // Convert to array format
    const summaryArray = Object.values(stakingSummary);

    // Calculate totals
    const totalStaked = summaryArray.reduce((sum, item) => sum + item.total_staked, 0);
    const totalProfit = summaryArray.reduce((sum, item) => sum + item.total_profit, 0);

    console.log('Staking Summary:', {
      stakings: summaryArray,
      totalStaked,
      totalProfit
    });

    return NextResponse.json({
      success: true,
      stakings: summaryArray,
      totalStaked,
      totalProfit,
      activeStakingsCount: stakings.length
    });

  } catch (error) {
    console.error('Error fetching staking summary:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to fetch staking summary',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 