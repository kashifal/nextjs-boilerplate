'use client'

import React, { useEffect, useState } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import Usdt from '@/components/Usdt'
import MainLayout from '@/components/layout/MainLayout'
import StakingAssets from '@/components/StakingAssets'
import WithdrawalList from '@/components/WithdrawalList'

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
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch admin statistics');
      }
      const data = await response.json();
      setStats(data);
      console.log(data,'dara');
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch once when component mounts
    fetchAdminStats();
  }, []); 

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
        <div className="p-4 flex justify-between items-center">
          <button 
            onClick={fetchAdminStats}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          {stats.apiStatus && stats.apiStatus.errorCount > 0 && (
            <div className="text-yellow-600 text-sm">
              ⚠️ {stats.apiStatus.message}
            </div>
          )}
        </div>

        <Usdt stats={stats} />
        <StakingAssets stats={stats} />
       <div className="p-6"> <WithdrawalList /></div>
      </MainLayout>
    </div>
  )
}

export default Admin