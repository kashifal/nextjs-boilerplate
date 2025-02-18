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

        // Get all users with their basic details
        const users = await User.find({}).lean();
        
        // Get all coins to have their data available
        const coins = await Coin.find({}).lean();

        // Create a map of coin symbols to their data
        const coinMap = coins.reduce((acc, coin) => {
            acc[coin.symbol] = {
                logoUrl: coin.logoUrl,
                name: coin.name,
                _id: coin._id
            };
            return acc;
        }, {});

        // Get detailed information for each user
        const usersWithDetails = await Promise.all(users.map(async (user) => {
            // Get user's stakings
            const stakings = await Staking.find({ user: user._id })
                .populate('coin')
                .lean();

            // Get referrals where user is referrer
            const referrals = await Referral.find({ referrer: user._id })
                .populate('referred')
                .lean();

            // Get topups
            const topups = await Topup.find({ user: user._id })
                .populate('coin')
                .lean();

            // Get withdrawals
            const withdrawals = await Withdrawal.find({ user: user._id })
                .populate('coin')
                .lean();

            // Calculate balances
            const coinBalances = {};
            let totalBalanceUSDT = 0;

            // Calculate total balance from approved topups only
            const totalBalance = topups.reduce((sum, topup) => {
                if (topup.status === 'APPROVED') {
                    return sum + topup.amount;
                }
                return sum;
            }, 0);

            // Calculate balances per coin (net balance after topups and withdrawals)
            topups.forEach(topup => {
                if (topup.status === 'APPROVED') {
                    const coinSymbol = topup.coin.symbol;
                    coinBalances[coinSymbol] = (coinBalances[coinSymbol] || 0) + topup.amount;
                }
            });

            withdrawals.forEach(withdrawal => {
                if (withdrawal.status === 'APPROVED') {
                    const coinSymbol = withdrawal.coin.symbol;
                    coinBalances[coinSymbol] = (coinBalances[coinSymbol] || 0) - withdrawal.amount;
                }
            });

            // Convert each coin balance to USDT
            await Promise.all(Object.entries(coinBalances).map(async ([symbol, amount]) => {
                try {
                    if (symbol === 'USDT') {
                        totalBalanceUSDT += amount;
                    } else {
                        const response = await axios({
                            method: "get",
                            url: `https://rest.coinapi.io/v1/exchangerate/${symbol}/USDT`,
                            headers: {
                                Accept: "text/plain",
                                "X-CoinAPI-Key": process.env.NEXT_PUBLIC_COINAPI_KEY,
                            },
                        });
                        
                        const rate = response.data.rate;
                        totalBalanceUSDT += amount * rate;
                    }
                } catch (error) {
                    console.error(`Error fetching exchange rate for ${symbol}:`, error);
                    // If we can't get the rate, we'll skip this coin in the total
                }
            }));

            // Calculate total staked amount in USDT
            let totalStaked = 0;
            await Promise.all(stakings.map(async (stake) => {
                if (stake.status === 'ACTIVE') {
                    try {
                        if (stake.coin.symbol === 'USDT') {
                            totalStaked += stake.amount;
                        } else {
                            const response = await axios({
                                method: "get",
                                url: `https://rest.coinapi.io/v1/exchangerate/${stake.coin.symbol}/USDT`,
                                headers: {
                                    Accept: "text/plain",
                                    "X-CoinAPI-Key": process.env.NEXT_PUBLIC_COINAPI_KEY,
                                },
                            });
                            
                            const rate = response.data.rate;
                            totalStaked += stake.amount * rate;
                        }
                    } catch (error) {
                        console.error(`Error fetching exchange rate for staked ${stake.coin.symbol}:`, error);
                        // If we can't get the rate, we'll skip this stake in the total
                    }
                }
            }));

            // Calculate referral rewards
            const referralRewards = referrals.reduce((sum, referral) => {
                if (referral.status === 'REWARDED') {
                    return sum + referral.reward;
                }
                return sum;
            }, 0);

            // Modified byCoin calculation
            const byCoin = {};
            Object.entries(coinBalances).forEach(([symbol, amount]) => {
                byCoin[symbol] = {
                    amount: Math.max(0, amount), // Ensure non-negative
                    ...coinMap[symbol] // Spread in the coin details
                };
            });

            // Ensure no negative balances
            for (const coin in coinBalances) {
                coinBalances[coin] = Math.max(0, coinBalances[coin]);
            }

            // Get coin details and ensure no negative amounts
            const coinDetails = await Promise.all(
                Object.keys(coinBalances).map(async (coinName) => {
                    const coin = await Coin.findOne({ name: coinName });
                    return {
                        amount: Math.max(0, coinBalances[coinName]), // Ensure non-negative
                        name: coinName,
                        logoUrl: coin?.logoUrl,
                        _id: coin?._id
                    };
                })
            );

            return {
                _id: user._id,
                email: user.email,
                username: user.username,
                status: user.status,
                referralCode: user.referralCode,
                verified: user.verified,
                role: user.role,
                balances: {
                    total: Math.max(0, totalBalance), // Total of all approved topups
                    staked: Math.max(0, totalStaked),
                    referralRewards: Math.max(0, referralRewards),
                    byCoin: byCoin
                },
                stakings: stakings.map(stake => ({
                    _id: stake._id,
                    coin: stake.coin.symbol,
                    coinName: stake.coin,
                    amount: stake.amount,
                    apy: stake.apy,
                    status: stake.status,
                    startDate: stake.startDate,
                    endDate: stake.endDate,
                    dailyProfits: stake.dailyProfits
                })),
                referrals: referrals.map(ref => ({
                    referredUser: {
                        email: ref.referred.email,
                        username: ref.referred.username
                    },
                    status: ref.status,
                    reward: ref.reward,
                    stakeAmount: ref.stakeAmount
                })),
                transactions: {
                    topups: topups.map(topup => ({
                        amount: topup.amount,
                        coin: topup.coin.symbol,
                        status: topup.status,
                        date: topup.createdAt
                    })),
                    withdrawals: withdrawals.map(withdrawal => ({
                        amount: withdrawal.amount,
                        coin: withdrawal.coin.symbol,
                        status: withdrawal.status,
                        date: withdrawal.createdAt
                    }))
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