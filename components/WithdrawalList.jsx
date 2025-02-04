'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const WithdrawalList = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchWithdrawals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/withdrawal');
      const data = await response.json();
      const validWithdrawals = data.withdrawals.filter(w => w && w.user);
      setWithdrawals(validWithdrawals);
      toast.success('Withdrawals refreshed');
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast.error('Failed to fetch withdrawals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setProcessingId(id);
      const response = await fetch(`/api/withdrawal/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success(`Withdrawal ${newStatus.toLowerCase()}`);
      fetchWithdrawals();
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      toast.error(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Withdrawal Requests</h2>
        <button 
          onClick={fetchWithdrawals}
          disabled={isLoading}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Refresh withdrawals"
        >
          <svg 
            className={`w-6 h-6 text-gray-600 ${isLoading ? 'animate-spin' : ''}`}
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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wallet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {withdrawals.map((withdrawal) => (
              withdrawal && (
                <tr key={withdrawal._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {withdrawal?.user?.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {withdrawal?.coin?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {withdrawal?.amount || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {withdrawal?.walletAddress ? 
                      `${withdrawal.walletAddress.slice(0, 10)}...` : 
                      'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      withdrawal?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      withdrawal?.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {withdrawal?.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {withdrawal?.createdAt ? 
                      new Date(withdrawal.createdAt).toLocaleDateString() : 
                      'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {withdrawal?.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(withdrawal._id, 'APPROVED')}
                          disabled={processingId === withdrawal._id}
                          className={`${
                            processingId === withdrawal._id
                              ? 'bg-green-400 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600'
                          } text-white px-3 py-1 rounded-md text-sm flex items-center justify-center min-w-[80px]`}
                        >
                          {processingId === withdrawal._id ? (
                            <svg 
                              className="animate-spin h-5 w-5" 
                              fill="none" 
                              viewBox="0 0 24 24"
                            >
                              <circle 
                                className="opacity-25" 
                                cx="12" 
                                cy="12" 
                                r="10" 
                                stroke="currentColor" 
                                strokeWidth="4"
                              />
                              <path 
                                className="opacity-75" 
                                fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : (
                            'Approve'
                          )}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(withdrawal._id, 'REJECTED')}
                          disabled={processingId === withdrawal._id}
                          className={`${
                            processingId === withdrawal._id
                              ? 'bg-red-400 cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600'
                          } text-white px-3 py-1 rounded-md text-sm flex items-center justify-center min-w-[80px]`}
                        >
                          {processingId === withdrawal._id ? (
                            <svg 
                              className="animate-spin h-5 w-5" 
                              fill="none" 
                              viewBox="0 0 24 24"
                            >
                              <circle 
                                className="opacity-25" 
                                cx="12" 
                                cy="12" 
                                r="10" 
                                stroke="currentColor" 
                                strokeWidth="4"
                              />
                              <path 
                                className="opacity-75" 
                                fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : (
                            'Reject'
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawalList; 