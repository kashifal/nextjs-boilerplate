'use client'

import React, { useEffect, useState } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import Usdt from '@/components/Usdt'
import MainLayout from '@/components/layout/MainLayout'
import StakingAssets from '@/components/StakingAssets'

const Admin = () => {
  // This will automatically redirect non-admin users
  useAdminAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStakedUSDT: 0,
    totalProfitUSDT: 0,
    userStakings: [],
    coinStakings: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch admin statistics');
      }
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAdminStats();

    // Set up interval for periodic fetching
    const intervalId = setInterval(fetchAdminStats, 2000); // 2000ms = 2 seconds

    // Cleanup function to clear interval when component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  if (error) {
    return (
      <div className='bg-[#F0F1F1]'>
        <MainLayout>
          <div className="text-red-500 p-4">Error: {error}</div>
        </MainLayout>
      </div>
    );
  }

  return (
    <div className='bg-[#F0F1F1]'>
      <MainLayout>
        {/* <div className="grid grid-cols-1  p-8 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Staked</h3>
            <p className="text-2xl font-bold">${stats.totalStakedUSDT.toFixed(2)} USDT</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Profit</h3>
            <p className="text-2xl font-bold">${stats.totalProfitUSDT.toFixed(2)} USDT</p>
          </div>
        </div>

       <div className="p-8">
       <div className="bg-white    rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Staking Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.coinStakings.map((coin) => (
                <div key={coin.coinName} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{coin.coinName}</h3>
                  <div className="space-y-1">
                    <p>Total Staked: {coin.totalStaked.toFixed(4)} {coin.symbol}</p>
                    <p>Value: ${coin.totalStakedUSDT.toFixed(2)} USDT</p>
                    <p>Stakes: {coin.numberOfStakes}</p>
                    <p>Profit: ${coin.totalProfitUSDT.toFixed(2)} USDT</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white    rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">User Stakings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Total Staked (USDT)</th>
                    <th className="text-left p-4">Total Profit (USDT)</th>
                    <th className="text-left p-4">Stakes</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.userStakings.map((userStaking) => (
                    <React.Fragment key={userStaking.user._id}>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-4">{userStaking.user.email || userStaking.user.username}</td>
                        <td className="p-4">${userStaking.totalStaked.toFixed(2)}</td>
                        <td className="p-4">${userStaking.totalProfit.toFixed(2)}</td>
                        <td className="p-4">{userStaking.stakings.length}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {userStaking.stakingsByCoin.map((coin) => (
                              <div key={coin.coinName} className="text-sm">
                                <p className="font-medium">{coin.coinName}</p>
                                <p>{coin.totalStaked.toFixed(4)} {coin.symbol}</p>
                                <p>${coin.totalStakedUSDT.toFixed(2)} USDT</p>
                                <p>{coin.numberOfStakes} stakes</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white   rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">All Stakings History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Coin</th>
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Value (USDT)</th>
                    <th className="text-left p-4">APY</th>
                    <th className="text-left p-4">Start Date</th>
                    <th className="text-left p-4">End Date</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Profit (USDT)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.userStakings.map((userStaking) => (
                    userStaking.stakings.map((stake, index) => (
                      <tr key={`${userStaking.user._id}-${index}`} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          {userStaking.user.email || userStaking.user.username}
                        </td>
                        <td className="p-4">
                          {stake.coinName} ({stake.symbol})
                        </td>
                        <td className="p-4">
                          {stake.amount.toFixed(4)} {stake.symbol}
                        </td>
                        <td className="p-4">
                          ${stake.stakedUSDT.toFixed(2)}
                        </td>
                        <td className="p-4">
                          {stake.apy}%
                        </td>
                        <td className="p-4">
                          {new Date(stake.startDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          {new Date(stake.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            stake.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800'
                              : stake.status === 'COMPLETED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {stake.status}
                          </span>
                        </td>
                        <td className="p-4">
                          ${stake.profitUSDT.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
       </div> */}

        <Usdt stats={stats} />
        <StakingAssets stats={stats} />
      </MainLayout>
    </div>
  )
}

export default Admin