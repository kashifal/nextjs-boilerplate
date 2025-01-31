'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useUserStats(userId) {
  const [userStats, setUserStats] = useState({
    stakes: [],
    topups: [],
    balances: {}, // Balance per coin
    totalBalanceUSDT: 0,
    totalStakedUSDT: 0,
    isLoading: true,
    error: null
  });

  const fetchUserStats = async () => {
    try {
      // First fetch all available coins
      const coinsResponse = await fetch('/api/coin');
      if (!coinsResponse.ok) {
        throw new Error(`Coins API error: ${coinsResponse.status}`);
      }
      const coinsData = await coinsResponse.json();
      
      // Initialize balances for all coins with 0
      const coinBalances = {};
      coinsData.coins.forEach(coin => {
        coinBalances[coin.name] = 0;
      });

      // Fetch user's topups and stakes
      const stakesResponse = await fetch(`/api/staking?userId=${userId}`);
      const topupsResponse = await fetch(`/api/topup?userId=${userId}`);
      
      if (!stakesResponse.ok || !topupsResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const stakesData = await stakesResponse.json();
      const topupsData = await topupsResponse.json();

      // Process approved topups
      topupsData.topups.forEach(topup => {
        if (topup.status === 'APPROVED') {
          const coinName = coinsData.coins.find(c => c._id === topup.coin)?.name;
          if (coinName) {
            coinBalances[coinName] = (coinBalances[coinName] || 0) + topup.amount;
          }
        }
      });

      // Subtract staked amounts
      stakesData.stakes.forEach(stake => {
        if (stake.status === 'ACTIVE') {
          const coinName = stake.coin.name;
          if (coinName) {
            coinBalances[coinName] = (coinBalances[coinName] || 0) - stake.amount;
          }
        }
      });

      setUserStats({
        stakes: stakesData.stakes,
        topups: topupsData.topups,
        balances: coinBalances,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching user stats:', error);
      setUserStats(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch user statistics'
      }));
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserStats();
      const interval = setInterval(fetchUserStats, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [userId]);

  return userStats;
} 