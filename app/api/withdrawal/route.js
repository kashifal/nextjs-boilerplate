import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Withdrawal from '@/models/withdrawal';
import Topup from '@/models/topup'; // We'll need this to check balances

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (userId) {
      const withdrawals = await Withdrawal.find({ user: userId })
        .populate('coin')
        .sort({ createdAt: -1 });
      return NextResponse.json({ withdrawals }, { status: 200 });
    }
    
    // Admin route to get all withdrawals
    const withdrawals = await Withdrawal.find({})
      .populate('coin')
      .populate('user')
      .sort({ createdAt: -1 });
    return NextResponse.json({ withdrawals }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Check available balance
    const approvedTopups = await Topup.find({
      user: data.user,
      coin: data.coinId,
      status: 'APPROVED'
    });
    
    const totalBalance = approvedTopups.reduce((sum, topup) => sum + topup.amount, 0);
    
    // Get existing pending withdrawals
    const pendingWithdrawals = await Withdrawal.find({
      user: data.user,
      coin: data.coinId,
      status: 'PENDING'
    });
    
    const pendingAmount = pendingWithdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);
    
    const availableBalance = totalBalance - pendingAmount;
    
    if (data.amount > availableBalance) {
      return NextResponse.json({ 
        error: 'Insufficient balance' 
      }, { status: 400 });
    }

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      user: data.user,
      coin: data.coinId,
      amount: data.amount,
      walletAddress: data.walletAddress,
      status: 'PENDING'
    });

    // Mark the amount as pending in topups
    let remainingAmount = data.amount;
    const sortedTopups = approvedTopups.sort((a, b) => a.createdAt - b.createdAt);

    for (const topup of sortedTopups) {
      if (remainingAmount <= 0) break;

      const pendingAmount = Math.min(topup.amount, remainingAmount);
      
      await Topup.findByIdAndUpdate(topup._id, {
        pendingWithdrawals: [...(topup.pendingWithdrawals || []), {
          withdrawalId: withdrawal._id,
          amount: pendingAmount
        }]
      });

      remainingAmount -= pendingAmount;
    }

    return NextResponse.json({
      message: 'Withdrawal request created successfully',
      withdrawal
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create withdrawal request' },
      { status: 500 }
    );
  }
} 