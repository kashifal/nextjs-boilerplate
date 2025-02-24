'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import CoinByLogo from "./CoinByLogo";
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
      {/* <pre>{JSON.stringify(foundUser, null, 2)}</pre> */}
      {/* <h1 className="text-2xl font-bold">Balances</h1> */}

      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pb-16 pt-8">
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
              </div> */}
              {/* <button>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button> */}
            {/* </div>
            <p className="text-gray-500 mb-2">Balance</p>
            <p className="text-2xl font-semibold">{coinData.amount} {symbol}</p>
          </div>
        ))}
      </div> */}

      <CoinByLogo />
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
                <h1 className="font-[700] flex items-center gap-4 text-[20px] pt-3 sm:text-[30px] text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 24 24"><g fill="none"><path fill="#641500" d="M3.563 10.313h.562v3.374h-.562zm16.312 0h.563v3.374h-.563zM4.125 8.625h.563v1.688h-.563zm0 6.75h.563v-1.687h-.563zm15.75 0h-.562v-1.687h.562zm0-6.75h-.562v1.688h.562zM4.688 6.938h.562v1.687h-.562zm14.625 10.125h-.563v-1.688h.563zm-14.625 0h.562v-1.688h-.562zM19.313 6.938h-.563v1.687h.563zm-.563 11.25h-.563v-1.125h.563zM5.25 5.813h.562v1.125H5.25zm0 12.375h.562v-1.125H5.25zm12.937.562h-.562v-.562h.562zm.563-12.937h-.563v1.125h.563zM5.812 5.25h.563v.563h-.563zm11.813 14.063h-1.687v-.563h1.687zM5.812 18.75h.563v-.562h-.563zm12.375-13.5h-.562v.563h.562zm-2.25 14.625h-1.124v-.562h1.125zM6.376 4.688h1.688v.562H6.375zm0 14.625h1.688v-.563H6.375zm8.438 1.125h-1.688v-.563h1.688zm2.812-15.75h-1.687v.562h1.687zm-9.562-.563h1.124v.563H8.063zM13.686 21H12v-.562h1.688zm-5.624-1.125h1.124v-.562H8.063zm7.875-15.75h-1.126v.563h1.126zm-6.75-.562h1.687v.562H9.188zm0 16.875h1.687v-.563H9.188zm5.624-16.875h-1.687v.562h1.688zM10.313 3H12v.563h-1.688zm0 18H12v-.562h-1.688zm3.376-18H12v.563h1.688z"></path><path fill="#b02b08" d="M4.125 10.313h.563v2.812h-.563zm.563-1.688h.562v1.688h-.562zm14.625 0h-.562v1.688h.562zM5.25 6.938h.563v1.687H5.25zm13.5 0h-.562v1.687h.563zM5.813 5.813h.563v1.125h-.563zm12.375 0h-.562V7.5h.562zM6.376 5.25h1.687v.563H6.375zm11.25 0h-1.688v.563h1.687zm-9.563-.562h1.125v.562H8.063zm7.875 0h-1.125v.562h1.125zm-6.75-.563h1.688v.563H9.188zm5.625 0h-1.687v.563h1.687zm-3.937-.562H12v.562h-1.125zm2.25 0H12v.562h1.125zm6.75 6.75h-.563v2.812h.563z"></path><path fill="#f97400" d="M4.125 13.125h.563v.563h-.563zm15.75 0h-.562v.563h.563zM4.689 14.25h.562v1.125h-.562zm14.625 0h-.562v1.125h.562zM5.25 15.375h.563v1.688H5.25zm13.5 0h-.562v1.688h.563z"></path><path fill="#bd480a" d="M5.813 16.5h.562v1.688h-.562zm12.374 0h-.562v1.688h.562zm-11.812.563h.563v1.687h-.563zm11.25 0h-.562v1.687h.562zm-10.687.562H7.5v1.125h-.562zm10.125 0H16.5v1.125h.563zm-9 .563h.562v1.125h-.562zm7.875 0h-.563v1.125h.563z"></path><path fill="#f97400" d="M8.625 18.188h.563v1.124h-.563zm6.75 0h-.562v1.124h.562zm-6.187.562h1.687v1.125H9.188zm5.624 0h-1.687v1.125h1.688zm-3.937.562h2.25v1.125h-2.25zM7.5 17.625h.563v1.125H7.5zm9 0h-.562v1.125h.562z"></path><path fill="#bd480a" d="M4.688 13.125h.562v1.125h-.562zm14.625 0h-.562v1.125h.562z"></path><path fill="#fff869" d="M4.688 10.313h1.688v1.124H4.688z"></path><path fill="#feb032" d="M19.313 10.313h-1.687v1.124h1.687zM4.688 11.437h1.688v1.688H4.688zM7.5 9.75h1.125v3.938H7.5zm7.876 0h1.687v3.938h-1.687zm-7.313 3.938h.562v1.124h-.562z"></path><path fill="#feb032" d="M8.063 10.313h.562V9.188h-.562zm.562 3.937h1.126v1.125H8.625zm0-5.062h.563v-.563h-.563zm.563 6.187h1.125v.563H9.188zm-.563-6.75h1.126v-.562H8.625zm1.688 6.75h3.937V16.5h-3.937zm-.562-6.75h4.5V7.5h-4.5zm4.5 6.75h1.125v.563H14.25zm0-6.75h1.125V7.5H14.25zm0 6.188h1.687v.562H14.25z"></path><path fill="#feb032" d="M14.813 9.188h1.125V8.062h-1.125zm0 4.5H16.5v1.124h-1.687z"></path><path fill="#feb032" d="M15.375 9.75H16.5V8.625h-1.125zm-4.5 6.75h2.25v.563h-2.25zm0-9h2.813v-.562h-2.813zM5.25 13.125h1.125v2.25H5.25z"></path><path fill="#feb032" d="M5.813 14.25h1.125v2.25H5.813z"></path><path fill="#feb032" d="M6.375 15.375H7.5v1.687H6.375z"></path><path fill="#feb032" d="M6.938 15.938h1.125v1.687H6.937zm1.125.562h1.124v1.688H8.063z"></path><path fill="#feb032" d="M7.5 15.938h1.125v1.687H7.5zm1.688 1.124h1.687v1.688H9.188zm1.687.563h2.25v1.688h-2.25zm8.438-6.187h-1.688v1.687h1.688zm-.563 1.687h-1.125v2.25h1.125z"></path><path fill="#feb032" d="M18.187 14.25h-1.125v2.25h1.125z"></path><path fill="#feb032" d="M17.626 15.375H16.5v1.687h1.126z"></path><path fill="#feb032" d="M17.063 15.938h-1.125v1.687h1.125zm-1.125.562h-1.125v1.688h1.125z"></path><path fill="#feb032" d="M16.5 15.938h-1.125v1.687H16.5zm-1.687 1.124h-1.688v1.688h1.688z"></path><path fill="#fff869" d="M5.25 8.625h1.125v1.688H5.25z"></path><path fill="#feb032" d="M18.75 8.625h-1.125v1.688h1.125zm-1.125 0h-.562v.563h.562z"></path><path fill="#fff869" d="M5.813 8.063h1.125v.562H5.813z"></path><path fill="#feb032" d="M18.188 7.5h-1.687v1.125h1.687z"></path><path fill="#fff869" d="M6.375 7.5H7.5v.562H6.375zm.563-1.125h1.125V7.5H6.938zm1.125-.562h1.125v1.124H8.063zm1.125-.563h1.688v1.125H9.188zm1.688-.562h2.25v1.125h-2.25zm2.25 0h1.687v1.687h-1.687zm1.687.562h1.125v1.125h-1.125z"></path><path fill="#fff869" d="M15.375 5.813h1.688v1.125h-1.688z"></path><path fill="#fff869" d="M15.938 5.813h1.687V7.5h-1.687zm-3.937-1.688h1.124v.563h-1.124z"></path><path fill="#ffface" d="M5.813 6.937h.562v1.125h-.562zm.562-1.125h.563V7.5h-.563zm.563 0h1.125v.563H6.938zm1.125-.562h1.124v.563H8.063zm1.124-.562h1.688v.562H9.188zm1.688-.563H12v.563h-1.125z"></path><path fill="#c61600" d="M6.375 8.625h.563v5.625h-.563z"></path><path fill="#f97400" d="M6.938 9.188H7.5v5.062h-.562zM7.5 7.5h.563v2.25H7.5zm.563 0h.562v1.688h-.562zm.562-.562h.562v1.125h-.562zm.562 0h.563v1.124h-.563zm.563 0h1.125V7.5H9.75zm1.125-.563h2.25v.563h-2.25zm2.813.563h1.687V7.5h-1.687zm1.687.562h.563v.563h-.563zm.563.563h.562v.562h-.562zm.562 1.125h.563v.562H16.5zm-9 4.5h.563v1.124H7.5zm.563 1.124h.562v.563h-.562zm.562.563h.562v.563h-.562zm1.125.563h.562v.562H9.75zm-.563 0h.563v.562h-.563z"></path><path fill="#c61600" d="M6.938 8.063H7.5v1.124h-.562zm9.562 0h.563v1.124H16.5zm.563 1.124h.562v1.126h-.562zM7.5 7.5h.563v.563H7.5zm.563-.562h.562V7.5h-.562zm7.312 0h.563V7.5h-.563zm.563.562h.562v.563h-.562zm-6.75-1.125h1.687v.563H9.187zm3.937 0h2.25v.563h-2.25zm-2.25-.562h2.25v.562h-2.25zm-3.375 9h.563v1.125H7.5zm-.562-1.126H7.5v1.688h-.562zm1.125 1.688h.562v.563h-.562zm.562.563h.562v.562h-.562z"></path><path fill="#fff869" d="M9.188 16.5h1.687v.562H9.188zm3.937 0h1.688v.562h-1.688zm1.125-.562h1.125v.562H14.25zm1.125-.563h.563v.563h-.563zm.563-.563h.562v1.126h-.562zm.562-1.125h.563v1.688H16.5zm.563-3.374h.562v3.937h-.562zm-6.188 6.75h2.25v.562h-2.25z"></path><path fill="#620719" d="M9.75 14.813h4.5v.562h-4.5z"></path><path fill="#f97400" d="M9.75 14.25h4.5v.562h-4.5zm-.562-5.062h5.624v.562H9.189z"></path><path fill="#d93900" d="M9.188 9.75h5.624v.563H9.189z"></path><path fill="#fff869" d="M13.125 10.313h1.125v1.124h-1.125z"></path><path fill="#f6d45a" d="M12 10.313h1.125v1.124h-1.124z"></path><path fill="#f97400" d="M9.188 8.625h5.624v.563H9.189zm0 4.5h.562v1.125h-.562zm5.062 0h.563v1.125h-.563z"></path><path fill="#c61600" d="M14.25 11.438h.563v1.687h-.563zm-5.062 0h.562v1.687h-.562zm5.062 1.687v1.125h-4.5v-1.125zm-3.938-1.687V12H9.75v-.562z"></path><path fill="#00070a" d="M13.688 10.875V12h-.562v-1.125zM11.438 12v.563h-.562V12zm1.688 0v.563h-.563V12z"></path><path fill="#fff" d="M14.25 12v1.125h-1.125V12zm-3.375 0v1.125H9.75V12zm.563-1.687v1.124h-.563v-1.124zm1.687 2.25v.562h-2.25v-.563z"></path><path fill="#f5cb9c" d="M12.562 12v1.125h-1.124V12z"></path><path fill="#c61600" d="M13.126 11.438V12h-2.25v-.562zm1.124 0V12h-.562v-.562z"></path><path fill="#620719" d="M9.188 14.25h.563v.562h-.563zm5.062 0h.563v.562h-.563zm.563-3.937h.563v3.937h-.563zm-6.188 0h.563v3.937h-.563z"></path><path fill="#9e100a" d="M8.625 9.188h.563v1.124h-.563zm1.688-.563v.563H9.188v-.563zm4.5 0v.563h-.563v-.563zm0 .563h.563v1.124h-.563zm-.563 1.124h.563v1.126h-.563zm-5.062 0h.563v1.126h-.563z"></path><path fill="#eeb04b" d="M9.75 10.313h.563v1.124H9.75z"></path><path fill="#fff869" d="M11.438 10.313h.563v1.124h-.563zm-1.125 0h.563v1.124h-.563z"></path><path fill="#00070a" d="M10.876 10.875V12h-.563v-1.125z"></path></g></svg>
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
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
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
                            <div>
                            <h1 className="font-medium text-sm">
                              Today's Earning:
                            </h1>
                            <div className="flex gap-1.5 text-xs text-white">
                              <p className="text-[#48FF2C]">
                                +{todayProfitUSDT} USDT
                              </p>
                            </div>
                          </div>
                              <h1 className="font-medium  mt-4 text-xs">Total Earned:</h1>
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
