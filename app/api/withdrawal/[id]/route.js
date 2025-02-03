import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Withdrawal from '@/models/withdrawal';
import Topup from '@/models/topup';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    if (!['APPROVED', 'REJECTED'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be either APPROVED or REJECTED' },
        { status: 400 }
      );
    }

    // Get the withdrawal request with populated references
    const withdrawal = await Withdrawal.findById(id)
      .populate('coin')
      .populate('user');

    if (!withdrawal) {
      return NextResponse.json(
        { error: 'Withdrawal request not found' },
        { status: 404 }
      );
    }

    // Get user's topups for this coin
    const userTopups = await Topup.find({
      user: withdrawal.user._id,
      coin: withdrawal.coin._id,
      status: 'APPROVED'
    });

    const totalTopupAmount = userTopups.reduce((sum, topup) => sum + topup.amount, 0);

    if (data.status === 'APPROVED') {
      // Check if user has sufficient balance
      if (totalTopupAmount < withdrawal.amount) {
        return NextResponse.json({ 
          error: 'Insufficient balance' 
        }, { status: 400 });
      }

      // Find the topups to deduct from, starting from oldest
      let remainingAmount = withdrawal.amount;
      const sortedTopups = userTopups.sort((a, b) => a.createdAt - b.createdAt);

      for (const topup of sortedTopups) {
        if (remainingAmount <= 0) break;

        const deductAmount = Math.min(topup.amount, remainingAmount);
        
        // Update topup amount
        await Topup.findByIdAndUpdate(topup._id, {
          amount: topup.amount - deductAmount
        });

        remainingAmount -= deductAmount;
      }

    } else if (data.status === 'REJECTED') {
      // No need to modify topups for rejected withdrawals
      // The pending amount will be automatically released
    }

    // Update withdrawal status
    const updatedWithdrawal = await Withdrawal.findByIdAndUpdate(
      id,
      { status: data.status },
      { new: true }
    ).populate('coin').populate('user');

    return NextResponse.json({ 
      message: `Withdrawal ${data.status.toLowerCase()} successfully`,
      withdrawal: updatedWithdrawal 
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating withdrawal:', error);
    return NextResponse.json(
      { error: 'Failed to update withdrawal status' },
      { status: 500 }
    );
  }
} 