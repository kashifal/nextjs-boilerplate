'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function EditStakingModal({ isOpen, onClose, staking, onSave }) {
    const [amount, setAmount] = useState(staking?.amount || '');
    const [daysLeft, setDaysLeft] = useState(
        Math.ceil((new Date(staking?.endDate) - new Date()) / (1000 * 60 * 60 * 24)) || ''
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`/api/staking/${staking._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    daysLeft: parseInt(daysLeft)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update staking');
            }

            const data = await response.json();
            onSave(data.staking);
            window.location.reload();
            onClose();
        } catch (error) {
            console.error('Error updating staking:', error);
            // Handle error (show error message to user)
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white h-[50vh] overflow-y-auto rounded-lg p-6 w-full max-w-md">
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">Current Staking Details:</p>
                    <p>Amount: {staking?.amount} {staking?.coin?.symbol}</p>
                    <p>End Date: {new Date(staking?.endDate).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Staking</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Staked amount
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                placeholder="Enter amount"
                            />
                            {/* <pre>{JSON.stringify(staking, null, 2)}</pre> */}
                            <div className="absolute right-3 top-2 flex items-center">
                                <Image
                                    src={staking?.coinName?.logoUrl || '/default-coin-logo.png'}
                                    alt={staking?.coinName?.symbol}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                />
                                <span className="ml-2 text-gray-500">{staking?.coinName?.symbol}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Days left
                        </label>
                        <input
                            type="number"
                            value={daysLeft}
                            onChange={(e) => setDaysLeft(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Enter days"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Save
                    </button>
                </form>

                {/* <pre className="text-xs overflow-auto">
                    {JSON.stringify({
                        amount: staking?.amount,
                        coin: staking?.coin,
                        endDate: staking?.endDate,
                        coinName: staking?.coinName
                    }, null, 2)}
                </pre> */}
            </div>
        </div>
    );
} 