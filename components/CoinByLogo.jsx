'use client';
import { useState, useEffect } from 'react';

export default function CoinByLogo() {
  const [topupSummary, setTopupSummary] = useState([]);

  useEffect(() => { 
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.id) {
        fetch(`/api/topup?userId=${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.topups) {
                    // Process the topups to get summary by coin
                    const coinSummary = data.topups.reduce((acc, topup) => {
                        if (topup.status === 'APPROVED') {
                            const coinId = topup.coin;
                            if (!acc[coinId]) {
                                acc[coinId] = {
                                    coinId: coinId,
                                    totalAmount: 0
                                };
                            }
                            acc[coinId].totalAmount += topup.amount;
                        }
                        return acc;
                    }, {});

                    // Get coin details
                    fetch('/api/coin')
                        .then(res => res.json())
                        .then(coinData => {
                            const summary = Object.values(coinSummary).map(item => {
                                const coinInfo = coinData.coins.find(c => c._id === item.coinId);
                                return {
                                    coinName: coinInfo?.name || 'Unknown',
                                    totalAmount: item.totalAmount,
                                    coinLogo: coinInfo?.logoUrl || null,
                                    symbol: coinInfo?.symbol || ''
                                };
                            });
                            setTopupSummary(summary);
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching topups:', error);
            });
    }
  }, []);

  return (
    <div className='my-12'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {topupSummary.map((item, index) => (
          <div key={index} className="bg-[#1c1c1e] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              {item.coinLogo && (
                <img 
                  src={item.coinLogo} 
                  alt={item.coinName} 
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-gray-200 font-medium">
                {item.coinName} ({item.symbol})
              </span>
            </div>
            <div className="text-gray-400 text-sm">Balance</div>
            <div className="text-white text-2xl font-semibold">
              {item.totalAmount} {item.symbol}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

 