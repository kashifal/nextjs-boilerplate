import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staking from '@/models/staking';
import Topup from '@/models/topup';

export async function POST() {
  try {
    await connectDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active stakings
    const activeStakings = await Staking.find({
      status: 'ACTIVE',
      endDate: { $gte: today }
    });

    for (const staking of activeStakings) {
      // Calculate random daily profit within APY range
      const dailyApyRange = staking.apy / 365;
      const randomMultiplier = Math.random(); // 0 to 1
      const dailyProfit = (staking.amount * dailyApyRange * randomMultiplier) / 100;

      // Add daily profit to staking record
      staking.dailyProfits.push({
        date: today,
        profit: dailyProfit
      });

      // Check if staking period is complete
      if (today >= staking.endDate) {
        // Calculate total profit
        const totalProfit = staking.dailyProfits.reduce((sum, dp) => sum + dp.profit, 0);
        
        // Create new topup with the total profit amount
        await Topup.create({
          user: staking.user,
          amount: totalProfit,
          coin: staking.coin,
          status: 'APPROVED'
        });

        // Delete the completed staking
        await Staking.findByIdAndDelete(staking._id);
      } else {
        await staking.save();
      }
    }

    return NextResponse.json({ 
      message: 'Daily profits calculated successfully' 
    });

  } catch (error) {
    console.error('Error calculating profits:', error);
    return NextResponse.json(
      { error: 'Failed to calculate profits' },
      { status: 500 }
    );
  }
} 