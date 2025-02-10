'use client';

import Image from 'next/image'
import MainLayout from '@/components/layout/MainLayout';
import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth'

import { useParams } from 'next/navigation';
import EditStakingModal from '@/components/EditStakingModal';




export default function Page() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('general'); // 'general' or 'staking'
    const params = useParams();
    useAdminAuth();
    const userId = params.slug; // This will get '67a7a498127ab946e15f17ba' from the URL
    const [selectedStaking, setSelectedStaking] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/users/details`, {
                    cache: 'no-store'
                });
                const { data } = await response.json();
                
                // Find the specific user from the data array
                const foundUser = data.find(u => u._id === userId);
                setUser(foundUser);
                console.log('Found user:', foundUser);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    // Group stakings by coin type
    const stakingsByCoin = user.stakings.reduce((acc, staking) => {
        if (!acc[staking.coin]) {
            acc[staking.coin] = [];
        }
        acc[staking.coin].push(staking);
        return acc;
    }, {});

    const handleStakingUpdate = (updatedStaking) => {
        // Update the stakings list with the new data
        const updatedStakings = user.stakings.map(staking => 
            staking._id === updatedStaking._id ? updatedStaking : staking
        );
        setUser({ ...user, stakings: updatedStakings });
    };

    const renderGeneralTab = () => (
        <div>
            {/* Balance Cards */}
            <div className="grid grid-cols-1 bg-white rounded-lg overflow-hidden  md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-green-100 rounded-full"></div>
                            <span className="text-gray-600">Total balance</span>
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <span>+</span> Add balance
                        </button>
                    </div>
                    <p className="text-3xl font-semibold">{user.balances.total.toFixed(2)} USDT</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-full"></div>
                        <span className="text-gray-600">Staked</span>
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-3xl font-semibold">{user.balances.staked.toFixed(2)} USDT</p>
                </div>
            </div>

            {/* Cryptocurrency Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(user.balances.byCoin).map(([symbol, coinData]) => (
                    <div key={symbol} className="bg-white p-6 rounded-lg shadow-sm">
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
                            <button>
                                {/* <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg> */}
                            </button>
                        </div>
                        <p className="text-gray-500 mb-2">Balance</p>
                        <p className="text-2xl font-semibold">{coinData.amount} {symbol}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStakingTab = () => (
        <div className="space-y-8">
            {Object.entries(stakingsByCoin).map(([coinType, stakings]) => (
              
                <div key={coinType} className="space-y-4">
                      {/* <pre>{JSON.stringify(stakings, null, 2)}</pre> */}
                    <h2 className="text-2xl font-bold">{coinType}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {stakings.map((staking, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10  rounded-full flex items-center justify-center">
                                        <span className=" text-xl">
                                            <Image src={staking?.coinName?.logoUrl} alt={staking.coinName.symbol} width={32} height={32} />
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{coinType} </h3>
                                        <p className="text-gray-500">Staked: {staking.amount} {coinType}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between mb-2">
                                        <span>Earned:</span>
                                        <div>
                                            <span className="text-gray-600">+{staking.dailyProfits.reduce((sum, profit) => sum + profit.profit, 0).toFixed(5)} {coinType}</span>
                                            <span className="text-green-500 ml-2">+${(staking.amount * staking.apy / 100).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Progress bar */}
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-blue-400 to-green-400"
                                            style={{ 
                                                width: `${(new Date() - new Date(staking.startDate)) / (new Date(staking.endDate) - new Date(staking.startDate)) * 100}%` 
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg mb-4">
                                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <span>Remaining days: {Math.ceil((new Date(staking.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days</span>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => {
                                            setSelectedStaking(staking);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                                    >
                                        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                        Edit staking
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                                        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                        Delete staking
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <MainLayout>
            <div className="w-full p-6  min-h-screen bg-gray-100">
                {/* <pre>{JSON.stringify(users.slice(1), null, 2)}</pre> */}
                <div className=" mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-8">
                        <button className="text-gray-600">
                            <svg xmlns="http://www.w3.org/dialog" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-semibold">User details</h1>
                        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
                    </div>

                    <div className="flex items-start gap-6">
                        {/* User Profile Card */}
                        <div className="bg-white w-[20%] rounded-lg p-6 shadow-sm">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
                                <h2 className="text-xl font-semibold mb-1">{user.username}</h2>
                                <p className="text-gray-500 mb-4">{user.email}</p>
                                <div className="bg-green-50 px-4 py-1 rounded-full">
                                    <span className="text-green-500 text-sm">{user.status}</span>
                                </div>
                                <button className="mt-6 w-full bg-gray-900 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                                    Action
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-3 w-[80%]">
                            {/* Tabs */}
                            <div className="border-b mb-6">
                                <div className="flex gap-8">
                                    <button 
                                        className={`pb-4 ${activeTab === 'general' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500'}`}
                                        onClick={() => setActiveTab('general')}
                                    >
                                        General
                                    </button>
                                    <button 
                                        className={`pb-4 ${activeTab === 'staking' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500'}`}
                                        onClick={() => setActiveTab('staking')}
                                    >
                                        Staking
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'general' ? renderGeneralTab() : renderStakingTab()}
                        </div>
                    </div>
                </div>
            </div>

            {isEditModalOpen && selectedStaking && (
                <EditStakingModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedStaking(null);
                    }}
                    staking={selectedStaking}
                    onSave={handleStakingUpdate}
                />
            )}

        </MainLayout>
    )
}