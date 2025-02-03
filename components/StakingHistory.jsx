import React, { useEffect, useState } from 'react';

const StakingHistory = () => {
  const [stakingGroups, setStakingGroups] = useState([]);
  const [totalStakedUSDT, setTotalStakedUSDT] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStakings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id) {
          throw new Error('User not found');
        }

        const response = await fetch(`/api/staking?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch staking data');
        }

        const data = await response.json();
        console.log('Fetched staking data:', data); // Debug log

        if (data.error) {
          throw new Error(data.error);
        }

        setStakingGroups(data.stakings || []);
        setTotalStakedUSDT(data.totalStakedUSDT || 0);
      } catch (error) {
        console.error('Error fetching stakings:', error);
        setError(error.message);
        setStakingGroups([]);
        setTotalStakedUSDT(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStakings();
  }, []);

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
      <h2 className="text-2xl font-bold mb-6">Stakings</h2>
      <div className="mb-6">
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
            <h1 className="font-[700] text-[24px] pt-12 sm:text-[20px]"> {group.coinName} - Total Staked: {group.totalStaked.toFixed(0)} {group.coinName} ({group.totalStakedUSDT.toFixed(1)} USDT)</h1>
            <p className="text-sm mb-4">
              Total Profit: {group.totalProfit.toFixed(1)} {group.coinName} <span className='text-[#48FF2C] px-2 text-xs'>({group.totalProfitUSDT.toFixed(1)}  USDT)</span>
            </p>
            <div className="mt-4 grid grid-cols-3 gap-5">
            {group.stakes.map(({amount,duration,autoStaking,startDate,endDate,dailyProfits,status,apy, _id, totalProfitUSDT }) => 
            {
                const startDates = new Date(startDate);
                const currentDate = new Date();
                const durations = duration;
                
                // Calculate progress percentage
                const progressPercentage = ((currentDate - startDates) / (1000 * 60 * 60 * 24) / durations * 100);
                const clampedPercentage = Math.min(Math.max(progressPercentage, 0), 100);
                
                // Calculate remaining days
                const remainingDays = Math.max(
                  durations - (currentDate - startDates) / (1000 * 60 * 60 * 24),
                  0
                ).toFixed(0);

                // Find today's profit
                const today = new Date().toISOString().split('T')[0];
                const todayProfit = dailyProfits.find(profit => 
                  new Date(profit.date).toISOString().split('T')[0] === today
                );
                
                // Convert profit to USDT (using the same ratio as total profit to totalProfitUSDT)
                const profitToUSDTRatio = group.totalProfitUSDT / group.totalProfit;
                const todayProfitUSDT = todayProfit 
                  ? (todayProfit.profit * profitToUSDTRatio).toFixed(2)
                  : '0.00';

                return(
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
                      <h1 className="font-[700] text-[18px]">{group.coinName}</h1>
                      <div className="font-medium text-[13px]">
                        <span className="text-[#77849B]">Staked:</span> {/* */}{amount} {group.coinName}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1 className="font-medium text-sm">Earned:</h1>
                    <div className="flex gap-1.5 text-sm text-white">
                        <p className='text-[#48FF2C]'>+{totalProfitUSDT.toFixed(1)} USDT</p>
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
                  <span className="text-[#77849B]">Remaining days:</span> {/* */}{/* */}{" "}
                  {remainingDays} days
                </div>
                <div>
                    <h1 className="font-medium text-sm">Today's Earning:</h1>
                    <div className="flex gap-1.5 text-sm text-white">
                        <p className='text-[#48FF2C]'>+{todayProfitUSDT} USDT</p>
                    </div>
                </div>
              
              </div>
                )
            })}
             
            </div>
          </div>
          
        ))
      )}
    </div>
  );
};

export default StakingHistory; 