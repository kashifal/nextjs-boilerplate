'use client'
import { useState, useEffect } from 'react';
import { calculateTotalProfit, generateDailyProfits } from '@/utils/profitCalculations';

export function useAdminStats() {
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalBalanceUSDT: 0,
    totalStakedUSDT: 0,
    totalProfitUSDT: 0,
    userStats: [],
    coinStats: {},
    isLoading: true,
    error: null
  });

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch all required data
      const [usersRes, topupsRes, stakesRes, coinsRes] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/topup'),
        fetch('/api/staking'),
        fetch('/api/coin')
      ]);

      // Check if staking response failed
      if (!stakesRes.ok) {
        console.error('Staking API error:', await stakesRes.text());
        // Continue with zero values for staking-related stats
        const [usersData, topupsData, coinsData] = await Promise.all([
          usersRes.json(),
          topupsRes.json(),
          coinsRes.json()
        ]);

        const regularUsers = usersData.users.filter(user => user.role !== 'admin');
        const approvedTopups = topupsData.topups.filter(t => t.status === 'APPROVED');
        const totalBalance = approvedTopups.reduce((sum, topup) => 
          sum + (parseFloat(topup.amount) || 0), 0);

        setAdminStats({
          totalUsers: regularUsers.length,
          totalBalanceUSDT: totalBalance,
          totalStakedUSDT: 0, // Default to 0 when staking data is unavailable
          totalProfitUSDT: 0, // Default to 0 when staking data is unavailable
          userStats: regularUsers,
          coinStats: coinsData.coins || {},
          isLoading: false,
          error: null
        });
        return;
      }

      // Fetch and log each response separately for debugging
      const usersData = await usersRes.json();
      console.log('Users Data:', usersData);

      const topupsData = await topupsRes.json();
      console.log('Topups Data:', topupsData);

      const stakesData = await stakesRes.json();
      console.log('Stakes Data:', stakesData);

      const coinsData = await coinsRes.json();
      console.log('Coins Data:', coinsData);

      // Filter out admin users
      const regularUsers = usersData.users.filter(user => user.role !== 'admin');

      // Calculate total balance from topups
      const approvedTopups = topupsData.topups ? topupsData.topups.filter(t => t.status === 'APPROVED') : [];
      const totalBalance = approvedTopups.reduce((sum, topup) => {
        return sum + (parseFloat(topup.amount) || 0);
      }, 0);

      // Calculate total staked
      const activeStakes = stakesData.stakes ? stakesData.stakes.filter(s => s.status === 'ACTIVE') : [];
      const totalStaked = activeStakes.reduce((sum, stake) => {
        return sum + (parseFloat(stake.amount) || 0);
      }, 0);

      // Calculate total profit
      let totalProfit = activeStakes.reduce((sum, stake) => {
        const startDate = new Date(stake.startDate);
        const currentDate = new Date();
        const daysElapsed = Math.max(0, Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)));
        
        if (daysElapsed > 0 && stake.amount && stake.apy) {
          const dailyProfits = generateDailyProfits(
            parseFloat(stake.amount),
            parseFloat(stake.apy),
            parseInt(stake.duration) || 30
          );
          return sum + calculateTotalProfit(dailyProfits, daysElapsed);
        }
        return sum;
      }, 0);

      // Log final calculations
      console.log('Final Calculations:', {
        users: regularUsers.length,
        balance: totalBalance,
        staked: totalStaked,
        profit: totalProfit
      });

      setAdminStats({
        totalUsers: regularUsers.length,
        totalBalanceUSDT: totalBalance,
        totalStakedUSDT: totalStaked,
        totalProfitUSDT: totalProfit,
        userStats: regularUsers,
        coinStats: coinsData.coins || {},
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error in fetchAdminStats:', error);
      setAdminStats(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch admin statistics'
      }));
    }
  };

  return adminStats;
} 