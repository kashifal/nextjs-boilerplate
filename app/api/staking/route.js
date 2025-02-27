import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staking from '@/models/staking';
import Topup from '@/models/topup';
import axios from 'axios';
import Referral from '@/models/referral';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Generate daily profits for the entire duration
    const duration = data.stakingDetails.duration;
    const apy = parseFloat(data.stakingDetails.apy);
    const amount = parseFloat(data.stakingDetails.lockedAmount);
    
    // Calculate daily profit range based on APY
    const maxDailyProfit = (amount * apy) / (365 * 100);
    const dailyProfits = [];
    
    for(let i = 0; i < duration; i++) {
      const date = new Date(data.stakingDetails.startDate);
      date.setDate(date.getDate() + i);
      
      // Random profit between 0 and max daily profit
      const profit = Math.random() * maxDailyProfit;
      
      dailyProfits.push({
        date: date,
        profit: parseFloat(profit.toFixed(8))
      });
    }

    // Create new staking with daily profits
    const staking = await Staking.create({
      user: data.user,
      coin: data.coin.id,
      amount: amount,
      duration: duration,
      apy: apy,
      autoStaking: data.stakingDetails.autoStakingEnabled,
      startDate: data.stakingDetails.startDate,
      endDate: data.stakingDetails.endDate,
      dailyProfits: dailyProfits
    });

    // Update topup amounts (reduce available balance)
    const topups = await Topup.find({
      coin: data.coin.id,
      user: data.user,
      status: 'APPROVED'
    }).sort({ createdAt: 1 });

    let remainingAmount = amount;
    
    for (const topup of topups) {
      if (remainingAmount <= 0) break;
      
      const amountToDeduct = Math.min(topup.amount, remainingAmount);
      topup.amount -= amountToDeduct;
      remainingAmount -= amountToDeduct;
      
      if (topup.amount > 0) {
        await topup.save();
      } else {
        await Topup.findByIdAndDelete(topup._id);
      }
    }

    // const session = await getServerSession(authOptions);

    // Add to your staking endpoint after successful stake
    // 
    const referral = await Referral.findOne({ 
      referred: data.user,
      status: 'PENDING'
    });

    if (referral) {
      const rewardAmount = amount * 0; // 10% reward
      await Referral.updateOne(
        { _id: referral._id },
        { 
          status: 'STAKED',
          stakeAmount: amount,
          reward: rewardAmount
        }
      );
    }

    return NextResponse.json({ 
      message: 'Staking created successfully',
      staking 
    });

  } catch (error) {
    console.error('Error creating staking:', error);
    return NextResponse.json(
      { error: 'Failed to create staking' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('Fetching stakings for userId:', userId);

    const stakings = await Staking.find({ user: userId })
      .populate('coin')
      .lean();

    console.log('Found raw stakings:', stakings);

    if (!stakings || stakings.length === 0) {
      console.log('No stakings found for user');
      return NextResponse.json({
        stakings: [],
        totalStakedUSDT: 0
      });
    }

    let totalStakedUSDT = 0;
    const groupedStakings = {};

    // Process each staking
    for (const staking of stakings) {
      try {
        if (!staking.coin) {
          console.log('Skipping staking due to missing coin:', staking);
          continue;
        }

        const coinName = staking.coin.name;
        console.log('Processing staking for coin:', coinName, staking);

        // Try SWAP market first, then fall back to spot if needed
        let usdtRate;
        try {
          const swapSymbol = `${coinName.toUpperCase()}-USDT-SWAP`;
          const response = await axios({
            method: 'get',
            url: `https://www.okx.com/api/v5/market/ticker?instId=${swapSymbol}`,
          });

          if (response.data.data && response.data.data[0]) {
            usdtRate = parseFloat(response.data.data[0].last);
          } else {
            // Try spot market as fallback
            const spotSymbol = `${coinName.toUpperCase()}-USDT`;
            const spotResponse = await axios({
              method: 'get',
              url: `https://www.okx.com/api/v5/market/ticker?instId=${spotSymbol}`,
            });

            if (spotResponse.data.data && spotResponse.data.data[0]) {
              usdtRate = parseFloat(spotResponse.data.data[0].last);
            } else {
              throw new Error(`No price data found for ${coinName}`);
            }
          }
        } catch (error) {
          console.error(`Error fetching rate for ${coinName}:`, error.message);
          continue;
        }

        const stakedUSDT = staking.amount * usdtRate;
        totalStakedUSDT += stakedUSDT;

        // Initialize group if it doesn't exist
        if (!groupedStakings[coinName]) {
          groupedStakings[coinName] = {
            coinName,
            totalStaked: 0,
            totalStakedUSDT: 0,
            totalProfit: 0,
            totalProfitUSDT: 0,
            stakes: []
          };
        }

        // Calculate total profit for this stake
        const totalProfit = (staking.dailyProfits || []).reduce((sum, dp) => sum + dp.profit, 0);
        const totalProfitUSDT = totalProfit * usdtRate;

        // Update group totals
        groupedStakings[coinName].totalStaked += staking.amount;
        groupedStakings[coinName].totalStakedUSDT += stakedUSDT;
        groupedStakings[coinName].totalProfit += totalProfit;
        groupedStakings[coinName].totalProfitUSDT += totalProfitUSDT;

        // Add stake to group with USDT values
        groupedStakings[coinName].stakes.push({
          _id: staking._id,
          amount: staking.amount,
          duration: staking.duration,
          apy: staking.apy,
          autoStaking: staking.autoStaking,
          startDate: staking.startDate,
          endDate: staking.endDate,
          status: staking.status,
          dailyProfits: staking.dailyProfits || [],
          stakedUSDT: stakedUSDT,
          totalProfit: totalProfit,
          totalProfitUSDT: totalProfitUSDT,
          createdAt: staking.createdAt
        });

        console.log(`Updated group for ${coinName}:`, groupedStakings[coinName]);

      } catch (error) {
        console.error(`Error processing staking:`, error);
        console.error('Problematic staking object:', staking);
      }
    }

    // Convert grouped stakings to array and sort by total staked value
    const stakingArray = Object.values(groupedStakings).sort((a, b) => 
      b.totalStakedUSDT - a.totalStakedUSDT
    );

    console.log('Final response:', {
      stakings: stakingArray,
      totalStakedUSDT
    });

    return NextResponse.json({
      stakings: stakingArray,
      totalStakedUSDT
    });

  } catch (error) {
    console.error('Error in GET /api/staking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stakings', details: error.message },
      { status: 500 }
    );
  }
}