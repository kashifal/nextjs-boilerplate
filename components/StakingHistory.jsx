'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";

const StakingHistory = () => {
  const [stakingGroups, setStakingGroups] = useState([]);
  const [totalStakedUSDT, setTotalStakedUSDT] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [foundUser, setFoundUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const [error, setError] = useState(null);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      setUser(user.id);
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userId) return; // Don't fetch if userId is not set

      try {
        const response = await fetch('/api/users/details', {
          cache: 'no-store'
        });
        const { data } = await response.json();

        const foundUser = data.find(u => u._id === userId);
        if (foundUser) {
          setFoundUser(foundUser);
        } else {
          console.warn('User not found in data');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [userId]); // Add userId as dependency



  const fetchStakings = async () => {
    console.log(
      "jjjeejjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjob';bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    );
    try {
      setIsLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) {
        throw new Error("User not found");
      }

      const response = await fetch(`/api/staking?userId=${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch staking data");
      }

      const data = await response.json();
      console.log("Fetched staking data:", data); // Debug log

      if (data.error) {
        throw new Error(data.error);
      }

      setStakingGroups(data.stakings || []);
      setTotalStakedUSDT(data.totalStakedUSDT || 0);
    } catch (error) {
      console.error("Error fetching stakings:", error);
      setError(error.message);
      setStakingGroups([]);
      setTotalStakedUSDT(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStakings();
  }, []);

  console.log(stakingGroups);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Staking History</h2>
        <p>Loading staking data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Staking History</h2>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold">Balances</h1>
      <div className="grid grid-cols-4 gap-5 pb-16 pt-8">
        {foundUser?.balances?.byCoin && Object.entries(foundUser.balances.byCoin).map(([symbol, coinData]) => (
          <div key={symbol} className="bg-gray-700 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                {coinData.logoUrl ? (
                  <Image
                    src={coinData.logoUrl}
                    alt={coinData.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    {symbol.slice(0, 2)}
                  </div>
                )}
                <span className="font-semibold">{coinData.name || symbol}</span>
              </div>
              {/* <button>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button> */}
            </div>
            <p className="text-gray-500 mb-2">Balance</p>
            <p className="text-2xl font-semibold">{coinData.amount} {symbol}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stakings</h2>
        {/* <pre>{JSON.stringify(foundUser, null, 2)}</pre> */}
        <button
          onClick={fetchStakings}
          disabled={isLoading}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          title="Refresh data"
        >
          <svg
            className={`w-6 h-6 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {isLoading ? (
        <p>Loading staking data...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <>
          <div className="mb-3">
            <p className="text-lg font-semibold">
              Total Staked Value: ${totalStakedUSDT.toFixed(2)} USDT
            </p>
          </div>

          {stakingGroups.length === 0 ? (
            <p>No staking history found.</p>
          ) : (
            stakingGroups.map((group) => (
              <div key={group.coinName}>
                {/* <pre>{JSON.stringify(stakingGroups, null, 2)}</pre> */}
                <h1 className="font-[700] text-[24px] pt-3 sm:text-[20px]">
                  {" "}
                  {group.coinName} - Total Staked:{" "}
                  {group.totalStaked.toFixed(0)} {group.coinName} (
                  {group.totalStakedUSDT.toFixed(1)} USDT)
                </h1>
                {/* <p className="text-sm mb-4">
                  Total Profit: {group.totalProfit.toFixed(1)} {group.coinName}{" "}
                  <span className="text-[#48FF2C] px-2 text-xs">
                    ({group.totalProfitUSDT.toFixed(1)} USDT)
                  </span>
                </p> */}
                <div className="mt-4 grid grid-cols-3 gap-5">
                  {group.stakes.map(
                    ({
                      amount,
                      duration,
                      autoStaking,
                      startDate,
                      endDate,
                      dailyProfits,
                      status,
                      apy,
                      _id,
                      totalProfitUSDT,
                    }) => {
                      const startDates = new Date(startDate);
                      const currentDate = new Date();
                      const durations = duration;

                      // Calculate progress percentage
                      const progressPercentage =
                        ((currentDate - startDates) /
                          (1000 * 60 * 60 * 24) /
                          durations) *
                        100;
                      const clampedPercentage = Math.min(
                        Math.max(progressPercentage, 0),
                        100
                      );

                      // Calculate remaining days
                      const remainingDays = Math.max(
                        durations -
                        (currentDate - startDates) / (1000 * 60 * 60 * 24),
                        0
                      ).toFixed(0);

                      // Find today's profit
                      const today = new Date().toISOString().split("T")[0];
                      const todayProfit = dailyProfits.find(
                        (profit) =>
                          new Date(profit.date).toISOString().split("T")[0] ===
                          today
                      );

                      // Convert profit to USDT (using the same ratio as total profit to totalProfitUSDT)
                      const profitToUSDTRatio =
                        group.totalProfitUSDT / group.totalProfit;
                      const todayProfitUSDT = todayProfit
                        ? (todayProfit.profit * profitToUSDTRatio).toFixed(2)
                        : "0.00";

                      return (
                        <div className="bg-[#172130] rounded-[16px] px-5 py-5">
                          {/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
                          <div className="flex items-start gap-2 flex-wrap justify-between">
                            <div className="flex items-center gap-2.5">
                              <img
                                alt="Bitcoin"
                                width={39}
                                height={39}
                                decoding="async"
                                data-nimg={1}
                                style={{ color: "transparent" }}
                                srcSet="/_next/image?url=%2Fbitcoin.png&w=48&q=75 1x, /_next/image?url=%2Fbitcoin.png&w=96&q=75 2x"
                                src="/_next/image?url=%2Fbitcoin.png&w=96&q=75"
                              />
                              <div>
                                <h1 className="font-[700] text-[18px]">
                                  {group.coinName}
                                </h1>
                                <div className="font-medium text-[13px]">
                                  <span className="text-[#77849B]">
                                    Staked:
                                  </span>{" "}
                                  {/* */}
                                  {amount} {group.coinName}
                                </div>
                              </div>
                            </div>
                            <div>
                              <h1 className="font-medium text-sm">Earned:</h1>
                              <div className="flex gap-1.5 text-sm text-white">
                                <p className="text-[#48FF2C]">
                                  +{totalProfitUSDT.toFixed(1)} USDT
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="py-5">
                            <div className="rounded-full w-full overflow-hidden bg-[#29303A] h-[18px] relative">
                              <div
                                className="absolute left-0 rounded-full bg-gradient-to-r from-[#0ABEF1] to-[#0EF7BA] text-[12px] font-medium flex pr-2 text-[#3C3C3C] justify-end top-0 h-full"
                                style={{ width: `${clampedPercentage}%` }}
                              >
                                {clampedPercentage.toFixed(0)}%
                              </div>
                            </div>
                          </div>
                          <div className="font-medium text-sm">
                            <span className="text-[#77849B]">
                              Remaining days:
                            </span>{" "}
                            {/* */}
                            {/* */} {remainingDays} days
                          </div>
                          <div>
                            <h1 className="font-medium text-sm">
                              Today's Earning:
                            </h1>
                            <div className="flex gap-1.5 text-sm text-white">
                              <p className="text-[#48FF2C]">
                                +{todayProfitUSDT} USDT
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default StakingHistory;
