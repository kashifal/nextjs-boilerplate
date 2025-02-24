"use client";
import { Suspense } from "react";
import React, { useEffect, useState } from "react";
import OtherNavbar from "@/components/OtherNavbar";
import Footer from "@/components/Footer";
import { useAdminAuth } from "@/hooks/useAdminAuth";

import { useRouter } from "next/navigation";

export default function ReferralsPage() {
 
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#10141B] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <ReferralsPageContent />
    </Suspense>
  );
}

function ReferralsPageContent() {
  const router = useRouter();
  const [referralData, setReferralData] = useState({
    referrals: [],
    stats: {
      totalReferrals: 0,
      activeReferrals: 0,
      totalRewards: 0,
      totalStaked: 0,
    },
    referralCode: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReferrals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/referrals", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/referrals");
          return;
        }
        throw new Error("Failed to fetch referrals");
      }

      const data = await response.json();
      setReferralData(data);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
    const intervalId = setInterval(fetchReferrals, 20000);
    return () => clearInterval(intervalId);
  }, [router]);

  if (error) {
    return (
      <div className="bg-[#10141B] min-h-screen justify-start items-center flex flex-col">
        <div className="bg-[#1D2431] rounded-lg w-full  max-w-7xl my-20 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Your Referral Link
          </h2>
          <div className="flex gap-4 items-center mb-6">
            <input
              type="text"
              value={`${
                typeof window !== "undefined" ? window.location.origin : ""
              }/register?ref=${referralData.referralCode}`}
              className="flex-1 bg-[#2D3541] p-3 rounded-lg text-white"
              readOnly
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/register?ref=${referralData.referralCode}`
                );
              }}
              className="bg-[#48FF2C] text-black px-4 py-2 rounded-lg hover:bg-[#3be025] transition-colors"
            >
              Copy
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            Share this link with your friends to earn rewards!
          </p>
        </div>
        <div className="text-red-500 p-4 text-center">Error: {error}</div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#10141B] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[#1D2431] rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Your Referral Link
          </h2>
          <div className="flex gap-4 items-center mb-6">
            <input
              type="text"
              value={`${
                typeof window !== "undefined" ? window.location.origin : ""
              }/register?ref=${referralData.referralCode}`}
              className="flex-1 bg-[#2D3541] p-3 rounded-lg text-white"
              readOnly
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/register?ref=${referralData.referralCode}`
                );
              }}
              className="bg-[#48FF2C] text-black px-4 py-2 rounded-lg hover:bg-[#3be025] transition-colors"
            >
              Copy
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            Share this link with your friends to earn rewards!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1D2431] p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Total Referrals</h3>
            <p className="text-2xl font-bold text-white">
              {referralData.stats.totalReferrals}
            </p>
          </div>
          <div className="bg-[#1D2431] p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Active Referrals</h3>
            <p className="text-2xl font-bold text-white">
              {referralData.stats.activeReferrals}
            </p>
          </div>
          <div className="bg-[#1D2431] p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Total Rewards</h3>
            <p className="text-2xl font-bold text-white">
              ${referralData.stats.totalRewards.toFixed(2)}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-white p-4">Loading...</div>
        ) : referralData.referrals.length > 0 ? (
          <div className="bg-[#1D2431] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#2D3541]">
                  <th className="p-4 text-left text-gray-400">User</th>
                  <th className="p-4 text-left text-gray-400">Status</th>
                  {/* <th className="p-4 text-left text-gray-400">Staked Amount</th> */}
                  <th className="p-4 text-left text-gray-400">Reward</th>
                </tr>
              </thead>
              <tbody>
                {referralData.referrals.map((referral) => (
                  <tr key={referral._id} className="border-t border-[#2D3541]">
                    <td className="p-4 text-white">
                      {referral.referred.email}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          referral.status === "STAKED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {referral.status}
                      </span>
                    </td>
                    {/* <td className="p-4 text-white">${(referral.stakeAmount || 0).toFixed(2)}</td> */}
                    <td className="p-4 text-white">
                      ${(referral.reward || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-400 p-4">
            No referrals yet. Share your referral link to start earning rewards!
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
