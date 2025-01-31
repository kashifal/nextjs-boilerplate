import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staking from '@/models/staking';
import User from '@/models/user';
import axios from 'axios';

export async function GET() {
  try {
    await connectDB();

    // Get all users count
    const totalUsers = await User.countDocuments();
    
    // Get all stakings with populated coin data
    const stakings = await Staking.find()
      .populate('coin')
      .populate('user', 'email username')
      .lean();

    let totalStakedUSDT = 0;
    let totalProfitUSDT = 0;
    const stakingsByUser = {};
    const stakingsByCoin = {};

    // Process each staking
    for (const staking of stakings) {
      try {
        const coinName = staking.coin.name;
        const coinSymbol = staking.coin.symbol;
        
        // Get USDT rate for the coin
        const response = await axios({
          method: 'get',
          url: `https://rest.coinapi.io/v1/exchangerate/${coinName}/USDT`,
          headers: {
            'Accept': 'text/plain',
            'X-CoinAPI-Key': 'dacbfd0e-b96f-4b95-9e52-1a18439ceff0'
          }
        });

        const usdtRate = response.data.rate;
        const stakedUSDT = staking.amount * usdtRate;
        const totalProfit = (staking.dailyProfits || []).reduce((sum, dp) => sum + dp.profit, 0);
        const profitUSDT = totalProfit * usdtRate;

        totalStakedUSDT += stakedUSDT;
        totalProfitUSDT += profitUSDT;

        // Group by coin
        if (!stakingsByCoin[coinName]) {
          stakingsByCoin[coinName] = {
            coinName,
            symbol: coinSymbol,
            totalStaked: 0,
            totalStakedUSDT: 0,
            totalProfit: 0,
            totalProfitUSDT: 0,
            numberOfStakes: 0
          };
        }
        stakingsByCoin[coinName].totalStaked += staking.amount;
        stakingsByCoin[coinName].totalStakedUSDT += stakedUSDT;
        stakingsByCoin[coinName].totalProfit += totalProfit;
        stakingsByCoin[coinName].totalProfitUSDT += profitUSDT;
        stakingsByCoin[coinName].numberOfStakes += 1;

        // Group by user
        const userId = staking.user._id.toString();
        if (!stakingsByUser[userId]) {
          stakingsByUser[userId] = {
            user: staking.user,
            totalStaked: 0,
            totalProfit: 0,
            stakingsByCoin: {},
            stakings: []
          };
        }

        // Add to user's coin-specific totals
        if (!stakingsByUser[userId].stakingsByCoin[coinName]) {
          stakingsByUser[userId].stakingsByCoin[coinName] = {
            coinName,
            symbol: coinSymbol,
            totalStaked: 0,
            totalStakedUSDT: 0,
            numberOfStakes: 0
          };
        }

        stakingsByUser[userId].stakingsByCoin[coinName].totalStaked += staking.amount;
        stakingsByUser[userId].stakingsByCoin[coinName].totalStakedUSDT += stakedUSDT;
        stakingsByUser[userId].stakingsByCoin[coinName].numberOfStakes += 1;

        stakingsByUser[userId].totalStaked += stakedUSDT;
        stakingsByUser[userId].totalProfit += profitUSDT;
        stakingsByUser[userId].stakings.push({
          coinName,
          symbol: coinSymbol,
          amount: staking.amount,
          stakedUSDT,
          profitUSDT,
          status: staking.status,
          startDate: staking.startDate
        });
      } catch (error) {
        console.error('Error processing staking:', error);
      }
    }

    // Convert to arrays and sort
    const userStakings = Object.values(stakingsByUser)
      .sort((a, b) => b.totalStaked - a.totalStaked)
      .map(user => ({
        ...user,
        stakingsByCoin: Object.values(user.stakingsByCoin)
      }));

    const coinStakings = Object.values(stakingsByCoin)
      .sort((a, b) => b.totalStakedUSDT - a.totalStakedUSDT);

    return NextResponse.json({
      totalUsers,
      totalStakedUSDT,
      totalProfitUSDT,
      userStakings,
      coinStakings
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
} 