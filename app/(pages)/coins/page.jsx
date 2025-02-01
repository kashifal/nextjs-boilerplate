"use client"
import React, { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout';
import '@/app/globals.css';
import Image from 'next/image';
import { useAdminAuth } from '@/hooks/useAdminAuth'

import { Plus } from 'lucide-react';
import AddCoinModal from './AddCoinModal';
import { MoreVertical as EllipsisVertical, Edit as PencilSquare, Trash } from 'react-feather';

const CoinCard = ({ coin, amount, symbol }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    useAdminAuth();
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
    <AddCoinModal onClose={() => setIsModalOpen(false)} isOpen={isModalOpen} />
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 relative">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/${coin.icon}`}
              alt={coin.name}
              fill
              className="rounded-full"
            />
          </div>
          <span className="text-2xl font-semibold">{coin.name}</span>
        </div>
        <div className="relative group">
          <button className="p-2 hover:bg-gray-100 border border-gray-200 rounded-lg">
            <EllipsisVertical size={24} className="text-gray-400" />
          </button>
          
          {/* Dropdown Menu */}
          <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg p-2">
            <button className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 rounded-lg">
              <PencilSquare size={20} className="text-green-500" />
              <span>Edit coin</span>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 rounded-lg">
              <PencilSquare size={20} className="text-gray-500" />
              <span>Edit APY</span>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 rounded-lg text-red-500">
              <Trash size={20} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6">
        <p className="text-gray-500 mb-2">Staked</p>
        <p className="text-2xl font-bold">
          {amount} <span className="text-gray-500">{symbol}</span>
        </p>
      </div>
    </div>
  );
};

const Coins = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coins, setCoins] = useState([]);
  
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('/api/coin');
        const data = await response.json();
        if (data.coins) {
          const formattedCoins = data.coins.map(coin => ({
            name: coin.name,
            icon: coin.logoUrl || '/placeholder-coin.png',
            amount: '0.00',
            symbol: coin.name
          }));
          setCoins(formattedCoins);
        }
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    fetchCoins();
  }, []);

  return (
    <MainLayout>
    
      <div className="flex bg-[#F8F8F8] min-h-screen px-6 py-12 flex-col gap-4">
        <div className="flex flex-col gap-6">
          <div className="text-2xl font-bold flex gap-6 items-center">
            Coins
            <button 
            
            onClick={()=>setIsModalOpen(true)}
              className='bg-[#375DFB] flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-normal'
            >
              <Plus size={20} />
              <span>Add new coin</span>
            </button>
          </div>
          
          <AddCoinModal onClose={() => setIsModalOpen(false)} isOpen={isModalOpen} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coins.map((coin, index) => (
              <CoinCard
                key={index}
                coin={coin}
                amount={coin.amount}
                symbol={coin.symbol}
              />
            ))}
          </div>
          
        </div>
      </div>
    </MainLayout>
  )
}

export default Coins