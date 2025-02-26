import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import Topup from '@/models/topup';
import Staking from '@/models/staking';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    // Connect to database using mongoose
    await connectDB();

    // Get current date
    const currentDate = new Date();
    console.log('Current date:', currentDate);

    // Find completed stakings
    const completedStakings = await Staking.find({
      user: userId,
      status: 'ACTIVE',
      endDate: { $lte: currentDate }
    }).populate('coin');

    console.log('Found completed stakings:', completedStakings.length);

    for (const staking of completedStakings) {
      try {
        const totalProfit = staking.dailyProfits.reduce((sum, daily) => sum + daily.profit, 0);
        console.log('Processing staking:', {
          id: staking._id,
          totalProfit,
          stakingAmount: staking.amount,
          totalAmount: totalProfit + staking.amount
        });

        // Create new topup for the staking amount + profit
        const newTopup = new Topup({
          user: userId,
          amount: totalProfit + staking.amount, // Add both profit and staking amount
          coin: staking.coin._id,
          status: 'APPROVED'
        });

        await newTopup.save();
        console.log('Created topup:', newTopup._id);

        // Mark staking as completed
        await Staking.findByIdAndUpdate(staking._id, {
          status: 'COMPLETED',
          totalProfit: totalProfit // Store the total profit for reference
        });

        console.log('Marked staking as completed:', staking._id);
      } catch (error) {
        console.error('Error processing staking:', staking._id, error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${completedStakings.length} completed stakings`
    });

  } catch (error) {
    console.error('Error processing completed stakings:', error);
    return NextResponse.json(
      { error: 'Failed to process completed stakings' }, 
      { status: 500 }
    );
  }
} 