'use client'

import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'

const Referrals = () => {
  useAdminAuth(); // Protect the route
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllReferrals = async () => {
    try {
      const response = await fetch('/api/admin/referrals');
      const data = await response.json();
      setReferrals(data.referrals);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReferrals();
  }, []);

  const handleRewardUpdate = async (referralId, rewardAmount) => {
    try {
      const response = await fetch('/api/admin/referrals/reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralId, rewardAmount }),
      });

      if (response.ok) {
        fetchAllReferrals(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating reward:', error);
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">All Referrals</h1>
        
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referrer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referred User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stake Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reward</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {referrals.map((referral) => (
                  <tr key={referral._id}>
                    <td className="px-6 py-4">{referral.referrer.email}</td>
                    <td className="px-6 py-4">{referral.referred.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        referral.status === 'STAKED' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">${referral.stakeAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">${referral.reward.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <input 
                        type="number"
                        className="w-24 mr-2 px-2 py-1 border rounded"
                        placeholder="Reward"
                        onChange={(e) => handleRewardUpdate(referral._id, e.target.value)}
                      />
                      <button 
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleRewardUpdate(referral._id, referral.reward)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default Referrals