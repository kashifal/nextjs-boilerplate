import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staking from '@/models/staking';
import User from '@/models/user';
import Coin from '@/models/coin';
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
    let apiErrorCount = 0;
    const processedCoins = new Map(); // Cache exchange rates

    for (const staking of stakings) {
      try {
        const coinName = staking.coin.name;
        const coinSymbol = staking.coin.symbol;
        const coinLogoUrl = staking.coin.logoUrl;
        
        let usdtRate;
        // Check if we already fetched this coin's rate
        if (processedCoins.has(coinName)) {
          usdtRate = processedCoins.get(coinName);
        } else {
          try {
            // Try SWAP market first
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
            processedCoins.set(coinName, usdtRate);
          } catch (apiError) {
            apiErrorCount++;
            console.error(`Failed to fetch rate for ${coinName}:`, apiError.message);
            usdtRate = 1; // Default fallback
            processedCoins.set(coinName, usdtRate);
          }
        }

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
            logoUrl: coinLogoUrl,
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
            numberOfStakes: 0,
            logoUrl: coinLogoUrl
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
      coinStakings,
      apiStatus: {
        success: apiErrorCount === 0,
        errorCount: apiErrorCount,
        message: apiErrorCount > 0 
          ? `Failed to fetch rates for ${apiErrorCount} coins. Some values may be inaccurate.` 
          : 'All rates fetched successfully'
      }
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
} 