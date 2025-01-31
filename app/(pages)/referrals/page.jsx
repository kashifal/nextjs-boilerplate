"use client"
import React, { useEffect, useState } from "react";
import OtherNavbar from "@/components/OtherNavbar";
import Footer from "@/components/Footer";
import { useRouter } from 'next/navigation';

const ReferralsPage = () => {
  const router = useRouter();
  const [referralData, setReferralData] = useState({
    referrals: [],
    stats: {
      totalReferrals: 0,
      activeReferrals: 0,
      totalRewards: 0,
      totalStaked: 0
    },
    referralCode: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/referrals', {
          credentials: 'include' // This ensures cookies are sent
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/');
            return;
          }
          throw new Error('Failed to fetch referrals');
        }
        
        const data = await response.json();
        setReferralData({
          referrals: data.referrals || [],
          stats: {
            totalReferrals: data.stats?.totalReferrals || 0,
            activeReferrals: data.stats?.activeReferrals || 0,
            totalRewards: data.stats?.totalRewards || 0,
            totalStaked: data.stats?.totalStaked || 0
          },
          referralCode: data.referralCode || ''
        });
      } catch (error) {
        console.error('Error:', error);
        // Don't set error for new users with no referrals
        if (error.message !== 'Failed to fetch referrals') {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferrals();
  }, [router]);

  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/register?ref=${referralData.referralCode}`
    : '';

  if (isLoading) {
    return (
      <div className="bg-[#10141B] text-white min-h-screen">
        <OtherNavbar />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-xl">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

//   if (error) {
//     return (
//       <div className="bg-[#10141B] text-white min-h-screen">
//         <OtherNavbar />
//         <div className="flex justify-center items-center h-[60vh]">
//           <div className="text-red-500 text-xl">Error: {error}</div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

  return (
    <div className="bg-[#10141B] text-white min-h-screen">
      <OtherNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Referral Info Section */}
        <div className="bg-[#1D2431] rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Referral Link</h2>
          <div className="flex gap-4 items-center mb-6">
            <input 
              type="text"
              value={referralLink}
              className="flex-1 bg-[#2D3541] p-3 rounded-lg"
              readOnly
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                // Optional: Add a toast or notification here
              }}
              className="bg-[#48FF2C] text-black px-4 py-2 rounded-lg hover:bg-[#3be025] transition-colors"
            >
              Copy
            </button>
          </div>
          <p className="text-gray-400 text-sm">Share this link with your friends to earn rewards!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1D2431] p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Total Referrals</h3>
            <p className="text-2xl font-bold">{referralData.stats.totalReferrals}</p>
          </div>
          <div className="bg-[#1D2431] p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Active Referrals</h3>
            <p className="text-2xl font-bold">{referralData.stats.activeReferrals}</p>
          </div>
          <div className="bg-[#1D2431] p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Total Rewards</h3>
            <p className="text-2xl font-bold">${referralData.stats.totalRewards.toFixed(2)}</p>
          </div>
          <div className="bg-[#1D2431] p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Total Staked by Referrals</h3>
            <p className="text-2xl font-bold">${referralData.stats.totalStaked.toFixed(2)}</p>
          </div>
        </div>

        {/* Referrals Table */}
        <div className="bg-[#1D2431] rounded-lg overflow-hidden">
          <h2 className="text-xl font-bold p-6">Referral History</h2>
          {referralData.referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2D3541]">
                  <tr>
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Staked Amount</th>
                    <th className="text-left p-4">Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {referralData.referrals.map((referral) => (
                    <tr key={referral._id} className="border-b border-[#2D3541]">
                      <td className="p-4">{referral.referred?.email || 'N/A'}</td>
                      <td className="p-4">{new Date(referral.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          referral.status === 'STAKED' 
                            ? 'bg-green-100 text-green-800'
                            : referral.status === 'REWARDED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="p-4">${(referral.stakeAmount || 0).toFixed(2)}</td>
                      <td className="p-4">${(referral.reward || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-400">
              <p>No referrals yet. Share your referral link to start earning rewards!</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReferralsPage;
