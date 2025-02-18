import { NextResponse } from 'next/server';
import axios from 'axios';

import connectDB from '@/lib/db';

import User from '@/models/user';
import Staking from '@/models/staking';
import Referral from '@/models/referral';
import Topup from '@/models/topup';
import Withdrawal from '@/models/withdrawal';
import Coin from '@/models/coin';

export async function GET() {
    try {
        await connectDB();

        const users = await User.find();
        const usersWithDetails = await Promise.all(users.map(async (user) => {
            // Get all transactions
            const stakings = await Staking.find({ user: user._id }).populate('coin');
            const topups = await Topup.find({ user: user._id }).populate('coin');
            const withdrawals = await Withdrawal.find({ user: user._id }).populate('coin');

            // Calculate balances per coin
            const coinBalances = {};
            const stakedBalances = {};

            // Add topups to balance
            topups.forEach(topup => {
                if (topup.status === 'APPROVED') {
                    const symbol = topup.coin.symbol;
                    coinBalances[symbol] = (coinBalances[symbol] || 0) + topup.amount;
                }
            });

            // Subtract withdrawals
            withdrawals.forEach(withdrawal => {
                if (withdrawal.status === 'APPROVED') {
                    const symbol = withdrawal.coin.symbol;
                    coinBalances[symbol] = (coinBalances[symbol] || 0) - withdrawal.amount;
                }
            });

            // Track staked amounts separately
            stakings.forEach(staking => {
                if (staking.status === 'ACTIVE') {
                    const symbol = staking.coin.symbol;
                    stakedBalances[symbol] = (stakedBalances[symbol] || 0) + staking.amount;
                }
            });

            // Calculate total balance including staked amounts
            const totalBalances = {};
            for (const symbol in coinBalances) {
                const available = Math.max(0, coinBalances[symbol] || 0);
                const staked = Math.max(0, stakedBalances[symbol] || 0);
                totalBalances[symbol] = available + staked; // Total includes both available and staked
            }

            // Get coin details
            const coinDetails = await Promise.all(
                Object.keys(totalBalances).map(async (symbol) => {
                    const coin = await Coin.findOne({ symbol });
                    return {
                        amount: Math.max(0, coinBalances[symbol] || 0), // Available balance
                        staked: Math.max(0, stakedBalances[symbol] || 0), // Staked balance
                        total: Math.max(0, totalBalances[symbol] || 0), // Total balance
                        name: symbol,
                        logoUrl: coin?.logoUrl,
                        _id: coin?._id
                    };
                })
            );

            return {
                ...user.toObject(),
                balances: {
                    available: Object.values(coinBalances).reduce((sum, val) => sum + Math.max(0, val), 0),
                    staked: Object.values(stakedBalances).reduce((sum, val) => sum + Math.max(0, val), 0),
                    total: Object.values(totalBalances).reduce((sum, val) => sum + Math.max(0, val), 0),
                    byCoin: Object.fromEntries(
                        coinDetails.map(detail => [detail.name, detail])
                    )
                },
                stakings,
                referrals: [],
                transactions: {
                    topups,
                    withdrawals
                }
            };
        }));

        return NextResponse.json({
            success: true,
            data: usersWithDetails
        });

    } catch (error) {
        console.error('Error fetching user details:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user details' },
            { status: 500 }
        );
    }
} 