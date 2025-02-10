'use client';

import { useState, useEffect } from 'react';
import moment from 'moment';

export default function CryptoTable() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('/api/crypto');
        const data = await response.json();
        console.log(data,'data');
        setCryptoData(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        setLoading(false);
      }
    };

    fetchCryptoData(); // Initial fetch
    // Refresh data every 5 seconds (5000 milliseconds)
    const interval = setInterval(fetchCryptoData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto py-16">
      <h1 className="text-2xl font-bold mb-4">Cryptocurrency Market Data</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Symbol</th>
              <th className="px-4 py-2">Price (USD)</th>
              <th className="px-4 py-2">24h Change</th>
              <th className="px-4 py-2">Market Cap</th>
              <th className="px-4 py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((crypto) => (
              <tr key={crypto.id} className="border-t border-gray-300">
                <td className="px-4 py-2">{crypto.cmc_rank}</td>
                <td className="px-4 py-2">{crypto.name}</td>
                <td className="px-4 py-2">{crypto.symbol}</td>
                <td className="px-4 py-2">${crypto.quote.USD.price.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <span className={crypto.quote.USD.percent_change_24h > 0 ? 'text-green-600' : 'text-red-600'}>
                    {crypto.quote.USD.percent_change_24h.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-2">${(crypto.quote.USD.market_cap / 1e9).toFixed(2)}B</td>
                <td className="px-4 py-2">{moment(crypto.last_updated).fromNow()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
