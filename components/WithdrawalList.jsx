'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const WithdrawalList = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch('/api/withdrawal');
      const data = await response.json();
      setWithdrawals(data.withdrawals);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast.error('Failed to fetch withdrawals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
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
      fetchWithdrawals(); // Refresh the list
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      toast.error(error.message);
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
      <h2 className="text-2xl font-semibold mb-4">Withdrawal Requests</h2>
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
              <tr key={withdrawal._id}>
                <td className="px-6 py-4 whitespace-nowrap">{withdrawal.user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{withdrawal.coin.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{withdrawal.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {withdrawal.walletAddress.slice(0, 10)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    withdrawal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    withdrawal.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {withdrawal.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(withdrawal.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {withdrawal.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(withdrawal._id, 'APPROVED')}
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(withdrawal._id, 'REJECTED')}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawalList; 